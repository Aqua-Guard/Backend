import express from 'express';
import { GetPostPerWeek, addPost, deletePost, detectDiscriminationInText, generateDescriptionWithChat, getAllPosts, getAllPostsAdmin, getAllPostsByUser, getPostById, sharePost, updatePost } from '../controllers/post.js';
import { body } from 'express-validator';
import BadWordsFilter from 'bad-words';
import multer from '../middlewares/multer-config-post.js';
import { addComment, getCommentsByPost } from '../controllers/comment.js';
import { addLike, dislikePost, isPostLiked } from '../controllers/like.js';




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
    ],
        addPost)
    .get(getAllPosts);

router
    .route('/postByCurrentUser')
    .get(getAllPostsByUser);
router
    .route('/getAdmin')
    .get(getAllPostsAdmin);
    
router
    .route('/PostPerWeekstat')
    .get(GetPostPerWeek);
    
router
    .route('/generateDescriptionWithChat/:prompt')
    .get(generateDescriptionWithChat);
    
router
    .route('/detectDiscrimination/:prompt')
    .get(detectDiscriminationInText);

router
    .route('/:postId')
    .put(multer,[
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
         ] ,
        updatePost)
    .delete(deletePost)
    .get(getPostById);

//----------Likes Endpoint----------
router
    .route('/like/:postId')
    .post(addLike);
router
    .route('/dislike/:postId')
    .post(dislikePost);
router
    .route('/isLiked/:postId')
    .get(isPostLiked);
//----------------------------------
router
    .route('/:postId/comments')
    .post(
        body('comment')
            .notEmpty()
            .trim()
            .isLength({ min: 10, max: 100 })
            .withMessage('The comment must be between 10 and 100 characters long.')
            .custom((value) => {
                if (filter.isProfane(value)) {
                    throw new Error('The comment contains inappropriate language.');
                }
                return true;
            }),
        addComment)
    .get(getCommentsByPost)
router.route("/share/:postId")
.post(sharePost)

export default router;