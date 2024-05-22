const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/booking');
    console.log('Conectado a DB Booking');
  } catch (err) {
    console.log(err);
    throw new Error('No se ha podido conectar a la base de datos.');
  }
};

module.exports = {
  connection,
};
