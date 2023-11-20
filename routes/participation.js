import express from 'express';
import { addOnce, getAll, deleteOne,getAllByUser,isParticipated,deleteParticipation } from '../controllers/participation.js';

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
    .delete(deleteParticipation)
    .post(addOnce);

export default router;