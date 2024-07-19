const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', auth, getUser);

module.exports = router;

