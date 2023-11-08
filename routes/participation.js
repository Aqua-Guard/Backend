import express from 'express';
import { addOnce, getAll, deleteOne } from '../controllers/participation.js';

const router = express.Router();

router
    .route('/')
    .post(addOnce)
    .get(getAll);

router
    .route('/:id')
    .delete(deleteOne);

export default router;