const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const BookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true,
  },
  place: {
    type: Number,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
