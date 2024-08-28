const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('./schemaValidation/userSchema');

const registerUserValidationSchema = checkSchema(registerSchema);
const loginUserValidationSchema = checkSchema(loginSchema);

router.post('/register', registerUserValidationSchema, register);
router.post('/login', loginUserValidationSchema, login);

module.exports = router;