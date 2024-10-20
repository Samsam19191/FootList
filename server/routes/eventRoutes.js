const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { sendConfirmationEmail } = require("../utils/emailService");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post("/", async (req, res) => {
  const event = new Event({
    title: req.body.title,
    date: req.body.date,
    time: req.body.time,
    nbParticipants: req.body.nbParticipants,
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
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update an event
router.patch("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.title = req.body.title;
    event.date = req.body.date;
    event.time = req.body.time;
    event.nbParticipants = req.body.nbParticipants;
    event.location = req.body.location;
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join an event
router.post("/:id/join", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.participants.length >= event.nbParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Add participant
    const participant = {
      name: req.body.name,
      email: req.body.email,
    };

    event.participants.push(participant);

    // Save updated event
    const savedEvent = await event.save();

    // Send confirmation email
    const newParticipant =
      savedEvent.participants[savedEvent.participants.length - 1];
    await sendConfirmationEmail(newParticipant, savedEvent);

    res.status(200).json({ message: "You have joined the event", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a waitlist
router.post("/:id/joinWaitlist", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Add participant to waitlist
    const participant = {
      name: req.body.name,
      email: req.body.email,
    };

    event.waitlist.push(participant);

    // Save updated event
    await event.save();

    res.status(200).json({ message: "You have joined the waitlist", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// cancel participation
router.get("/:eventId/:participantId/cancel", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find participant
    const participant = event.participants.id(req.params.participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Remove participant
    const participantIndex = event.participants.findIndex(
      (participant) => participant._id.toString() === req.params.participantId
    );

    if (participantIndex === -1) {
      return res.status(404).json({ message: "Participant not found" });
    }

    event.participants.splice(participantIndex, 1);

    // Add first participant from waitlist
    if (event.waitlist.length > 0) {
      const firstWaitlistParticipant = event.waitlist.shift();
      event.participants.push(firstWaitlistParticipant);
      sendConfirmationEmail(firstWaitlistParticipant, event, true);
    }

    // Save updated event
    await event.save();

    res.json({ message: "You have canceled your participation" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete all events
router.delete("/", async (req, res) => {
  try {
    await Event.deleteMany();
    res.json({ message: "All events deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
