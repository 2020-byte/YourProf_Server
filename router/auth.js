import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateCredential = [
    body('userId')
        .trim()
        .notEmpty()
        .isLength({ min: 2})
        .withMessage('User id should be at least 2 characters'),
    body('password')
        .trim()
        .isLength({ min: 8})
        .withMessage('Password should be at least 8 characters'),
    validate,
];

const validateSignup = [
    ...validateCredential,
    body('name').notEmpty().withMessage('Name is missing'),
    body('email').isEmail().normalizeEmail().withMessage('Invaild email'),
    validate,
]

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

router.get('/me', isAuth, authController.me);

export default router;