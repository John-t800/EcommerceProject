const users_auth = require('../controllers/users_auth.js');
const router = require('express').Router();

router.post('/register',users_auth.register);
router.post('/login', users_auth.login);
router.post('/logout', users_auth.logout);

module.exports = router;
