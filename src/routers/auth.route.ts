import express from 'express';
import { confirmEmailLink, userForgotPassword, userLogin, userRegistration } from '../controllers/auth.controller';
import { validateInput } from '../middleware/auth';

const router = express.Router();

router.post('/registration', validateInput, userRegistration);
router.post('/login', userLogin);
router.post('/forgot-password', userForgotPassword);
router.get('/confirm/:id', confirmEmailLink);

export default router;