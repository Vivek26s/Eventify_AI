import { Router, Response } from 'express';
import { dbStore } from '../db/store.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import {
  generateEventPlanWithAI,
  optimizeBudgetWithAI,
  generateInvitationCopy,
  chatWithEventAssistant,
} from '../services/gemini.js';
import { EventData, ExpenseItem, TaskItem, VendorItem, GuestItem } from '../types.js';

const router = Router();

// Protect all event routes with authentication
router.use(authMiddleware);

// GET /api/events - List user events
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const events = dbStore.getEventsByUser(req.user!.id);
  return res.json({ events });
});

// POST /api/events - Create new event
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      category,
      date,
      location,
      guestCount,
      totalBudget,
      currency = 'INR',
      themePreference = 'Modern & Elegant',
      description = '',
      additionalRequirements = '',
      generatePlanImmediately = true,
    } = req.body;

    if (!name || !category || !date || !location || !guestCount || !totalBudget) {
      return res.status(400).json({ error: 'Please provide all required event details.' });
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Generate AI Plan if requested
    let aiPlan;
    if (generatePlanImmediately) {
      aiPlan = await generateEventPlanWithAI({
        name,
        category,
        date,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        currency,
        themePreference,
        description,
        additionalRequirements,
      });
    }

    const newEvent: EventData = {
      id: eventId,
      userId: req.user!.id,
      name,
      category,
      date,
      location,
      guestCount: Number(guestCount),
      totalBudget: Number(totalBudget),
      currency,
      themePreference,
      description,
      additionalRequirements,
      aiPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.createEvent(newEvent);

    // Bootstrap initial expenses, tasks, and vendors from AI plan if available
    if (aiPlan?.budget && aiPlan.budget.length > 0) {
      aiPlan.budget.forEach((bItem, i) => {
        const expense: ExpenseItem = {
          id: `exp_${Date.now()}_${i}`,
          eventId,
          title: `${bItem.category} - Initial Allocation`,
          category: (bItem.category.includes('Venue')
            ? 'Venue'
            : bItem.category.includes('Catering') || bItem.category.includes('Food')
            ? 'Catering'
            : bItem.category.includes('Decor')
            ? 'Decoration'
            : bItem.category.includes('Photo')
            ? 'Photography'
            : bItem.category.includes('Music') || bItem.category.includes('DJ')
            ? 'Music & DJ'
            : 'Other') as any,
          estimatedCost: bItem.allocatedAmount,
          actualCost: 0,
          paidAmount: 0,
          status: 'Pending',
          notes: bItem.notes,
          createdAt: new Date().toISOString(),
        };
        dbStore.createExpense(expense);
      });
    }

    if (aiPlan?.timeline && aiPlan.timeline.length > 0) {
      aiPlan.timeline.forEach((tItem, i) => {
        const task: TaskItem = {
          id: `tsk_${Date.now()}_${i}`,
          eventId,
          title: tItem.title,
          category: tItem.category,
          dueDate: tItem.timeframe,
          priority: i < 2 ? 'High' : 'Medium',
          completed: false,
          assignedTo: req.user!.name.split(' ')[0],
          createdAt: new Date().toISOString(),
        };
        dbStore.createTask(task);
      });
    }

    if (aiPlan?.vendorsChecklist && aiPlan.vendorsChecklist.length > 0) {
      aiPlan.vendorsChecklist.forEach((vItem, i) => {
        const vendor: VendorItem = {
          id: `vnd_${Date.now()}_${i}`,
          eventId,
          name: `${vItem.role} (Curated)`,
          category: (vItem.category.includes('Venue')
            ? 'Venue'
            : vItem.category.includes('Catering')
            ? 'Catering'
            : vItem.category.includes('Decor')
            ? 'Decoration'
            : vItem.category.includes('Photo')
            ? 'Photography'
            : vItem.category.includes('Music')
            ? 'Music & DJ'
            : 'Other') as any,
          contactPerson: 'Recommended by Eventify AI',
          phone: '+91 98000 00000',
          email: 'curated@eventify.ai',
          quotedPrice: vItem.estimatedCost,
          status: 'Inquired',
          rating: 4.8,
          notes: `Essential Inquiries: ${vItem.essentialQuestions.join('; ')}`,
          isDemo: true,
          createdAt: new Date().toISOString(),
        };
        dbStore.createVendor(vendor);
      });
    }

    return res.status(201).json({ event: newEvent });
  } catch (err: any) {
    console.error('[Events] Create error:', err);
    return res.status(500).json({ error: 'Failed to create event: ' + err.message });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const event = dbStore.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const expenses = dbStore.getExpenses(event.id);
  const tasks = dbStore.getTasks(event.id);
  const vendors = dbStore.getVendors(event.id);
  const guests = dbStore.getGuests(event.id);

  // Calculate budget stats
  const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (e.actualCost || 0), 0);
  const totalPaid = expenses.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
  const remainingBalance = event.totalBudget - (totalActual > 0 ? totalActual : totalEstimated);

  return res.json({
    event,
    expenses,
    tasks,
    vendors,
    guests,
    stats: {
      totalEstimated,
      totalActual,
      totalPaid,
      remainingBalance,
      taskCount: tasks.length,
      tasksCompleted: tasks.filter((t) => t.completed).length,
      guestCount: guests.length,
      attendingGuests: guests
        .filter((g) => g.status === 'Attending')
        .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0),
    },
  });
});

