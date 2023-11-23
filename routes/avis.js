import express from 'express';
import { addOnceAvis, getAllavis ,getOncebi,addOrUpdateAvis}from '../controllers/avis.js';
const avisroute =express.Router();



avisroute
.route('/')
.get(getAllavis)
.post(addOnceAvis);
 
avisroute
.route('/addupdates')
.post(addOrUpdateAvis);
avisroute
.route('/:iduser/:idactualite')
.get(getOncebi)





 

export default avisroute;
