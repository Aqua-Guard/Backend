import express from 'express';
import { addOnceAvis, getAllavis }from '../controllers/avis.js';
const avisroute =express.Router();



avisroute
.route('/')
.get(getAllavis)
.post(addOnceAvis);





 

export default avisroute;