// PUT /api/events/:id - Update event details
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  const existing = dbStore.getEventById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const updated = dbStore.updateEvent(req.params.id, req.body);
  return res.json({ event: updated });
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const success = dbStore.deleteEvent(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Event not found' });
  }
  return res.json({ message: 'Event successfully removed' });
});

// POST /api/events/:id/ai-plan - Regenerate AI plan
router.post('/:id/ai-plan', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = dbStore.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { themePreference, additionalRequirements } = req.body;
    const plan = await generateEventPlanWithAI({
      name: event.name,
      category: event.category,
      date: event.date,
      location: event.location,
      guestCount: event.guestCount,
      totalBudget: event.totalBudget,
      currency: event.currency,
      themePreference: themePreference || event.themePreference,
      description: event.description,
      additionalRequirements: additionalRequirements || event.additionalRequirements,
    });

    const updated = dbStore.updateEvent(event.id, {
      aiPlan: plan,
      themePreference: themePreference || event.themePreference,
    });

    return res.json({ event: updated, aiPlan: plan });
  } catch (err: any) {
    console.error('[AI Plan] Regeneration error:', err);
    return res.status(500).json({ error: 'Failed to generate AI plan' });
  }
});

// POST /api/events/:id/budget-optimizer - Run AI Budget Optimizer
router.post('/:id/budget-optimizer', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = dbStore.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const expenses = dbStore.getExpenses(event.id);
    const optimization = await optimizeBudgetWithAI(event, expenses);
    return res.json(optimization);
  } catch (err: any) {
    console.error('[Budget Optimizer] Error:', err);
    return res.status(500).json({ error: 'Failed to optimize budget' });
  }
});

// POST /api/events/:id/invitation - Generate AI Invitation
router.post('/:id/invitation', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = dbStore.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const tone = req.body.tone || 'elegant';
    const invitation = await generateInvitationCopy(event, tone);
    return res.json(invitation);
  } catch (err: any) {
    console.error('[Invitation Generator] Error:', err);
    return res.status(500).json({ error: 'Failed to generate invitation' });
  }
});

// POST /api/events/:id/assistant - Ask AI Event Assistant
router.post('/:id/assistant', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = dbStore.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const reply = await chatWithEventAssistant(event, message, history);
    return res.json({ reply });
  } catch (err: any) {
    console.error('[Event Assistant] Error:', err);
    return res.status(500).json({ error: 'Assistant error: ' + err.message });
  }
});

// Expenses CRUD
router.get('/:id/expenses', (req, res) => {
  const expenses = dbStore.getExpenses(req.params.id);
  return res.json({ expenses });
});

