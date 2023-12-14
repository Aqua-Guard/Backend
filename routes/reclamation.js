import express from 'express';
import {addOnce, getAll} from '../controllers/reclamation.js';
import multer from '../middlewares/multer-config-reclamation.js';
const reclamationRoutes =express.Router();




reclamationRoutes
.route('/')
.post(
    multer,
    addOnce);
    reclamationRoutes
    .route('/get')
    .get(getAll);
 




 

export default reclamationRoutes;
