const router = require('express').Router();
const cors = require('cors');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/authController');

// Middleware
router.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/logout', logoutUser)

router.get('/user', getUser)

module.exports = router