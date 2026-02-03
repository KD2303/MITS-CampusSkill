import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getLeaderboard,
  getUsers,
  rateUser,
  getUserStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/profile/:id', getUserProfile);

// Protected routes
router.get('/', protect, getUsers);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);
router.post('/:id/rate', protect, rateUser);

export default router;
