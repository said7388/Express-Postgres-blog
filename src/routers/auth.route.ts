import express from 'express';
import { userLogin, userRegistration } from '../controllers/auth.controller';
import { validateInput } from '../middleware/auth';

const router = express.Router();

router.post('/registration', validateInput, userRegistration);
router.post('/login', userLogin);

export default router;