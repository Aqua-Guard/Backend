import express from 'express';
import {getAll,getOnce,addOnce}from '../controllers/actualite.js';
import multer from '../middlewares/multer-config-actualite.js';
const actualiteroute =express.Router();
actualiteroute
.route('/')
.get(getAll)
.post(
    multer,
    addOnce);

 
actualiteroute
 .route('/:name')
 .get(getOnce)




 

export default actualiteroute;
