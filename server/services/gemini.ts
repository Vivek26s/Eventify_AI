import { GoogleGenAI, Type } from '@google/genai';
import { AIPlan, EventData } from '../types.js';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateEventPlanWithAI(event: {
  name: string;
  category: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreference?: string;
  description?: string;
  additionalRequirements?: string;
}): Promise<AIPlan> {
  const ai = getAiClient();

  const prompt = `You are a world-class luxury and budget celebration event planner.
Generate a comprehensive, realistic, and impeccably budgeted event plan for the following event:

Event Name: ${event.name}
Category: ${event.category}
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.guestCount}
Total Budget: ${event.currency} ${event.totalBudget}
Theme Preference: ${event.themePreference || 'Modern & Elegant'}
Description: ${event.description || 'A memorable celebration with close ones.'}
Additional Requirements: ${event.additionalRequirements || 'None'}

CRITICAL BUDGET CONSTRAINTS:
1. The sum of all allocated amounts in the budget array MUST NOT exceed the total budget of ${event.currency} ${event.totalBudget}.
2. Ensure realistic figures matching the location (${event.location}) and guest count (${event.guestCount}).
3. If the budget is tight for this guest count, explicitly state how to economize without losing charm.
4. Return pure JSON matching the requested structure.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eventOverview: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  targetVibe: { type: Type.STRING },
                  keyHighlight: { type: Type.STRING },
                  estimatedGuestCount: { type: Type.NUMBER },
                  recommendedVenueType: { type: Type.STRING },
                },
                required: ['summary', 'targetVibe', 'keyHighlight', 'estimatedGuestCount', 'recommendedVenueType'],
              },
              themes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                    vibe: { type: Type.STRING },
                    decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['name', 'colorPalette', 'vibe', 'decorElements'],
                },
              },
              budget: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    percentage: { type: Type.NUMBER },
                    allocatedAmount: { type: Type.NUMBER },
                    notes: { type: Type.STRING },
                  },
                  required: ['category', 'percentage', 'allocatedAmount', 'notes'],
                },
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeframe: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                  },
                  required: ['timeframe', 'title', 'description', 'category'],
                },
              },
              vendorsChecklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    role: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER },
                    essentialQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['category', 'role', 'estimatedCost', 'essentialQuestions'],
                },
              },
              foodSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mealType: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    isVeg: { type: Type.BOOLEAN },
                  },
                  required: ['mealType', 'name', 'description', 'isVeg'],
                },
              },
              decorationIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              entertainmentIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'eventOverview',
              'themes',
              'budget',
              'timeline',
              'vendorsChecklist',
              'foodSuggestions',
              'decorationIdeas',
              'entertainmentIdeas',
              'tips',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as AIPlan;
        parsed.generatedAt = new Date().toISOString();
        return parsed;
      }
    } catch (err) {
      console.error('[Gemini Service] AI plan generation error, using fallback blueprint:', err);
    }
  }

  // High-fidelity fallback plan tailored to event type and budget
  return generateTailoredFallbackPlan(event);
}

export async function optimizeBudgetWithAI(
  event: EventData,
  expenses: { category: string; title: string; estimatedCost: number; actualCost: number }[]
): Promise<{
  summary: string;
  healthScore: number;
  savingsIdentified: number;
  recommendations: Array<{ category: string; tip: string; potentialSavings: string; priority: 'High' | 'Medium' | 'Low' }>;
  negotiationTips: string[];
}> {
  const ai = getAiClient();
  const totalActual = expenses.reduce((sum, e) => sum + (e.actualCost || e.estimatedCost || 0), 0);
  const remaining = event.totalBudget - totalActual;

  const prompt = `You are a celebrity event financial consultant and budget optimizer.
Analyze this event budget and provide concrete cost optimization advice.

Event: ${event.name} (${event.category})
Total Budget: ${event.currency} ${event.totalBudget}
Current Committed/Actual: ${event.currency} ${totalActual}
Remaining Balance: ${event.currency} ${remaining}
Guest Count: ${event.guestCount}
Location: ${event.location}

Expenses Breakdown:
${JSON.stringify(expenses, null, 2)}

Provide JSON response with:
- summary: string assessment of budget health
- healthScore: number from 0 to 100
- savingsIdentified: estimated realistic savings amount in number
- recommendations: array of { category, tip, potentialSavings, priority }
- negotiationTips: array of strings for talking with vendors`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn('[Gemini Service] Budget optimization API call failed, using heuristic engine:', err);
    }
  }

  // Heuristic optimization calculation
  const isOverBudget = remaining < 0;
  const healthScore = Math.max(20, Math.min(95, Math.round((remaining / event.totalBudget) * 100) + (isOverBudget ? 0 : 50)));
  const estimatedSavings = Math.round(event.totalBudget * 0.12);

  return {
    summary: isOverBudget
      ? `You are currently exceeding your target budget by ${event.currency} ${Math.abs(remaining).toLocaleString()}. Immediate restructuring is recommended for catering and decor.`
      : `Your budget is in good standing with ${event.currency} ${remaining.toLocaleString()} left as safe contingency buffer.`,
    healthScore,
    savingsIdentified: estimatedSavings,
    recommendations: [
      {
        category: 'Catering',
        tip: 'Consolidate live food stations into 2 flagship interactive counters rather than 4 dispersed ones to reduce chef & equipment surcharges.',
        potentialSavings: `${event.currency} ${Math.round(event.totalBudget * 0.05).toLocaleString()}`,
        priority: 'High',
      },
      {
        category: 'Decoration',
        tip: 'Opt for reusable LED mood wash lighting and local seasonal floral varieties over imported flora for stage and table centerpieces.',
        potentialSavings: `${event.currency} ${Math.round(event.totalBudget * 0.04).toLocaleString()}`,
        priority: 'Medium',
      },
      {
        category: 'Photography',
        tip: 'Negotiate package bundles that include candid drone footage and digital teaser reels instead of a la carte add-ons.',
        potentialSavings: `${event.currency} ${Math.round(event.totalBudget * 0.03).toLocaleString()}`,
        priority: 'Medium',
      },
    ],
    negotiationTips: [
      'Offer early milestone payments (e.g., 20% on contract signing) in exchange for a 5-8% overall contract discount.',
      'Ask the venue manager to waive corkage or outside sound permits by locking in non-peak weekday setups.',
      'Request complimentary basic sound and staging from the venue before booking separate audiovisual vendors.',
    ],
  };
}

export async function generateInvitationCopy(
  event: EventData,
  tone: 'elegant' | 'casual' | 'rhyme' | 'royal' | 'corporate'
): Promise<{
  whatsappText: string;
  formalText: string;
  smsText: string;
  subjectLine: string;
}> {
  const ai = getAiClient();

  const prompt = `Write creative invitation copy for an event with tone: ${tone}.
Event Details:
Name: ${event.name}
Category: ${event.category}
Date: ${event.date}
Location: ${event.location}
Host/Details: ${event.description || 'Celebrating this joyous moment with family and friends.'}

Format JSON:
{
  "subjectLine": "Catchy email or invitation title",
  "whatsappText": "Formatted for WhatsApp with emojis, bolding (*text*), linebreaks",
  "formalText": "Classic printed invitation card format with traditional RSVP phrasing",
  "smsText": "Concise text message under 160 characters with key details"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn('[Gemini Service] Invitation generation fallback:', err);
    }
  }

  return {
    subjectLine: `✨ You're Cordially Invited: ${event.name}`,
    whatsappText: `🎉 *CELEBRATE WITH US!* 🎉\n\nDear Friends & Family,\n\nYou are warmly invited to celebrate *${event.name}*!\n\n📅 *Date:* ${event.date}\n📍 *Venue:* ${event.location}\n⏰ *Time:* Evening Celebrations\n\nYour presence and blessings will make our special day truly unforgettable.\n\nKindly confirm your RSVP at your earliest convenience! ✨🥂`,
    formalText: `We request the honor of your presence to celebrate the joyous occasion of\n\n${event.name}\n\nOn the auspicious day of ${event.date}\nat ${event.location}.\n\nRSVP: Warm regards and heartfelt wishes.`,
    smsText: `You're invited to ${event.name} on ${event.date} at ${event.location}. We look forward to celebrating with you! RSVP soon.`,
  };
}

