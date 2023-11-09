import express from 'express';
import { addPost, deletePost, dislikePost, getAllPosts, getAllPostsByUser, likePost, updatePost } from '../controllers/post.js';
import { body } from 'express-validator';
import BadWordsFilter from 'bad-words';
import multer from '../middlewares/multer-config-post.js';


const router = express.Router();
const filter = new BadWordsFilter();

router
    .route('/')

    .post(multer, [
        body('description')
            .notEmpty()
            .trim()
            .isLength({ min: 20, max: 300 })
            .withMessage('The description must be between 20 and 300 characters long.')
            .custom((value) => {
                if (filter.isProfane(value)) {
                    throw new Error('The description contains inappropriate language.');
                }
                return true;
            })
        ,
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
    ],
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
            .custom((value) => {
                if (filter.isProfane(value)) {
                    throw new Error('The description contains inappropriate language.');
                }
                return true;
            })
        ,
        body('image')
            .notEmpty()
            .trim()
            .isURL()
            .withMessage('The image must be a valid URL.'),
        multer,
        updatePost)
    .delete(deletePost);


router
    .route('/like/:postId')
    .put(likePost);
router
    .route('/dislike/:postId')
    .put(dislikePost);
export default router;