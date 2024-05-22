const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const { connection } = require('./database/connection');

//Create Node Server
const app = express();

connection();

dotenv.config();

//CORS
app.use(cors());

//Body to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  return res.status(200).send('Hola, realice su reserva');
});

app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/user', userRoutes);

const PORT = 3000;

//create server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
