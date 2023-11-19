import express from 'express';
import { addOnce, getAll, deleteOne,getAllByUser,isParticipated } from '../controllers/participation.js';

const router = express.Router();

router
    .route('/')
    .get(getAll);

router
    .route('/:id')
    .delete(deleteOne);
router
    .route('/user')
    .get(getAllByUser);
router
    .route('/participate/:eventId')
    .get(isParticipated)
    .post(addOnce);

export default router;