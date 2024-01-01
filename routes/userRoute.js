import express from 'express';
import multer from '../middlewares/multer-config-user.js';
import { body } from 'express-validator';

import {
    login,
    loginFlutter,
    registerAndroidIOS,
    registerFlutter,
    getUsers,
    findUserById,
    sendActivationCode,
    verifyCode,
    forgotPassword,
    changePassword,
    deleteUser,
    deleteUserById,
    getPartenaires,
    updateProfile,
    desactivateAccount,
    googleSignIn,
    completeGoogleSignin
} from '../controllers/userController.js';
const router = express.Router();

router.route('/login').post([body("username").isEmpty().withMessage("username is required"), body("password").isEmpty().withMessage("password is required")], login);
router.route('/loginFlutter').post(loginFlutter);
router.route('/registerAndroidIOS').post(multer, registerAndroidIOS);
router.route('/registerFlutter').post(multer, registerFlutter);
router.route('/getUsers/:id').get(getUsers);
router.route('/findUserById').get(findUserById);
router.route('/sendActivationCode').post(sendActivationCode);
router.route('/verifyCode').post(verifyCode);
router.route('/forgotPassword').post(forgotPassword);
router.route('/updateProfile/:id').put(multer, updateProfile);
router.route('/changePassword').post(changePassword);
router.route('/googleSignIn').post(multer, googleSignIn);
router.route('/desactivateAccount/:id').post(desactivateAccount);
router.route('/deleteUser/:email').delete(deleteUser);
router.route('/deleteUserById/:id').delete(deleteUserById);
router.route('/getPartenaires').get(getPartenaires);
router.route('/completeGoogleSignin/:id').put(multer, completeGoogleSignin);
export default router;