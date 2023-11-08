import express from 'express';
import { addPost, deletePost, getAllPosts, getAllPostsByUser, updatePost } from '../controllers/post.js';
import { body } from 'express-validator';

const router = express.Router();


router
    .route('/')
    .post(
        body('description')
            .notEmpty()
            .trim()
            .isLength({ min: 20, max: 300 })
            .withMessage('The description must be between 20 and 300 characters long.')
           
        ,
        body('image')
            .notEmpty()
            .trim()
            .isURL()
            .withMessage('The image must be a valid URL.'),
        body('userId')
            .notEmpty()
            .withMessage('User ID must not be empty.')
            .isMongoId()
            .withMessage('User ID must be a valid MongoDB ObjectId.'),
        body('nbLike')
            .optional()
            .isInt({ min: 0 })
            .withMessage('The number of likes must be a non-negative integer.')
            .toInt(),
        addPost)
    .get(getAllPosts);

router
    .route('/:userId')
    .get(getAllPostsByUser);
    

router
    .route('/:postId')
    .put(
        body('description')
            .notEmpty()
            .trim()
            .isLength({ min: 20, max: 300 })
            .withMessage('The description must be between 20 and 300 characters long.')
            
        ,
        body('image')
            .notEmpty()
            .trim()
            .isURL()
            .withMessage('The image must be a valid URL.'),
            updatePost)
            .delete(deletePost);
export default router;