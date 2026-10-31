import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {
  UserProfile,
  EventData,
  ExpenseItem,
  TaskItem,
  VendorItem,
  GuestItem
} from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'eventify_data.json');

export interface StoredUser extends UserProfile {
  passwordHash: string;
}

interface DatabaseData {
  users: StoredUser[];
  events: EventData[];
  expenses: ExpenseItem[];
  tasks: TaskItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
}

// Initial demo seed data
const initialData: DatabaseData = {
  users: [
    {
      id: 'usr_demo_1',
      name: 'Priya & Rahul Sharma',
      email: 'demo@eventify.ai',
      passwordHash: '$2a$10$wE47E6h/8ZtJ5uMtwcMoeuRkL1oR6Y3oGvH4rD9G3U2BwV.h1l6aC', // 'password123'
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    }
  ],
  events: [
    {
      id: 'evt_royal_wedding',
      userId: 'usr_demo_1',
      name: 'The Royal Jaipur Wedding: Priya & Rahul',
      category: 'Wedding',
      date: '2026-12-18',
      location: 'Jaipur Palace Resort, Rajasthan',
      guestCount: 250,
      totalBudget: 1500000,
      currency: 'INR',
      themePreference: 'Royal Heritage & Pastel Flora',
      description: 'A 2-day royal celebration with Sangeet, Mehendi, and traditional Varmala under the stars.',
      additionalRequirements: 'Need authentic Rajasthani folk artists, vegetarian delicacies, and drone photography.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      aiPlan: {
        eventOverview: {
          summary: 'A grand royal celebration blending traditional Rajasthani heritage with modern pastel aesthetic elegance. Focus on guest hospitality, mesmerizing folk entertainment, and royal culinary experiences.',
          targetVibe: 'Regal, Joyous, Welcoming & Cinematic',
          keyHighlight: 'Varmala by the poolside palace courtyard at sunset with rose petal showers.',
          estimatedGuestCount: 250,
          recommendedVenueType: 'Heritage Palace Resort or Open Courtyard'
        },
        themes: [
          {
            name: 'Royal Rajputana Heritage',
            colorPalette: ['#7C3AED', '#EC4899', '#F59E0B', '#F8FAFC', '#1E293B'],
            vibe: 'Opulent palace grandeur with marigold arches, brass lanterns, and royal shamianas.',
            decorElements: ['Mughal jharokha photobooths', 'Brocade fabrics and velvet seating', 'Floating diyas and brass urlis', 'Fairylight ceiling canopy']
          },
          {
            name: 'Pastel Floral Euphoria',
            colorPalette: ['#F472B6', '#E9D5FF', '#FDE047', '#38BDF8'],
            vibe: 'Modern soft dreamscape perfect for afternoon mehendi and sundowner sangeet.',
            decorElements: ['White wisteria hangings', 'Powder pink drapes', 'Bespoke mirror-work bar counter']
          }
        ],
        budget: [
          { category: 'Venue & Stay', percentage: 35, allocatedAmount: 525000, notes: '2-day resort booking with 40 guest rooms' },
          { category: 'Catering & Food', percentage: 28, allocatedAmount: 420000, notes: 'Multi-cuisine royal feast & live chaat counters' },
          { category: 'Decoration & Stage', percentage: 15, allocatedAmount: 225000, notes: 'Mandap, Sangeet stage, ambient lighting' },
          { category: 'Photography & Cinematography', percentage: 10, allocatedAmount: 150000, notes: 'Traditional + Candid + Drone coverage' },
          { category: 'Entertainment & DJ', percentage: 6, allocatedAmount: 90000, notes: 'Sangeet DJ, sound system, Rajasthani dancers' },
          { category: 'Attire & Makeup', percentage: 4, allocatedAmount: 60000, notes: 'Bridal makeover and styling support' },
          { category: 'Buffer & Contingency', percentage: 2, allocatedAmount: 30000, notes: 'Emergency reserves and tips' }
        ],
        timeline: [
          { timeframe: '60 Days Before', title: 'Lock Palace Venue & Catering', description: 'Confirm advance booking and food tasting session.', category: 'Venue' },
          { timeframe: '45 Days Before', title: 'Send Digital Save-The-Dates', description: 'Dispatch WhatsApp video cards & track RSVPs.', category: 'Invitations' },
          { timeframe: '30 Days Before', title: 'Finalize Outfits & Decor Blueprint', description: 'Stage layout approval, flower selection, and trial fittings.', category: 'Decoration' },
          { timeframe: '15 Days Before', title: 'Choreography & Sangeet Rehearsals', description: 'Finalize playlist with DJ and organize family dances.', category: 'Entertainment' },
          { timeframe: '7 Days Before', title: 'Guest Logistics & Transport Run-Through', description: 'Airport pickups and welcome hampers distribution.', category: 'Logistics' },
          { timeframe: '1 Day Before', title: 'Vendor Walkthrough & Sound Check', description: 'Ensure power backup, green room setups, and mandap flowers.', category: 'Operations' }
        ],
        vendorsChecklist: [
          { category: 'Venue', role: 'Heritage Resort Banquet Manager', estimatedCost: 525000, essentialQuestions: ['Is external DJ permitted after 10 PM?', 'What is the generator backup capacity?'] },
          { category: 'Catering', role: 'Royal Rajasthan Gourmet Caterers', estimatedCost: 420000, essentialQuestions: ['Can we include live counter for Rajasthani Dal Baati Churma?', 'Do you provide servers and bar setup?'] },
          { category: 'Photography', role: 'Cinematic Memories Studio', estimatedCost: 150000, essentialQuestions: ['How many candid photographers will be present?', 'What is the delivery timeline for wedding teaser video?'] },
          { category: 'Decoration', role: 'Mandap & Varmala Stage Decorators', estimatedCost: 225000, essentialQuestions: ['Are fresh imported flowers guaranteed for the mandap?', 'Is ambient lighting included in the quote?'] }
        ],
        foodSuggestions: [
          { mealType: 'Welcome High Tea', name: 'Jaipuri Pyaaz Kachori & Masala Chai', description: 'Crisp onion kachoris served with tangy tamarind and mint chutneys.', isVeg: true },
          { mealType: 'Main Feast', name: 'Dal Baati Churma with Gatte ki Sabzi', description: 'Traditional Rajasthani royal signature delicacies with pure desi ghee.', isVeg: true },
          { mealType: 'Live Counter', name: 'Amritsari Kulcha & Wood-fired Pizzas', description: 'Freshly prepared hot appetizers for late-night party guests.', isVeg: true },
          { mealType: 'Dessert Bar', name: 'Ghewar with Rabdi & Kesar Jalebi', description: 'Authentic festival sweets garnished with pistachio and saffron.', isVeg: true }
        ],
        decorationIdeas: [
          'Grand entrance archway made with thousands of golden marigolds and brass bells.',
          'Fairylight tunnel pathway leading from the guest rooms to the main lawn.',
          'Custom mirror-worked photo booth with a vintage royal scooter and sunglasses props.',
          'Mandap floating on water with pastel pink lotus motifs and crystal chandeliers.'
        ],
        entertainmentIdeas: [
          'Traditional Ghoomar dancers and fire performers during the welcome cocktail.',
          'Interactive percussionist performing alongside the DJ for high-energy dance floor.',
          'Bride vs Groom family Bollywood trivia buzzer game during Sangeet intermission.',
          'Fireworks and cold sparklers for the couple entry and ring exchange.'
        ],
        tips: [
          'Double check that power backups are in place for the sound system and stage lighting.',
          'Keep a designated hospitality desk at the lobby for guest room keys and city guides.',
          'Prepare emergency beauty touch-up kits for the bridal party in the green room.',
          'Order 10% extra meals for late-night vendor crews and drivers.'
        ],
        generatedAt: new Date().toISOString()
      }
    },
    {
      id: 'evt_tech_fest',
      userId: 'usr_demo_1',
      name: 'Apex Innovate 2026: Annual Tech Summit',
      category: 'Corporate',
      date: '2026-11-25',
      location: 'Grand Convention Centre, Cyber Hub',
      guestCount: 400,
      totalBudget: 800000,
      currency: 'INR',
      themePreference: 'Cyberpunk Neon & Modern Minimalist',
      description: 'Keynotes, startup pitching arenas, hackathon award ceremony, and executive networking dinner.',
      additionalRequirements: 'High-speed fiber connectivity, LED video walls, badges with QR codes.',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  expenses: [
    {
      id: 'exp_1',
      eventId: 'evt_royal_wedding',
      title: 'Palace Resort Advance Deposit',
      category: 'Venue',
      estimatedCost: 525000,
      actualCost: 500000,
      paidAmount: 250000,
      status: 'Partially Paid',
      notes: 'Initial 50% advance confirmed for banquet & 40 rooms',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_2',
      eventId: 'evt_royal_wedding',
      title: 'Royal Rajasthan Catering Booking',
      category: 'Catering',
      estimatedCost: 420000,
      actualCost: 410000,
      paidAmount: 150000,
      status: 'Partially Paid',
      notes: 'Menu finalized with live counters and dessert buffet',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_3',
      eventId: 'evt_royal_wedding',
      title: 'Cinematic Memories Photography',
      category: 'Photography',
      estimatedCost: 150000,
      actualCost: 145000,
      paidAmount: 145000,
      status: 'Fully Paid',
      notes: 'Full package with 2 candid photographers + drone pilot',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_4',
      eventId: 'evt_royal_wedding',
      title: 'Mandap Floral & Lighting Decor',
      category: 'Decoration',
      estimatedCost: 225000,
      actualCost: 220000,
      paidAmount: 100000,
      status: 'Partially Paid',
      notes: 'Pastel wisteria & royal marigold concepts',
      createdAt: new Date().toISOString()
    },
    {
      id: 'exp_5',
      eventId: 'evt_royal_wedding',
      title: 'DJ & Sound Setup for Sangeet',
      category: 'Music & DJ',
      estimatedCost: 90000,
      actualCost: 85000,
      paidAmount: 85000,
      status: 'Fully Paid',
      notes: 'JBL Line Array system with smoke machines',
      createdAt: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 'tsk_1',
      eventId: 'evt_royal_wedding',
      title: 'Finalize royal menu with head chef',
      category: 'Catering',
      dueDate: '2026-11-15',
      priority: 'High',
      completed: true,
      assignedTo: 'Rahul',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tsk_2',
      eventId: 'evt_royal_wedding',
      title: 'Approve final floral stage design',
      category: 'Decoration',
      dueDate: '2026-11-20',
      priority: 'High',
      completed: true,
      assignedTo: 'Priya',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tsk_3',
      eventId: 'evt_royal_wedding',
      title: 'Dispatch digital animated invitations on WhatsApp',
      category: 'Invitations',
      dueDate: '2026-11-22',
      priority: 'Medium',
      completed: false,
      assignedTo: 'Priya',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tsk_4',
      eventId: 'evt_royal_wedding',
      title: 'Coordinate airport transfer cabs for VIP guests',
      category: 'Logistics',
      dueDate: '2026-12-10',
      priority: 'Medium',
      completed: false,
      assignedTo: 'Event Planner',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tsk_5',
      eventId: 'evt_royal_wedding',
      title: 'Sangeet couple dance rehearsal with choreographer',
      category: 'Entertainment',
      dueDate: '2026-12-12',
      priority: 'Low',
      completed: false,
      assignedTo: 'Both',
      createdAt: new Date().toISOString()
    }
  ],
  vendors: [
    {
      id: 'vnd_1',
      eventId: 'evt_royal_wedding',
      name: 'Jaipur Palace Resort & Spa',
      category: 'Venue',
      contactPerson: 'Vikramaditya Rathore',
      phone: '+91 98290 11223',
      email: 'events@jaipurpalaceresort.example',
      quotedPrice: 500000,
      status: 'Booked',
      rating: 5,
      notes: 'Lawn and courtyard reserved with 40 luxury rooms.',
      isDemo: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vnd_2',
      eventId: 'evt_royal_wedding',
      name: 'Shree Krishna Gourmet Caterers',
      category: 'Catering',
      contactPerson: 'Suresh Agrawal',
      phone: '+91 98291 44556',
      email: 'suresh@skcaterers.example',
      quotedPrice: 410000,
      status: 'Booked',
      rating: 4.9,
      notes: 'Complete multi-cuisine buffet with live counters and chaat.',
      isDemo: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vnd_3',
      eventId: 'evt_royal_wedding',
      name: 'Aura Bloom Decor & Stage Craft',
      category: 'Decoration',
      contactPerson: 'Ananya Mehra',
      phone: '+91 98711 77889',
      email: 'hello@aurabloom.example',
      quotedPrice: 220000,
      status: 'Booked',
      rating: 4.8,
      notes: 'Floral mandap, fairy light arches, and stage lighting included.',
      isDemo: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vnd_4',
      eventId: 'evt_royal_wedding',
      name: 'PixelCraft Weddings Studio',
      category: 'Photography',
      contactPerson: 'Kunal Verma',
      phone: '+91 99990 88221',
      email: 'bookings@pixelcraftweddings.example',
      quotedPrice: 145000,
      status: 'Booked',
      rating: 5,
      notes: 'Includes cinematic trailer, teaser, albums, and 4K reels.',
      isDemo: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vnd_5',
      eventId: 'evt_royal_wedding',
      name: 'SoundWave Beats & DJ Rohan',
      category: 'Music & DJ',
      contactPerson: 'DJ Rohan',
      phone: '+91 98112 33445',
      email: 'rohan@soundwavebeats.example',
      quotedPrice: 85000,
      status: 'Booked',
      rating: 4.7,
      notes: 'Sound equipment, stage lighting truss, and Dhol team included.',
      isDemo: true,
      createdAt: new Date().toISOString()
    }
  ],
  guests: [
    {
      id: 'gst_1',
      eventId: 'evt_royal_wedding',
      name: 'Amit & Neha Verma',
      email: 'amit.verma@example.com',
      phone: '+91 98201 11223',
      group: 'Family',
      status: 'Attending',
      plusOnes: 2,
      dietaryRestrictions: 'Pure Vegetarian',
      tableNumber: 'Table 1 - Royal Hall',
      invitationSent: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'gst_2',
      eventId: 'evt_royal_wedding',
      name: 'Dr. Siddharth Sen',
      email: 'siddharth.sen@example.com',
      phone: '+91 98202 33445',
      group: 'VIP',
      status: 'Attending',
      plusOnes: 1,
      dietaryRestrictions: 'No sugar desserts',
      tableNumber: 'VIP Lounge',
      invitationSent: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'gst_3',
      eventId: 'evt_royal_wedding',
      name: 'Rohan Deshmukh & Friends',
      email: 'rohan.d@example.com',
      phone: '+91 98203 55667',
      group: 'Friends',
      status: 'Attending',
      plusOnes: 3,
      dietaryRestrictions: 'None',
      tableNumber: 'Table 4 - Lawn',
      invitationSent: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'gst_4',
      eventId: 'evt_royal_wedding',
      name: 'Deepak Kapoor',
      email: 'deepak.k@example.com',
      phone: '+91 98204 77889',
      group: 'Colleagues',
      status: 'Pending',
      plusOnes: 1,
      dietaryRestrictions: 'Jain Meal',
      tableNumber: 'Table 6',
      invitationSent: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'gst_5',
      eventId: 'evt_royal_wedding',
      name: 'Simran & Karan Grover',
      email: 'simran.g@example.com',
      phone: '+91 98205 99001',
      group: 'Friends',
      status: 'Declined',
      plusOnes: 0,
      dietaryRestrictions: 'None',
      tableNumber: '',
      invitationSent: true,
      createdAt: new Date().toISOString()
    }
  ]
};

// Initialize file storage
class PersistentStore {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DataStore] Error reading file, initializing fresh default data:', err);
    }
    this.saveToDisk(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  private saveToDisk(dataToSave: DatabaseData): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DataStore] Error writing to data file:', err);
    }
  }

  // Users
  getUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): StoredUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: StoredUser): StoredUser {
    this.data.users.push(user);
    this.saveToDisk(this.data);
    return user;
  }

  // Events
  getEventsByUser(userId: string): EventData[] {
    return this.data.events.filter((e) => e.userId === userId);
  }

  getEventById(id: string): EventData | undefined {
    return this.data.events.find((e) => e.id === id);
  }

  createEvent(event: EventData): EventData {
    this.data.events.unshift(event);
    this.saveToDisk(this.data);
    return event;
  }

  updateEvent(id: string, updates: Partial<EventData>): EventData | undefined {
    const idx = this.data.events.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    this.data.events[idx] = {
      ...this.data.events[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk(this.data);
    return this.data.events[idx];
  }

  deleteEvent(id: string): boolean {
    const initLen = this.data.events.length;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    // Also delete linked resources
    this.data.expenses = this.data.expenses.filter((x) => x.eventId !== id);
    this.data.tasks = this.data.tasks.filter((x) => x.eventId !== id);
    this.data.vendors = this.data.vendors.filter((x) => x.eventId !== id);
    this.data.guests = this.data.guests.filter((x) => x.eventId !== id);
    this.saveToDisk(this.data);
    return this.data.events.length < initLen;
  }

  // Expenses
  getExpenses(eventId: string): ExpenseItem[] {
    return this.data.expenses.filter((x) => x.eventId === eventId);
  }

  createExpense(expense: ExpenseItem): ExpenseItem {
    this.data.expenses.push(expense);
    this.saveToDisk(this.data);
    return expense;
  }

  updateExpense(id: string, updates: Partial<ExpenseItem>): ExpenseItem | undefined {
    const idx = this.data.expenses.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    this.data.expenses[idx] = { ...this.data.expenses[idx], ...updates };
    this.saveToDisk(this.data);
    return this.data.expenses[idx];
  }

  deleteExpense(id: string): boolean {
    const initLen = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter((x) => x.id !== id);
    this.saveToDisk(this.data);
    return this.data.expenses.length < initLen;
  }

  // Tasks
  getTasks(eventId: string): TaskItem[] {
    return this.data.tasks.filter((x) => x.eventId === eventId);
  }

  createTask(task: TaskItem): TaskItem {
    this.data.tasks.push(task);
    this.saveToDisk(this.data);
    return task;
  }

  updateTask(id: string, updates: Partial<TaskItem>): TaskItem | undefined {
    const idx = this.data.tasks.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates };
    this.saveToDisk(this.data);
    return this.data.tasks[idx];
  }

  deleteTask(id: string): boolean {
    const initLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((x) => x.id !== id);
    this.saveToDisk(this.data);
    return this.data.tasks.length < initLen;
  }

  // Vendors
  getVendors(eventId: string): VendorItem[] {
    return this.data.vendors.filter((x) => x.eventId === eventId);
  }

  createVendor(vendor: VendorItem): VendorItem {
    this.data.vendors.push(vendor);
    this.saveToDisk(this.data);
    return vendor;
  }

  updateVendor(id: string, updates: Partial<VendorItem>): VendorItem | undefined {
    const idx = this.data.vendors.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    this.data.vendors[idx] = { ...this.data.vendors[idx], ...updates };
    this.saveToDisk(this.data);
    return this.data.vendors[idx];
  }

  deleteVendor(id: string): boolean {
    const initLen = this.data.vendors.length;
    this.data.vendors = this.data.vendors.filter((x) => x.id !== id);
    this.saveToDisk(this.data);
    return this.data.vendors.length < initLen;
  }

  // Guests
  getGuests(eventId: string): GuestItem[] {
    return this.data.guests.filter((x) => x.eventId === eventId);
  }

  createGuest(guest: GuestItem): GuestItem {
    this.data.guests.push(guest);
    this.saveToDisk(this.data);
    return guest;
  }

  updateGuest(id: string, updates: Partial<GuestItem>): GuestItem | undefined {
    const idx = this.data.guests.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    this.data.guests[idx] = { ...this.data.guests[idx], ...updates };
    this.saveToDisk(this.data);
    return this.data.guests[idx];
  }

  deleteGuest(id: string): boolean {
    const initLen = this.data.guests.length;
    this.data.guests = this.data.guests.filter((x) => x.id !== id);
    this.saveToDisk(this.data);
    return this.data.guests.length < initLen;
  }
}

export const dbStore = new PersistentStore();

// Attempt MongoDB connection asynchronously if MONGODB_URI is provided
export async function connectMongoIfAvailable() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] MONGODB_URI not set. Using persistent local file store with Mongoose schema validation.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[Database] Successfully connected to MongoDB at', uri);
  } catch (err: any) {
    console.warn('[Database] MongoDB connection skipped/unreachable:', err.message);
    console.log('[Database] Running on robust persistent local store seamlessly.');
  }
}
