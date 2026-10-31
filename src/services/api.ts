import { EventData, ExpenseItem, TaskItem, VendorItem, GuestItem, AIPlan, EventStats } from '../types';

const TOKEN_KEY = 'eventify_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string) {
    const res = await request<{ message: string; token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAuthToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{ message: string; token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res;
  },

  async loginDemo() {
    const res = await request<{ message: string; token: string; user: any }>('/api/auth/demo', {
      method: 'POST',
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: any }>('/api/auth/me');
  },

  async forgotPassword(email: string) {
    return request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Events
  async getEvents() {
    return request<{ events: EventData[] }>('/api/events');
  },

  async createEvent(eventData: Partial<EventData> & { generatePlanImmediately?: boolean }) {
    return request<{ event: EventData }>('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async getEvent(id: string) {
    return request<{
      event: EventData;
      expenses: ExpenseItem[];
      tasks: TaskItem[];
      vendors: VendorItem[];
      guests: GuestItem[];
      stats: EventStats;
    }>(`/api/events/${id}`);
  },

  async updateEvent(id: string, updates: Partial<EventData>) {
    return request<{ event: EventData }>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(id: string) {
    return request<{ message: string }>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Actions
  async regenerateAIPlan(id: string, options: { themePreference?: string; additionalRequirements?: string }) {
    return request<{ event: EventData; aiPlan: AIPlan }>(`/api/events/${id}/ai-plan`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },

  async optimizeBudget(id: string) {
    return request<{
      summary: string;
      healthScore: number;
      savingsIdentified: number;
      recommendations: Array<{ category: string; tip: string; potentialSavings: string; priority: 'High' | 'Medium' | 'Low' }>;
      negotiationTips: string[];
    }>(`/api/events/${id}/budget-optimizer`, {
      method: 'POST',
    });
  },

  async generateInvitation(id: string, tone: 'elegant' | 'casual' | 'rhyme' | 'royal' | 'corporate') {
    return request<{
      whatsappText: string;
      formalText: string;
      smsText: string;
      subjectLine: string;
    }>(`/api/events/${id}/invitation`, {
      method: 'POST',
      body: JSON.stringify({ tone }),
    });
  },

  async askAssistant(id: string, message: string, history: Array<{ role: 'user' | 'model'; content: string }>) {
    return request<{ reply: string }>(`/api/events/${id}/assistant`, {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  },

  // Expenses
  async addExpense(eventId: string, data: Partial<ExpenseItem>) {
    return request<{ expense: ExpenseItem }>(`/api/events/${eventId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateExpense(eventId: string, expenseId: string, data: Partial<ExpenseItem>) {
    return request<{ expense: ExpenseItem }>(`/api/events/${eventId}/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteExpense(eventId: string, expenseId: string) {
    return request<{ success: boolean }>(`/api/events/${eventId}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  },

  // Tasks
  async addTask(eventId: string, data: Partial<TaskItem>) {
    return request<{ task: TaskItem }>(`/api/events/${eventId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(eventId: string, taskId: string, data: Partial<TaskItem>) {
    return request<{ task: TaskItem }>(`/api/events/${eventId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTask(eventId: string, taskId: string) {
    return request<{ success: boolean }>(`/api/events/${eventId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  // Vendors
  async addVendor(eventId: string, data: Partial<VendorItem>) {
    return request<{ vendor: VendorItem }>(`/api/events/${eventId}/vendors`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateVendor(eventId: string, vendorId: string, data: Partial<VendorItem>) {
    return request<{ vendor: VendorItem }>(`/api/events/${eventId}/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteVendor(eventId: string, vendorId: string) {
    return request<{ success: boolean }>(`/api/events/${eventId}/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },

  // Guests
  async addGuest(eventId: string, data: Partial<GuestItem>) {
    return request<{ guest: GuestItem }>(`/api/events/${eventId}/guests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateGuest(eventId: string, guestId: string, data: Partial<GuestItem>) {
    return request<{ guest: GuestItem }>(`/api/events/${eventId}/guests/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteGuest(eventId: string, guestId: string) {
    return request<{ success: boolean }>(`/api/events/${eventId}/guests/${guestId}`, {
      method: 'DELETE',
    });
  },
};
