import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;