export async function chatWithEventAssistant(
  event: EventData,
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; content: string }>
): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    return `I am your Eventify AI planner for "${event.name}". Regarding "${userMessage}": For a ${event.category} in ${event.location} with ${event.guestCount} guests and a budget of ${event.currency} ${event.totalBudget.toLocaleString()}, I recommend prioritizing venue comfort, vibrant entertainment pacing, and keeping a 10% contingency fund!`;
  }

  try {
    const systemInstruction = `You are Eventify AI, a dedicated event planning concierge advising the host for this specific celebration:
Event: ${event.name}
Category: ${event.category}
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.guestCount}
Total Budget: ${event.currency} ${event.totalBudget.toLocaleString()}
Theme: ${event.themePreference}
Overview: ${event.aiPlan?.eventOverview?.summary || event.description || ''}

Respond with expert, empathetic, practical, and culturally tuned advice. Include actionable suggestions, estimated price ranges where relevant, and structured bullet points when helpful.`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    // Send history
    for (const h of history) {
      await chat.sendMessage({
        message: h.content,
      });
    }

    const res = await chat.sendMessage({
      message: userMessage,
    });

    return res.text || 'I am ready to help organize every detail of your celebration! What would you like to plan next?';
  } catch (err: any) {
    console.error('[Gemini Service] Chat assistant error:', err);
    return `Here is my advice on that: For ${event.name}, focus on early vendor confirmations, coordinating lighting with your theme (${event.themePreference}), and setting a clear itinerary so guests feel pampered!`;
  }
}

