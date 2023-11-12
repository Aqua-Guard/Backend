import express from 'express';
import { addOnce, getAll, deleteOne,getAllByUser } from '../controllers/participation.js';

const router = express.Router();

router
    .route('/')
    .post(addOnce)
    .get(getAll);

router
    .route('/:id')
    .delete(deleteOne);
router
    .route('/user/:userId')
    .get(getAllByUser);

export default router;