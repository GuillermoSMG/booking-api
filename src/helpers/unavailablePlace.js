const Booking = require('../schemas/bookingSchema');

const unavailablePlace = async place => {
  const unavailablesObj = await Booking.find();
  const unavailablePlaces = unavailablesObj.map(item => item.place);
  return unavailablePlaces.includes(place);
};

module.exports = { unavailablePlace };
