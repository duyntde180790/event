import express from 'express';
import {
  registerForEvent,
  unregisterFromEvent,
  getRegistrations,
  getRegistrationsByDate,
  renderRegisterEvent,
  checkRegistrationStatus,
  renderListRegistrations
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { renderEventsList, renderEventDetail } from '../controllers/eventController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Student routes
router.post('/', authorize('student'), registerForEvent);
router.delete('/:registrationId', authorize('student'), unregisterFromEvent);
router.get('/register-view', authorize('student'), renderRegisterEvent);
router.get('/student-events', authorize('student'), renderEventsList);
router.get('/student-events/:id', authorize('student'), renderEventDetail);
router.get('/check', authorize('student'), checkRegistrationStatus);

// Admin routes
router.get('/', authorize('admin'), getRegistrations);
router.get('/search', authorize('admin'), getRegistrationsByDate);
router.get('/list', authorize('admin'), renderListRegistrations);

router.get('/events', renderEventsList);
router.get('/events/:id', renderEventDetail);

export default router; 