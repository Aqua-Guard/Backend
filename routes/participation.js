import express from 'express';
import { addOnce, getAll, deleteOne,getAllByUser,isParticipated,deleteParticipation,deleteParticipationAdmin } from '../controllers/participation.js';
import User from "../models/user.js";

function isAdmin(req, res, next) {
    User.findById(req.user.userId).then(user => {
        // Check if the user has the 'admin' role
        if (user.role === 'admin') {
            return next(); // User is an admin, proceed to the next middleware or route handler
        } else {
            return res.status(403).json({ message: 'Unauthorized' }); // User is not an admin, send a forbidden response
        }
    })
    }


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

router
    .route('/admin/:eventId/:userId')
    .delete(isAdmin,deleteParticipationAdmin);

export default router;