import express from 'express';
import multer from '../middlewares/multer-config-user.js';
import { body } from 'express-validator';

import {
    login,
    registerAndroidIOS,
    registerFlutter,
    getUsers,
    findUserById,
    sendActivationCode,
    verifyCode,
    forgotPassword
} from '../controllers/userController.js';
const router = express.Router();

router.route('/login').post([body("username").isEmpty().withMessage("username is required"), body("password").isEmpty().withMessage("password is required")], login);
router.route('/registerAndroidIOS').post(multer, registerAndroidIOS);
router.route('/registerFlutter').post(multer, registerFlutter);
router.route('/getUsers').get(getUsers);
router.route('/findUserById').get(findUserById);
router.route('/sendActivationCode').post(sendActivationCode);
router.route('/verifyCode').post(verifyCode);
router.route('/forgotPassword').post(forgotPassword);

export default router;