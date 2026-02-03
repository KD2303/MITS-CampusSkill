import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  takeTask,
  submitTask,
  reviewTask,
  reassignTask,
  getTasksByUser,
  getMyTasks,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTasks);
router.get('/user/:userId', getTasksByUser);

// Protected routes
router.get('/my-tasks', protect, getMyTasks);
router.post('/', protect, createTask);
router.get('/:id', getTask);
router.put('/:id/take', protect, isStudent, takeTask);
router.put('/:id/submit', protect, submitTask);
router.put('/:id/review', protect, reviewTask);
router.put('/:id/reassign', protect, reassignTask);
router.delete('/:id', protect, deleteTask);

export default router;
