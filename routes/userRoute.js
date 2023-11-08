import express from 'express';
import multer from '../middlewares/multer-config-user.js';

import {
    login,
    register,
    getUsers,
    findUserById,
} from '../controllers/userController.js';
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(multer, register);
router.route('/getUsers').get(getUsers);
router.route('/findUserById').get(findUserById);

export default router;