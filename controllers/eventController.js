const { validationResult } = require('express-validator');
const Event = require('../models/Event');

// ─── @route  GET /api/events ─────────────────────────────────────────────────
// ─── @access Public
const getEvents = async (req, res) => {
  try {
    const { search, category, faculty, date, page = 1, limit = 10 } = req.query;

    const query = {};

    // Text search (uses MongoDB text index on title + description)
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by faculty
    if (faculty) {
      query.faculty = { $regex: faculty, $options: 'i' };
    }

    // Filter by date (returns events on or after the given date)
    if (date) {
      const start = new Date(date);
      const end   = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success:     true,
      count:       events.length,
      total,
      totalPages:  Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data:        events,
    });
  } catch (err) {
    console.error('Get events error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching events.' });
  }
};

// ─── @route  GET /api/events/:id ─────────────────────────────────────────────
// ─── @access Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching event.' });
  }
};

// ─── @route  POST /api/events ────────────────────────────────────────────────
// ─── @access Private
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,
    });

    await event.populate('organizer', 'name email');

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    console.error('Create event error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating event.' });
  }
};

// ─── @route  PUT /api/events/:id ─────────────────────────────────────────────
// ─── @access Private (owner only)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this event.' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // Return updated document
      runValidators: true, // Run model validators on update
    }).populate('organizer', 'name email');

    res.json({ success: true, data: event });
  } catch (err) {
    console.error('Update event error:', err.message);
    res.status(500).json({ success: false, message: 'Server error updating event.' });
  }
};

// ─── @route  DELETE /api/events/:id ──────────────────────────────────────────
// ─── @access Private (owner only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this event.' });
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Delete event error:', err.message);
    res.status(500).json({ success: false, message: 'Server error deleting event.' });
  }
};

// ─── @route  POST /api/events/:id/rsvp ───────────────────────────────────────
// ─── @access Private
const toggleRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const userId    = req.user._id.toString();
    const hasRSVPd  = event.attendees.map(a => a.toString()).includes(userId);

    if (hasRSVPd) {
      // Remove RSVP
      event.attendees = event.attendees.filter(a => a.toString() !== userId);
    } else {
      // Check capacity before adding
      if (event.capacity && event.attendees.length >= event.capacity) {
        return res.status(400).json({ success: false, message: 'This event is at full capacity.' });
      }
      event.attendees.push(req.user._id);
    }

    await event.save();
    await event.populate('organizer', 'name email');

    res.json({
      success: true,
      rsvpd:   !hasRSVPd,
      message: hasRSVPd ? 'RSVP cancelled.' : 'RSVP confirmed!',
      data:    event,
    });
  } catch (err) {
    console.error('RSVP error:', err.message);
    res.status(500).json({ success: false, message: 'Server error processing RSVP.' });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, toggleRSVP };
