import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  ArrowLeft,
  Share2,
  Download,
  Bot,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Phone,
  Mail,
  Edit2,
  Filter,
  Check,
  Zap,
  TrendingDown,
  RefreshCw,
  MessageCircle,
  FileText,
  Star,
  ChevronRight,
  Utensils,
  Palette,
  Lightbulb,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { EventData, ExpenseItem, TaskItem, VendorItem, GuestItem, EventStats } from '../types';
import { exportEventPlanToPDF } from '../utils/pdfGenerator';
import { ShareModal } from '../components/ShareModal';
import { BudgetOptimizerModal } from '../components/BudgetOptimizerModal';
import { InvitationWriterModal } from '../components/InvitationWriterModal';
import { EventAssistantDrawer } from '../components/EventAssistantDrawer';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';

const CATEGORY_COLORS: Record<string, string> = {
  Venue: '#7C3AED',
  Catering: '#EC4899',
  Decoration: '#F59E0B',
  Photography: '#3B82F6',
  'Music & DJ': '#10B981',
  'Attire & Makeup': '#8B5CF6',
  Transportation: '#06B6D4',
  Invitations: '#F43F5E',
  Other: '#64748B',
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plan' | 'budget' | 'timeline' | 'vendors' | 'tasks' | 'guests'>('plan');

  // Modals & Drawers
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add Item Modals State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState<any>('Venue');
  const [newExpenseEst, setNewExpenseEst] = useState('');
  const [newExpenseAct, setNewExpenseAct] = useState('');
  const [newExpensePaid, setNewExpensePaid] = useState('');
  const [newExpenseStatus, setNewExpenseStatus] = useState<any>('Pending');

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<any>('Medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCat, setNewVendorCat] = useState<any>('Venue');
  const [newVendorContact, setNewVendorContact] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [newVendorPrice, setNewVendorPrice] = useState('');
  const [newVendorStatus, setNewVendorStatus] = useState<any>('Inquired');

  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState<any>('Friends');
  const [newGuestPlusOnes, setNewGuestPlusOnes] = useState(0);
  const [newGuestDiet, setNewGuestDiet] = useState('');

  // Filters
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [guestFilter, setGuestFilter] = useState<string>('all');

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (id) {
      loadEventData();
    }
  }, [id]);

  const loadEventData = async () => {
    setLoading(true);
    try {
      const res = await api.getEvent(id!);
      setEvent(res.event);
      setExpenses(res.expenses || []);
      setTasks(res.tasks || []);
      setVendors(res.vendors || []);
      setGuests(res.guests || []);
      setStats(res.stats);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load celebration data');
    } finally {
      setLoading(false);
    }
  };

  // Re-calculate local stats
  const totalActual = expenses.reduce((sum, e) => sum + (e.actualCost || 0), 0);
  const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
  const totalPaid = expenses.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
  const remainingBudget = (event?.totalBudget || 0) - (totalActual > 0 ? totalActual : totalEstimated);

  // Recharts Chart Data
  const chartDataByCategory = Object.keys(CATEGORY_COLORS).map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat);
    const estimated = catExpenses.reduce((s, e) => s + e.estimatedCost, 0);
    const actual = catExpenses.reduce((s, e) => s + e.actualCost, 0);
    return {
      category: cat,
      estimated,
      actual,
      amount: actual > 0 ? actual : estimated,
    };
  }).filter((c) => c.amount > 0 || c.estimated > 0);

  // Handlers for Expenses
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseTitle) return;

    try {
      const res = await api.addExpense(event!.id, {
        title: newExpenseTitle,
        category: newExpenseCat,
        estimatedCost: Number(newExpenseEst) || 0,
        actualCost: Number(newExpenseAct) || 0,
        paidAmount: Number(newExpensePaid) || 0,
        status: newExpenseStatus,
      });
      setExpenses((prev) => [...prev, res.expense]);
      setIsAddExpenseOpen(false);
      setNewExpenseTitle('');
      setNewExpenseEst('');
      setNewExpenseAct('');
      setNewExpensePaid('');
      showToast('success', 'Expense recorded successfully');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteExpense = async (expId: string) => {
    try {
      await api.deleteExpense(event!.id, expId);
      setExpenses((prev) => prev.filter((x) => x.id !== expId));
      showToast('info', 'Expense deleted');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Handlers for Tasks
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      const res = await api.addTask(event!.id, {
        title: newTaskTitle,
        category: newTaskCategory,
        dueDate: newTaskDueDate,
        priority: newTaskPriority,
        assignedTo: newTaskAssignee,
      });
      setTasks((prev) => [...prev, res.task]);
      setIsAddTaskOpen(false);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskAssignee('');
      showToast('success', 'Task added to checklist');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleToggleTask = async (t: TaskItem) => {
    const updatedStatus = !t.completed;
    try {
      await api.updateTask(event!.id, t.id, { completed: updatedStatus });
      setTasks((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, completed: updatedStatus } : item))
      );
      if (updatedStatus) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        showToast('success', `Completed: "${t.title}"`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(event!.id, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast('info', 'Task removed');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Handlers for Vendors
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName) return;

    try {
      const res = await api.addVendor(event!.id, {
        name: newVendorName,
        category: newVendorCat,
        contactPerson: newVendorContact,
        phone: newVendorPhone,
        email: newVendorEmail,
        quotedPrice: Number(newVendorPrice) || 0,
        status: newVendorStatus,
      });
      setVendors((prev) => [...prev, res.vendor]);
      setIsAddVendorOpen(false);
      setNewVendorName('');
      setNewVendorContact('');
      setNewVendorPhone('');
      setNewVendorEmail('');
      setNewVendorPrice('');
      showToast('success', 'Vendor registered');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await api.deleteVendor(event!.id, vendorId);
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      showToast('info', 'Vendor deleted');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Handlers for Guests
  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName) return;

    try {
      const res = await api.addGuest(event!.id, {
        name: newGuestName,
        email: newGuestEmail,
        phone: newGuestPhone,
        group: newGuestGroup,
        plusOnes: Number(newGuestPlusOnes) || 0,
        dietaryRestrictions: newGuestDiet,
      });
      setGuests((prev) => [...prev, res.guest]);
      setIsAddGuestOpen(false);
      setNewGuestName('');
      setNewGuestEmail('');
      setNewGuestPhone('');
      setNewGuestDiet('');
      showToast('success', 'Guest added');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleUpdateGuestStatus = async (guestId: string, status: any) => {
    try {
      await api.updateGuest(event!.id, guestId, { status });
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, status } : g))
      );
      showToast('success', `Guest status updated to ${status}`);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      await api.deleteGuest(event!.id, guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      showToast('info', 'Guest removed');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleRegeneratePlan = async () => {
    showToast('info', 'Regenerating AI master plan with Gemini 3.8 Flash...');
    try {
      const res = await api.regenerateAIPlan(event!.id, {
        themePreference: event!.themePreference,
      });
      setEvent(res.event);
      showToast('success', 'AI Master Plan refreshed!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to refresh plan');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading Event Master Plan...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The requested event could not be located.
        </p>
        <Link
          to="/dashboard"
          className="py-2.5 px-5 rounded-xl bg-purple-600 text-white font-semibold text-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Gemini Copilot quick button */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="py-2 px-3.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 flex items-center gap-1.5 transition shadow-sm"
        >
          <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Ask AI Concierge</span>
        </button>
      </div>

      {/* HEADER HERO CARD */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200">
                {event.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{daysLeft >= 0 ? `${daysLeft} Days to Celebration` : 'Celebration Completed'}</span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                Theme: <strong className="text-white">{event.themePreference}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-purple-200/90 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{event.guestCount} Guests Target</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Budget: ₹{event.totalBudget.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => exportEventPlanToPDF(event, expenses, tasks, vendors)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Export PDF Plan</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-pink-300" />
              <span>Share Event</span>
            </button>

            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Budget Optimizer</span>
            </button>

            <button
              onClick={() => setIsInvitationOpen(true)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>AI Invitations</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
        {[
          { id: 'plan', label: 'AI Master Plan', icon: Sparkles },
          { id: 'budget', label: 'Budget Management', icon: Wallet },
          { id: 'timeline', label: 'Timeline & Schedule', icon: Clock },
          { id: 'vendors', label: `Vendors (${vendors.length})`, icon: Users },
          { id: 'tasks', label: `Checklist (${tasks.filter((t) => t.completed).length}/${tasks.length})`, icon: CheckCircle },
          { id: 'guests', label: `Guest List (${guests.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI MASTER PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-8 animate-fade-in">
          {/* Overview Callout */}
          {event.aiPlan?.eventOverview && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive Concept & Strategy</span>
                </span>
                <button
                  onClick={handleRegeneratePlan}
                  className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Blueprint</span>
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {event.aiPlan.eventOverview.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30">
                  <span className="font-semibold text-purple-700 dark:text-purple-300 block mb-0.5">Target Vibe</span>
                  <span className="text-slate-700 dark:text-slate-200">{event.aiPlan.eventOverview.targetVibe}</span>
                </div>
                <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-pink-950/30">
                  <span className="font-semibold text-pink-700 dark:text-pink-300 block mb-0.5">Signature Moment</span>
                  <span className="text-slate-700 dark:text-slate-200">{event.aiPlan.eventOverview.keyHighlight}</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">Venue Recommendation</span>
                  <span className="text-slate-700 dark:text-slate-200">{event.aiPlan.eventOverview.recommendedVenueType}</span>
                </div>
              </div>
            </div>
          )}

          {/* Themes & Visual Palettes */}
          {event.aiPlan?.themes && event.aiPlan.themes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-pink-500" />
                <span>Curated Theme & Color Palettes</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.aiPlan.themes.map((th, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{th.name}</h4>
                      <div className="flex items-center gap-1.5">
                        {th.colorPalette.map((color, ci) => (
                          <div
                            key={ci}
                            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {th.vibe}
                    </p>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                        Signature Decor Elements:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {th.decorElements.map((elem, ei) => (
                          <li key={ei} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                            <span>{elem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food & Catering Suggestions */}
          {event.aiPlan?.foodSuggestions && event.aiPlan.foodSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-purple-600" />
                <span>Food & Catering Recommendations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {event.aiPlan.foodSuggestions.map((food, fi) => (
                  <div
                    key={fi}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          {food.mealType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            food.isVeg
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {food.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{food.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {food.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decor & Entertainment Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Decor */}
            {event.aiPlan?.decorationIdeas && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>Decoration & Ambience Ideas</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {event.aiPlan.decorationIdeas.map((idea, ii) => (
                    <li key={ii} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Entertainment */}
            {event.aiPlan?.entertainmentIdeas && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span>Entertainment & Music Concepts</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {event.aiPlan.entertainmentIdeas.map((ent, ei) => (
                    <li key={ei} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{ent}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Important Tips & Reminders */}
          {event.aiPlan?.tips && (
            <div className="p-6 rounded-3xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60">
              <h4 className="text-base font-bold text-purple-950 dark:text-purple-200 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Host's Critical Tips & Precautions</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.aiPlan.tips.map((tip, ti) => (
                  <div key={ti} className="flex items-start gap-2 text-xs sm:text-sm text-purple-900/90 dark:text-purple-300">
                    <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUDGET MANAGEMENT */}
      {activeTab === 'budget' && (
        <div className="space-y-8 animate-fade-in">
          {/* High Level Financial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Allocated Budget</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{event.totalBudget.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">100% Target Ceiling</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Committed / Actual</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{totalActual.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Est: ₹{totalEstimated.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payments Settled</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{totalPaid.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                {totalActual > 0 ? `${Math.round((totalPaid / totalActual) * 100)}% Paid` : 'Pending initial milestones'}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm ${
              remainingBudget < 0
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
            }`}>
              <p className="text-xs font-semibold uppercase tracking-wider">Remaining Buffer</p>
              <h3 className="text-2xl font-extrabold mt-1">
                ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs font-semibold mt-1">
                {remainingBudget >= 0 ? '✓ Healthy Balance' : '⚠ Over Budget Warning'}
              </p>
            </div>
          </div>

          {/* INTERACTIVE CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart: Category Distribution */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Expense Distribution by Category
              </h4>
              <div className="h-64 w-full">
                {chartDataByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataByCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {chartDataByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[entry.category] || '#94A3B8'}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No expense data yet
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart: Estimated vs Actual */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Estimated vs Actual Spend
              </h4>
              <div className="h-64 w-full">
                {chartDataByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataByCategory}>
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                      <Legend />
                      <Bar dataKey="estimated" name="Estimated ₹" fill="#A855F7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual ₹" fill="#EC4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No expense data yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Expenses & Invoices
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed category line items and payment statuses
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOptimizerOpen(true)}
                  className="py-2 px-3 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 hover:bg-pink-100 flex items-center gap-1.5 transition"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>AI Optimize</span>
                </button>

                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5">Estimated</th>
                    <th className="py-3 px-5">Actual Quote</th>
                    <th className="py-3 px-5">Paid</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                        {exp.title}
                        {exp.notes && (
                          <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                            {exp.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#94a3b8' }}
                          />
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">
                        ₹{exp.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                        ₹{exp.actualCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        ₹{exp.paidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            exp.status === 'Fully Paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : exp.status === 'Partially Paid'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE & SCHEDULE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Countdown Preparation Itinerary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-scheduled milestones tailored to {event.date}
              </p>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-purple-600 before:via-pink-500 before:to-slate-300 dark:before:to-slate-700">
            {event.aiPlan?.timeline?.map((milestone, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                {/* Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 border-2 border-white dark:border-slate-950 shadow-md" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                      {milestone.timeframe}
                    </span>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {milestone.category}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {milestone.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VENDOR MANAGEMENT */}
      {activeTab === 'vendors' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Filter Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vendor Directory & Contracts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated venue, catering, decor, photo & entertainment partners
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddVendorOpen(true)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vendor</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {['all', 'Venue', 'Catering', 'Decoration', 'Photography', 'Music & DJ', 'Transportation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setVendorFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  vendorFilter === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Vendors' : cat}
              </button>
            ))}
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors
              .filter((v) => vendorFilter === 'all' || v.category === vendorFilter)
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {vendor.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          vendor.status === 'Booked'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{vendor.name}</h4>
                    {vendor.isDemo && (
                      <span className="text-[10px] text-slate-400 italic block mt-0.5">
                        *Curated demo partner
                      </span>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {vendor.contactPerson && (
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Contact: {vendor.contactPerson}
                        </p>
                      )}
                      {vendor.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vendor.phone}</span>
                        </p>
                      )}
                      {vendor.email && (
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{vendor.email}</span>
                        </p>
                      )}
                      {vendor.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                          "{vendor.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Quoted Price</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{vendor.quotedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: TASK CHECKLIST */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Task Checklist & Operations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track deliverables with priority tags and deadline assignments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${
                    taskFilter === 'all' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-3 py-1 rounded-lg transition ${
                    taskFilter === 'pending' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Pending ({tasks.filter((t) => !t.completed).length})
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-3 py-1 rounded-lg transition ${
                    taskFilter === 'completed' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Done ({tasks.filter((t) => t.completed).length})
                </button>
              </div>

              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-200 mb-2">
              <span>Overall Execution Progress</span>
              <span>
                {tasks.length > 0
                  ? `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}% Complete`
                  : '0%'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
                style={{
                  width: `${tasks.length > 0 ? (tasks.filter((t) => t.completed).length / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {tasks
              .filter((t) => {
                if (taskFilter === 'pending') return !t.completed;
                if (taskFilter === 'completed') return t.completed;
                return true;
              })
              .map((task) => (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${
                    task.completed ? 'bg-slate-50/60 dark:bg-slate-900/40 opacity-70' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className="text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 fill-purple-600 text-white dark:fill-purple-500 dark:text-slate-900" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-semibold text-slate-900 dark:text-white truncate ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="font-medium text-purple-600 dark:text-purple-400">{task.category}</span>
                        {task.dueDate && <span>• Due {task.dueDate}</span>}
                        {task.assignedTo && <span>• Assignee: {task.assignedTo}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        task.priority === 'High'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 6: GUEST LIST & RSVPs */}
      {activeTab === 'guests' && (
        <div className="space-y-6 animate-fade-in">
          {/* Guest Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Invitations</span>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{guests.length}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-sm text-emerald-900 dark:text-emerald-100">
              <span className="text-xs font-semibold uppercase">Confirmed Attending</span>
              <h4 className="text-2xl font-extrabold mt-1">
                {guests.filter((g) => g.status === 'Attending').reduce((sum, g) => sum + 1 + g.plusOnes, 0)} Headcount
              </h4>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm text-amber-900 dark:text-amber-100">
              <span className="text-xs font-semibold uppercase">Pending RSVPs</span>
              <h4 className="text-2xl font-extrabold mt-1">
                {guests.filter((g) => g.status === 'Pending').length} Guests
              </h4>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 shadow-sm text-rose-900 dark:text-rose-100">
              <span className="text-xs font-semibold uppercase">Declined</span>
              <h4 className="text-2xl font-extrabold mt-1">
                {guests.filter((g) => g.status === 'Declined').length}
              </h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Guest Directory & Attendance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage RSVPs, seating, and dietary accommodations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInvitationOpen(true)}
                className="py-2 px-3 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 hover:bg-pink-100 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Invitation Writer</span>
              </button>

              <button
                onClick={() => setIsAddGuestOpen(true)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guest</span>
              </button>
            </div>
          </div>

          {/* Guests Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">Guest Name</th>
                    <th className="py-3 px-5">Group</th>
                    <th className="py-3 px-5">Contact</th>
                    <th className="py-3 px-5">Headcount (+1s)</th>
                    <th className="py-3 px-5">RSVP Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {guests.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                        {g.name}
                        {g.dietaryRestrictions && (
                          <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                            Diet: {g.dietaryRestrictions}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {g.group}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {g.phone || g.email || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-slate-900 dark:text-white font-medium">
                        {1 + g.plusOnes} {g.plusOnes > 0 ? `(${g.plusOnes} guests)` : 'person'}
                      </td>
                      <td className="py-3.5 px-5">
                        <select
                          value={g.status}
                          onChange={(e) => handleUpdateGuestStatus(g.id, e.target.value)}
                          className="py-1 px-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        >
                          <option value="Attending">✓ Attending</option>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Declined">✕ Declined</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Expense Item</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                  placeholder="e.g. Sangeet DJ Sound Rig"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Estimated (₹)</label>
                  <input
                    type="number"
                    value={newExpenseEst}
                    onChange={(e) => setNewExpenseEst(e.target.value)}
                    placeholder="50000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Actual Quote (₹)</label>
                  <input
                    type="number"
                    value={newExpenseAct}
                    onChange={(e) => setNewExpenseAct(e.target.value)}
                    placeholder="48000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={newExpensePaid}
                    onChange={(e) => setNewExpensePaid(e.target.value)}
                    placeholder="20000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Payment Status</label>
                  <select
                    value={newExpenseStatus}
                    onChange={(e) => setNewExpenseStatus(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Fully Paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Checklist Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Schedule food tasting with chef"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    placeholder="Catering / Logistics"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    placeholder="e.g. 15 Days Before"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Vendor Partner</h3>
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g. Royal Beats Sound Studio"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={newVendorCat}
                    onChange={(e) => setNewVendorCat(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Photography">Photography</option>
                    <option value="Music & DJ">Music & DJ</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Quoted Price (₹)</label>
                  <input
                    type="number"
                    value={newVendorPrice}
                    onChange={(e) => setNewVendorPrice(e.target.value)}
                    placeholder="75000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newVendorContact}
                    onChange={(e) => setNewVendorContact(e.target.value)}
                    placeholder="e.g. Kunal"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newVendorPhone}
                    onChange={(e) => setNewVendorPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GUEST MODAL */}
      {isAddGuestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Guest / Party</h3>
            <form onSubmit={handleCreateGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Rajesh & Sunita Sharma"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Circle / Group</label>
                  <select
                    value={newGuestGroup}
                    onChange={(e) => setNewGuestGroup(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="VIP">VIP</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Plus Ones (+)</label>
                  <input
                    type="number"
                    min="0"
                    value={newGuestPlusOnes}
                    onChange={(e) => setNewGuestPlusOnes(parseInt(e.target.value) || 0)}
                    placeholder="1"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Diet / Remarks</label>
                  <input
                    type="text"
                    value={newGuestDiet}
                    onChange={(e) => setNewGuestDiet(e.target.value)}
                    placeholder="Pure Jain / Veg"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddGuestOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} event={event} />
      <BudgetOptimizerModal isOpen={isOptimizerOpen} onClose={() => setIsOptimizerOpen(false)} event={event} />
      <InvitationWriterModal isOpen={isInvitationOpen} onClose={() => setIsInvitationOpen(false)} event={event} />
      <EventAssistantDrawer isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} event={event} />
      <NotificationToast toasts={toasts} onDismiss={(tid) => setToasts((prev) => prev.filter((t) => t.id !== tid))} />
    </div>
  );
};
