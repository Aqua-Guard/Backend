import express from 'express';
import {addOnce} from '../controllers/reclamation.js';
import multer from '../middlewares/multer-config-reclamation.js';
const reclamationRoutes =express.Router();




reclamationRoutes
.route('/')
.post(
    multer,
    addOnce);

 




 

export default reclamationRoutes;
