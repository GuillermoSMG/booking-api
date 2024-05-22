const express = require('express');
const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, userController.test);
router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);

module.exports = router;
