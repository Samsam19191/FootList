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

module.exports = mongoose.model("Event", eventSchema);