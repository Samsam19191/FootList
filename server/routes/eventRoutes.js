const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new event
router.post('/', async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
    });
    try {
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await Event.deleteOne({ _id: req.params.id });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update an event
router.patch('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.title = req.body.title;
        event.date = req.body.date;
        event.time = req.body.time;
        event.location = req.body.location;
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
