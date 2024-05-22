const express = require('express');
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/unavailable', bookingController.unavailable);
router.get('/', auth, bookingController.getBookingByUser);
router.post('/', auth, bookingController.saveBooking);
router.delete('/:id', auth, bookingController.deleteBooking);
router.patch('/:id', auth, bookingController.updateBooking);

module.exports = router;