function generateTailoredFallbackPlan(event: {
  name: string;
  category: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreference?: string;
}): AIPlan {
  const b = event.totalBudget;

  const venueBudget = Math.round(b * 0.35);
  const cateringBudget = Math.round(b * 0.28);
  const decorBudget = Math.round(b * 0.15);
  const photoBudget = Math.round(b * 0.10);
  const musicBudget = Math.round(b * 0.07);
  const contingency = b - (venueBudget + cateringBudget + decorBudget + photoBudget + musicBudget);

  return {
    eventOverview: {
      summary: `A splendid ${event.category.toLowerCase()} curated for ${event.guestCount} guests at ${event.location}. Balanced for high elegance, memorable guest experiences, and disciplined fiscal execution.`,
      targetVibe: `${event.themePreference || 'Modern Elegant'}, Vibrant, and Welcoming`,
      keyHighlight: `Custom thematic stage design with signature interactive dining and evening entertainment.`,
      estimatedGuestCount: event.guestCount,
      recommendedVenueType: event.category === 'Wedding' ? 'Luxury Banquet Lawn / Heritage Resort' : 'Boutique Hotel Ballroom or Rooftop Pavilion',
    },
    themes: [
      {
        name: event.themePreference || 'Contemporary Elegance',
        colorPalette: ['#7C3AED', '#EC4899', '#F8FAFC', '#38BDF8'],
        vibe: 'Modern sophisticated aura with illuminated floral pathways and sleek accents.',
        decorElements: ['Geometric backdrop arches', 'Fairy light ceiling mesh', 'Ambient warm uplighting', 'Bespoke photo lounge'],
      },
      {
        name: 'Enchanted Twilight Gala',
        colorPalette: ['#1E1B4B', '#6D28D9', '#F43F5E', '#FEF08A'],
        vibe: 'Dramatic evening glow with candlelight luminescence and deep velvet jewel tones.',
        decorElements: ['Candelabra table centerpieces', 'Suspended wisteria clusters', 'Starlight projection dancefloor'],
      },
    ],
    budget: [
      { category: 'Venue & Infrastructure', percentage: 35, allocatedAmount: venueBudget, notes: 'Main hall/lawn rental, power generator backup, and basic security.' },
      { category: 'Catering & Beverages', percentage: 28, allocatedAmount: cateringBudget, notes: `Full culinary course with live counters tailored for ${event.guestCount} attendees.` },
      { category: 'Decoration & Ambience', percentage: 15, allocatedAmount: decorBudget, notes: 'Stage backdrop, floral accents, entrance arch, and atmospheric lighting.' },
      { category: 'Photography & Videography', percentage: 10, allocatedAmount: photoBudget, notes: 'Candid photographer, highlight reels, and digital cloud gallery.' },
      { category: 'Music, Sound & Entertainment', percentage: 7, allocatedAmount: musicBudget, notes: 'Professional DJ, acoustic sound system, and MC/host.' },
      { category: 'Contingency & Reserves', percentage: 5, allocatedAmount: contingency, notes: 'Emergency fund for unexpected guest additions and vendor overruns.' },
    ],
    timeline: [
      { timeframe: '6 Weeks Prior', title: 'Lock Venue & Core Catering Menu', description: 'Finalize deposits and verify guest capacity constraints.', category: 'Venue' },
      { timeframe: '4 Weeks Prior', title: 'Send Digital Invitations & Collect RSVPs', description: 'Distribute WhatsApp cards and record guest dietary preferences.', category: 'Invitations' },
      { timeframe: '2 Weeks Prior', title: 'Decor & Audiovisual Technical Walkthrough', description: 'Review stage lighting, sound levels, and backup power equipment.', category: 'Operations' },
      { timeframe: '1 Week Prior', title: 'Final Headcount & Vendor Check-ins', description: 'Communicate final guest count to catering team and lock schedule.', category: 'Catering' },
      { timeframe: 'Day of Event', title: 'Setup Execution & Host Welcome', description: 'Sound check 2 hours prior to doors opening; welcome drinks ready.', category: 'Execution' },
    ],
    vendorsChecklist: [
      { category: 'Venue', role: 'Banquet / Lawn Operations Manager', estimatedCost: venueBudget, essentialQuestions: ['What is the sound curfew limit?', 'Is dedicated valet parking available?'] },
      { category: 'Catering', role: 'Head Executive Chef & Banquet Catering', estimatedCost: cateringBudget, essentialQuestions: ['Are tasting sessions provided beforehand?', 'What is the staff-to-guest ratio?'] },
      { category: 'Decoration', role: 'Theme Floral & Stage Stylist', estimatedCost: decorBudget, essentialQuestions: ['Are props and stage lighting included in the quote?', 'When can your setup crew access the hall?'] },
      { category: 'Photography', role: 'Lead Candid Photographer & Videographer', estimatedCost: photoBudget, essentialQuestions: ['What is the delivery timeline for edited photos and teaser?', 'Do you provide raw footage backup?'] },
      { category: 'Music & DJ', role: 'Sound Engineer & Resident DJ', estimatedCost: musicBudget, essentialQuestions: ['Will you accommodate custom guest playlist requests?', 'Is microphone and PA setup provided?'] },
    ],
    foodSuggestions: [
      { mealType: 'Welcome Appetizer', name: 'Artisan Paneer Tikka & Herb Tartlets', description: 'Chargrilled cottage cheese infused with fresh mint and tangy glazes.', isVeg: true },
      { mealType: 'Main Course', name: 'Signature Dal Makhani & Royal Biryani', description: 'Slow-cooked rich lentil curry served with fragrant basmati dum biryani.', isVeg: true },
      { mealType: 'Live Specialty', name: 'Interactive Gourmet Pasta & Chaat Counter', description: 'Custom-tossed pasta and savory crispy street snacks made fresh on demand.', isVeg: true },
      { mealType: 'Sweet Finale', name: 'Gulab Jamun with Kulfi & Belgian Brownie', description: 'Warm syrup-soaked dumplings paired with chilled saffron ice cream.', isVeg: true },
    ],
    decorationIdeas: [
      'Warm illuminated fairy light canopy suspended across the main celebration area.',
      'Custom neon celebration sign mounted on a lush green boxwood foliage wall.',
      'Sleek floral entryway tunnel with scented blossoms and candle lanterns.',
      'Interactive guestbook station with instant Polaroid cameras and metallic pens.',
    ],
    entertainmentIdeas: [
      'High-energy live percussionist collaborating with the DJ during the peak party hour.',
      'Personalized couple/host trivia countdown game on the main video screen.',
      'Signature cocktail & mocktail mixologist crafting themed drinks.',
      'Cold pyro sparklers and synchronized confetti blast during the keynote moment.',
    ],
    tips: [
      'Always reserve at least 5% of your total budget for last-minute tips, transport, and extra plates.',
      'Appoint one trusted friend or coordinator to be the single point of contact for vendor questions during the event.',
      'Confirm the venue generator backup switches on automatically within 10 seconds of any municipal power cut.',
      'Capture a private family photo session 30 minutes before general guests arrive.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
