import express from 'express';
import { createPostComment, deletePostComment, getPostComments, updatePostComment } from '../controllers/comment.controller';
import { verifyAuthenticUser } from '../middleware/auth';

const router = express.Router();

router.get('/:postId', getPostComments);
router.post('/create', verifyAuthenticUser, createPostComment);
router.put('/update/:id', verifyAuthenticUser, updatePostComment);
router.delete('/delete/:id', verifyAuthenticUser, deletePostComment);

export default router;