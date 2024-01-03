import express from 'express';
import {addOnce, getAll,getAllByUserId} from '../controllers/reclamation.js';
import {getAllMessages} from '../controllers/discution.js';

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

    
    reclamationRoutes
    .route('/getdiscution/:reclamationId')
    .post(
        multer,getAllMessages);

        reclamationRoutes
        .route('/getbyuserId')
        .get(getAllByUserId);
 


 

export default reclamationRoutes;