router.post('/:id/expenses', (req, res) => {
  const { title, category, estimatedCost, actualCost, paidAmount, status, notes } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and Category are required' });
  }

  const newExpense: ExpenseItem = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId: req.params.id,
    title,
    category,
    estimatedCost: Number(estimatedCost) || 0,
    actualCost: Number(actualCost) || 0,
    paidAmount: Number(paidAmount) || 0,
    status: status || 'Pending',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  dbStore.createExpense(newExpense);
  return res.status(201).json({ expense: newExpense });
});

router.put('/:id/expenses/:expenseId', (req, res) => {
  const updated = dbStore.updateExpense(req.params.expenseId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Expense item not found' });
  }
  return res.json({ expense: updated });
});

router.delete('/:id/expenses/:expenseId', (req, res) => {
  const success = dbStore.deleteExpense(req.params.expenseId);
  return res.json({ success });
});

// Tasks CRUD
router.get('/:id/tasks', (req, res) => {
  const tasks = dbStore.getTasks(req.params.id);
  return res.json({ tasks });
});

router.post('/:id/tasks', (req, res) => {
  const { title, category, dueDate, priority, assignedTo } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask: TaskItem = {
    id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId: req.params.id,
    title,
    category: category || 'General',
    dueDate: dueDate || '',
    priority: priority || 'Medium',
    completed: false,
    assignedTo: assignedTo || '',
    createdAt: new Date().toISOString(),
  };

  dbStore.createTask(newTask);
  return res.status(201).json({ task: newTask });
});

router.put('/:id/tasks/:taskId', (req, res) => {
  const updated = dbStore.updateTask(req.params.taskId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Task item not found' });
  }
  return res.json({ task: updated });
});

router.delete('/:id/tasks/:taskId', (req, res) => {
  const success = dbStore.deleteTask(req.params.taskId);
  return res.json({ success });
});

// Vendors CRUD
router.get('/:id/vendors', (req, res) => {
  const vendors = dbStore.getVendors(req.params.id);
  return res.json({ vendors });
});

router.post('/:id/vendors', (req, res) => {
  const { name, category, contactPerson, phone, email, quotedPrice, status, notes } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Vendor name and category are required' });
  }

  const newVendor: VendorItem = {
    id: `vnd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId: req.params.id,
    name,
    category,
    contactPerson: contactPerson || '',
    phone: phone || '',
    email: email || '',
    quotedPrice: Number(quotedPrice) || 0,
    status: status || 'Inquired',
    rating: 5,
    notes: notes || '',
    isDemo: false,
    createdAt: new Date().toISOString(),
  };

  dbStore.createVendor(newVendor);
  return res.status(201).json({ vendor: newVendor });
});

router.put('/:id/vendors/:vendorId', (req, res) => {
  const updated = dbStore.updateVendor(req.params.vendorId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  return res.json({ vendor: updated });
});

router.delete('/:id/vendors/:vendorId', (req, res) => {
  const success = dbStore.deleteVendor(req.params.vendorId);
  return res.json({ success });
});

// Guests CRUD
router.get('/:id/guests', (req, res) => {
  const guests = dbStore.getGuests(req.params.id);
  return res.json({ guests });
});

router.post('/:id/guests', (req, res) => {
  const { name, email, phone, group, status, plusOnes, dietaryRestrictions, tableNumber } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Guest name is required' });
  }

  const newGuest: GuestItem = {
    id: `gst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId: req.params.id,
    name,
    email: email || '',
    phone: phone || '',
    group: group || 'Friends',
    status: status || 'Pending',
    plusOnes: Number(plusOnes) || 0,
    dietaryRestrictions: dietaryRestrictions || '',
    tableNumber: tableNumber || '',
    invitationSent: false,
    createdAt: new Date().toISOString(),
  };

  dbStore.createGuest(newGuest);
  return res.status(201).json({ guest: newGuest });
});

router.put('/:id/guests/:guestId', (req, res) => {
  const updated = dbStore.updateGuest(req.params.guestId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Guest record not found' });
  }
  return res.json({ guest: updated });
});

router.delete('/:id/guests/:guestId', (req, res) => {
  const success = dbStore.deleteGuest(req.params.guestId);
  return res.json({ success });
});

export default router;
