export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  eventId: string;
  title: string;
  category: 'Venue' | 'Catering' | 'Decoration' | 'Photography' | 'Music & DJ' | 'Attire & Makeup' | 'Transportation' | 'Invitations' | 'Other';
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: 'Pending' | 'Partially Paid' | 'Fully Paid';
  notes?: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  category: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  assignedTo?: string;
  createdAt: string;
}

export interface VendorItem {
  id: string;
  eventId: string;
  name: string;
  category: 'Venue' | 'Catering' | 'Decoration' | 'Photography' | 'Music & DJ' | 'Transportation' | 'Other';
  contactPerson: string;
  phone: string;
  email: string;
  quotedPrice: number;
  status: 'Inquired' | 'Quoted' | 'Shortlisted' | 'Booked' | 'Completed';
  rating?: number;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface GuestItem {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  group: 'Family' | 'Friends' | 'VIP' | 'Colleagues' | 'General';
  status: 'Attending' | 'Declined' | 'Pending';
  plusOnes: number;
  dietaryRestrictions?: string;
  tableNumber?: string;
  invitationSent: boolean;
  createdAt: string;
}

export interface AIPlanTimelineItem {
  timeframe: string;
  title: string;
  description: string;
  category: string;
}

export interface AIPlanBudgetItem {
  category: string;
  percentage: number;
  allocatedAmount: number;
  notes: string;
}

export interface AIPlanVendorItem {
  category: string;
  role: string;
  estimatedCost: number;
  essentialQuestions: string[];
}

export interface AIPlanFoodItem {
  mealType: string;
  name: string;
  description: string;
  isVeg: boolean;
}

export interface AIPlanThemeItem {
  name: string;
  colorPalette: string[];
  vibe: string;
  decorElements: string[];
}

export interface AIPlan {
  eventOverview: {
    summary: string;
    targetVibe: string;
    keyHighlight: string;
    estimatedGuestCount: number;
    recommendedVenueType: string;
  };
  themes: AIPlanThemeItem[];
  budget: AIPlanBudgetItem[];
  timeline: AIPlanTimelineItem[];
  vendorsChecklist: AIPlanVendorItem[];
  foodSuggestions: AIPlanFoodItem[];
  decorationIdeas: string[];
  entertainmentIdeas: string[];
  tips: string[];
  generatedAt: string;
}

export interface EventData {
  id: string;
  userId: string;
  name: string;
  category: 'Wedding' | 'Birthday' | 'Anniversary' | 'College Fest' | 'Corporate' | 'Community' | 'Other';
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreference: string;
  description: string;
  additionalRequirements?: string;
  aiPlan?: AIPlan;
  createdAt: string;
  updatedAt: string;
}
