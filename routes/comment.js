import express from 'express';
import { body } from 'express-validator';
import BadWordsFilter from 'bad-words';
import { deleteComment, deleteadminComment, updateComment } from '../controllers/comment.js';


const router = express.Router();
const filter = new BadWordsFilter();

router
    .route('/:commentId')
    .put(
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
            })
        , updateComment)
    .delete(deleteComment);

router
    .route('/admin/:commentId')
    .delete(deleteadminComment);
export default router;