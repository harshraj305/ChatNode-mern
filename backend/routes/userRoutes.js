const express = require('express');

const {
    registerUser,
    authUser,
    allUsers
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// router.route('/').post(registerUser).get(allUsers);
router.post('/', registerUser);
router.post('/login', authUser);

router.get('/', protect, allUsers);

module.exports = router;