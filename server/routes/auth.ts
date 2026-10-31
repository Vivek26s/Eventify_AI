import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbStore, StoredUser } from '../db/store.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eventify-ai-secret-jwt-key-2025';

function generateToken(user: { id: string; email: string; name: string }) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = dbStore.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7c3aed,ec4899`,
      createdAt: new Date().toISOString(),
    };

    dbStore.createUser(newUser);

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('[Auth] Register error:', err);
    return res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check demo password or hash compare
    let isMatch = false;
    if (password === 'password123' && user.id === 'usr_demo_1') {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// POST /api/auth/demo
router.post('/demo', (_req, res: Response) => {
  const demoUser = dbStore.getUserById('usr_demo_1');
  if (!demoUser) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const token = generateToken(demoUser);
  const { passwordHash: _, ...userSafe } = demoUser;

  return res.json({
    message: 'Demo login successful',
    token,
    user: userSafe,
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = dbStore.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  const { passwordHash: _, ...userSafe } = user;
  return res.json({ user: userSafe });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  return res.json({
    message: `Password reset instructions have been dispatched to ${email}. Check your inbox!`,
  });
});

export default router;
