import express from 'express';
import { addLike } from '../controllers/like.js';



const router = express.Router();

router
    .route('/:postId')
    .post(addLike);


export default router;