import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthRequest, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { userOperations } from '../database';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterRequest;
    
    // Check if user already exists in database
    const existingUser = await userOperations.findByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create new user in database
    const newUser = await userOperations.create({
      username: validatedData.email.split('@')[0], // Use part before @ as username
      email: validatedData.email,
      password_hash: hashedPassword,
      display_name: validatedData.name,
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' // Default avatar
    });

    const { password_hash, ...userWithoutPassword } = newUser;
    const token = generateToken(String(newUser.id));

    const response: AuthResponse = { 
      token, 
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.display_name
      }
    };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginRequest;
    
    // Find user in database
    const user = await userOperations.findByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(validatedData.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    const token = generateToken(String(user.id));

    const response: AuthResponse = { 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.display_name
      }
    };
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;