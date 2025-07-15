import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
  },
  eventId: {
    type: String,
    required: [true, 'Event ID is required'],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration; 