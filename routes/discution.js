import express from 'express';
import {sendMessage} from '../controllers/discution.js';
import multer from '../middlewares/multer-config-discution.js';
const discutionRoutes =express.Router();




discutionRoutes
.route('/')
.post(
    multer,
    sendMessage);

 




 

export default discutionRoutes;
