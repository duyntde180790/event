import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event; 