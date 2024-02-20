import express from 'express';
import { getReactions, newReaction } from '../controllers/reaction.controller';
import { verifyAuthenticUser } from '../middleware/auth';

const router = express.Router();

router.get('/:postId', getReactions);
router.put('/', verifyAuthenticUser, newReaction);

export default router;