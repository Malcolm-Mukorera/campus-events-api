const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleRSVP,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for creating/updating events
const eventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['academic', 'social', 'sports', 'career', 'other'])
    .withMessage('Invalid category'),
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
];

// Public routes
router.get('/',    getEvents);
router.get('/:id', getEvent);

// Protected routes (require login)
router.post('/',           protect, eventValidation, createEvent);
router.put('/:id',         protect, updateEvent);
router.delete('/:id',      protect, deleteEvent);
router.post('/:id/rsvp',   protect, toggleRSVP);

module.exports = router;
