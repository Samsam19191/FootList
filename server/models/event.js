const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  nbParticipants: { type: Number, required: true },
  participants: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  waitlist: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
});

// Pre-save middleware to enforce unique email addresses for participants
eventSchema.pre("save", function (next) {
  const event = this;

  // Get all participant and waitlist emails
  const emails = [
    ...event.participants.map((p) => p.email),
    ...event.waitlist.map((w) => w.email),
  ];

  // Check for duplicates in the participants array
  const uniqueEmails = new Set(emails);
  if (uniqueEmails.size !== emails.length) {
    return next(
      new Error(
        "Duplicate email addresses are not allowed for participants in this event"
      )
    );
  }

  next();
});

module.exports = mongoose.model("Event", eventSchema);
