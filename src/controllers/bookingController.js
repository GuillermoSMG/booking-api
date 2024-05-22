const { default: mongoose } = require('mongoose');
const Booking = require('../schemas/bookingSchema');
const { unavailablePlace } = require('../helpers/unavailablePlace');

const test = (_req, res) => {
  return res.status(200).send('Aquí podrá reservar');
};

const saveBooking = async (req, res) => {
  const data = req.body;
  const user = req.user.id;
  if (!data.date) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta elegir fecha.',
    });
  }
  if (!data.place) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta elegir lugar.',
    });
  }
  const isUnavailable = await unavailablePlace(data.place);
  if (isUnavailable) {
    return res.status(400).send({
      status: 'error',
      message: 'Lugar no disponible.',
    });
  }
  data.user = user;
  const booking_to_save = new Booking(data);
  try {
    await booking_to_save.save();
    return res.status(200).send({
      status: 'Exito',
      booking: booking_to_save,
    });
  } catch (err) {
    return res.status(400).send({
      status: 'error',
      message: 'error.',
    });
  }
  {
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const { deletedCount } = await Booking.deleteOne({
      _id: id,
      user: user.id,
    });
    if (deletedCount > 0) {
      return res.status(200).send({
        status: 'success',
        message: 'Se ha eliminado la reserva.',
        id,
      });
    }
    return res.status(400).send({
      status: 'error',
      message: 'No se pudo eliminar.',
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: 'No se ha podido eliminar la reserva.',
      err,
    });
  }
};

const updateBooking = async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const newData = req.body;
  if (!newData.place) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta elegir fecha.',
    });
  }
  const isUnavailable = await unavailablePlace(newData.place);
  if (isUnavailable) {
    return res.status(400).send({
      status: 'error',
      message: 'Lugar no disponible.',
    });
  }

  try {
    const result = await Booking.updateOne(
      { _id: id, user: user.id },
      { $set: newData }
    );

    if (result.modifiedCount === 0 && result.matchedCount > 0) {
      return res.status(400).send({
        status: 'error',
        message: 'Debe proporcionar un lugar diferente.',
      });
    }

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return res.status(404).send({
        status: 'error',
        message: 'No se encontró la reserva para actualizar.',
      });
    }

    return res.status(200).send({
      status: 'success',
      message: 'Reserva actualizada correctamente.',
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: 'No se pudo actualizar la reserva.',
      err,
    });
  }
};

const unavailable = async (_req, res) => {
  try {
    const unavailablesObj = await Booking.find();
    const unavailablePlaces = unavailablesObj.map(item => item.place);
    return res.status(200).send({
      status: 'success',
      message: 'Lugares no disponibles.',
      unavailablePlaces,
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: 'No se pudo recuperar los lugares disponibles.',
      err,
    });
  }
};

const getBookingByUser = async (req, res) => {
  const userId = req.user.id;
  const userBookings = await Booking.find({ user: userId });
  return res.status(200).send({
    status: 'success',
    message: 'Reservas.',
    userBookings,
  });
};

/* const available = async (req, res) => {
  const { place } = req.body;
  if (place && !isNaN(place)) {
    const availables = await Booking.findOne({ place });
    if (availables) {
      return res.status(400).send({
        status: 'error',
        message: 'Lugar no disponible.',
      });
    }
    return res.status(200).send({
      status: 'success',
      message: 'Reservado correctamente.',
    });
  }
  return res.status(400).send({
    status: 'error',
    message: 'Debe ingresar un lugar.',
  });
}; */

module.exports = {
  test,
  saveBooking,
  deleteBooking,
  updateBooking,
  unavailable,
  getBookingByUser,
};
