import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthRequest, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

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

const users: any[] = [];

router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterRequest;
    
    const existingUser = users.find(user => user.email === validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const newUser = {
      id: String(Date.now()),
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const token = generateToken(newUser.id);

    const response: AuthResponse = { token, user: userWithoutPassword };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body) as LoginRequest;
    
    const user = users.find(u => u.email === validatedData.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(validatedData.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    const response: AuthResponse = { token, user: userWithoutPassword };
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;