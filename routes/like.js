import express from 'express';
import { addLike, nbrLikes } from '../controllers/like.js';



const router = express.Router();

router
    .route('/:postId')
    .get(nbrLikes)
    .post(addLike);


export default router;