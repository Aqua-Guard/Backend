import express from 'express';
import {sendMessage,deletemessageforall,deletemessageonlyforuser,deleteallllllllllmessage,sendMessageadmin} from '../controllers/discution.js';
import multer from '../middlewares/multer-config-discution.js';
const discutionRoutes =express.Router();




discutionRoutes
.route('/')
.post(multer,sendMessage)
.delete(deleteallllllllllmessage);

 discutionRoutes
 .route('/deleteonlyforuser/:id')
 .delete(deletemessageforall)
 .put(deleteallllllllllmessage)


 discutionRoutes
 .route('/sendmessageadmin')
 .post(multer,sendMessageadmin)
 


 

export default discutionRoutes;
