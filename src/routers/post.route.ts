import express from 'express';
import { createPost, deletePost, getAllPost, getSinglePost, getUserAllPost, updatePost } from '../controllers/post.controller';
import { verifyAuthenticUser } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPost);
router.get('/view/:id', getSinglePost);
router.get('/me', verifyAuthenticUser, getUserAllPost);
router.post('/create', verifyAuthenticUser, createPost);
router.put('/update/:id', verifyAuthenticUser, updatePost);
router.delete('/delete/:id', verifyAuthenticUser, deletePost);

export default router;