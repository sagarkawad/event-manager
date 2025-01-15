import express from 'express';
import { auth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ startTime: 1 }).populate('createdBy', 'email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.userId,
    });
    await event.save();

    // Broadcast updated events
    const events = await Event.find().sort({ startTime: 1 });
    req.io.emit('events-updated', events);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);
    await event.save();

    // Broadcast updated events
    const events = await Event.find().sort({ startTime: 1 });
    req.io.emit('events-updated', events);

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Broadcast updated events
    const events = await Event.find().sort({ startTime: 1 });
    req.io.emit('events-updated', events);

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendeeIndex = event.attendees.findIndex((a) => a.user.toString() === req.userId);

    if (attendeeIndex > -1) {
      event.attendees.splice(attendeeIndex, 1);
    } else {
      event.attendees.push({ user: req.userId });
    }

    await event.save();

    // Broadcast updated events
    const events = await Event.find().sort({ startTime: 1 });
    req.io.emit('events-updated', events);

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
