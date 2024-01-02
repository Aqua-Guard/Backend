import express from 'express';
import {getAll,getOnce,addOnce,searchActualites,addview,addorchangelike,getliketable,addreview}from '../controllers/actualite.js';
import multer from '../middlewares/multer-config-actualite.js';
const actualiteroute =express.Router();
actualiteroute
.route('/')
.get(getAll)
.post(
    multer,
    addOnce);

 
actualiteroute
 .route('/name')
 .get(getOnce);

 actualiteroute
 .route('/search')
 .post(searchActualites);
  

 actualiteroute
 .route('/views/:actualiteId')
 .post(addview);


 actualiteroute
 .route('/addlikeforactualite/:actualiteId/:like')
 .put(addorchangelike);

 actualiteroute
 .route('/getliketable/:actualiteId/')
 .get(getliketable);


 actualiteroute
 .route('/addreviw/:actualiteId/:review')
 .put(addreview);

export default actualiteroute;
