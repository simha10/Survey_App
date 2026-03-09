import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { LoginSchema, RegisterSchema } from '../dtos/authDto';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt - Body:', req.body);
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation failed:', parsed.error);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Validation passed, calling authService...');
    const result = await authService.login(parsed.data);
    console.log('Login successful, returning response');
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Login error caught in controller:', error);
    if (error.status) {
      console.log(`Returning status ${error.status}:`, error.message);
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const creator = (req as any).user;
    const result = await authService.register(parsed.data, creator);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};