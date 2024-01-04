import Comment from '../models/comment.js';
import { validationResult } from "express-validator";
import  Post from '../models/post.js';
import { OpenAI} from 'openai';
import dotenv from 'dotenv';
import comment from '../models/comment.js';
import User from '../models/user.js';
import nodemailer from 'nodemailer';

dotenv.config();

const openai =new OpenAI({
  apiKey : process.env.OPENAI_API_KEY2,
});


// Add a comment to a post
export const addComment = async (req, res) => {
    const userId = req.user.userId;
   // console.log(req.params.postId, userId, req.body.content) // Current user
   const postId = req.params.postId;
  
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        const newComment = new Comment({
            postId: req.params.postId,
            userId: userId,
            comment: req.body.comment,
        });
         try { 
            // Fetch the post that you want to like
         const post = await Post.findById(postId);
         if (!post) {
             return res.status(404).json({ message: 'Post not found' });
         }

            post.nbComments += 1;
            await post.save();
            await newComment.save();

            const savedComment = await Comment.findById(newComment._id)
                .populate('userId', 'userId firstName lastName image')
                .lean();

            const response = {
                idUser: userId,
                idPost: savedComment.postId,
                idComment: savedComment._id,
                commentAvatar: savedComment.userId.image, // Update with actual logic to get avatar
                commentUsername: `${savedComment.userId.firstName} ${savedComment.userId.lastName}`, // Update with actual logic to get username
                comment: savedComment.comment
            };



            res.status(201).send(response);     
        } catch (error) {
            res.status(500).send({ message : "Error adding comment"}); 
        }
    }
};

export const getCommentsByPost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId;
    console.log(userId)
    try {
        const comments = await Comment.find({ postId: postId })
            .populate('userId', 'firstName lastName image') // Populate only specific fields
            .lean();
        const formattedComments = comments.map(comment => {
            return {
                idUser: userId, 
                idPost: postId, 
                idComment: comment._id,
                commentAvatar: comment.userId.image,
                commentUsername: `${comment.userId.firstName} ${comment.userId.lastName}`,
                comment: comment.comment
            };
        }).filter(comment => comment !== null); // Filter out null comments

        res.json(formattedComments);

    } catch (error) {
        console.error('Error getting comments for post:', error);
        res.status(500).send('Error getting comments');
    }
};


export const getCommentsByIdPost = async (postId) => {
    try {
        const comments = await Comment.find({ postId: postId })
            .populate('userId', 'userId firstName lastName image') // Populate only specific fields
            .lean();
        return comments.map(comment => {
            return {
                idUser: comment.userId._id,
                idPost: comment.postId._id,
                idComment : comment._id,
                commentAvatar: comment.userId.image,
                commentUsername: `${comment.userId.firstName} ${comment.userId.lastName}`,
                comment: comment.comment
            };
        });
            
    } catch (error) {
        console.error('Error getting comments for post:', error);
        return []; // Return an empty array on error
    }
};

export const getCommentsByIdPostAdmin = async (postId) => {
    try {
        
        const comments = await Comment.find({ postId: postId })
            .sort({ createdAt: -1 })
            .populate('userId', 'userId firstName lastName image') // Populate only specific fields
            .lean();
       
        return comments.map(comment => {
            const commentedAt = timeAgo(comment.createdAt);


            return {
                idUser: comment.userId._id,
                idPost: comment.postId._id,
                idComment : comment._id,
                commentAvatar: comment.userId.image,
                commentUsername: `${comment.userId.firstName} ${comment.userId.lastName}`,
                comment: comment.comment,
                commentedAt : commentedAt
            };
        });
            
    } catch (error) {
        console.error('Error getting comments for post:', error);
        return []; // Return an empty array on error
    }
};

function timeAgo(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        return `${parseInt(secondsPast)}s ago`;
    }
    if (secondsPast < 3600) {
        return `${parseInt(secondsPast / 60)}m ago`;
    }
    if (secondsPast <= 86400) {
        return `${parseInt(secondsPast / 3600)}h ago`;
    }
    if (secondsPast > 86400) {
        const day = date.getDate();
        const month = date.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        const year = date.getFullYear() == now.getFullYear() ? "" : ` ${date.getFullYear()}`;
        return `${day} ${month}${year}`;
    }
}
// Update a specific comment
export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        try {
            const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: 'Error updating comment', error });
        }
    }
};

// Delete a specific comment
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is required." });
    }
    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

// Delete a specific comment
export const deleteadminComment = async (req, res) => {
    const { commentId } = req.params;
   
    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is required." });
    }
    try {

       const comment = await Comment.findById(commentId);

      

        const user = await User.findOne({ _id: comment.userId });
      
            if (user) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.SENDER_EMAIL,
                        pass: process.env.PASSWORD_EMAIL,
                    },
                });

                const htmlString = `
                <body style='font-family: Verdana, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                <table width='100%' cellpadding='0' style='max-width: 620px; margin: 30px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.15);'>
                    <tr>
                        <td style='padding: 30px;'>
                            <h2 style='color: #00689B; font-size: 24px;'>Comment Deleted</h2>
                            <p>Dear <strong>${user.firstName} ${user.lastName}</strong>,</p>
                            <p>We regret to inform you that your recent comment on our platform has been removed due to its violation of our community standards against discrimination.</p>
                            <p>It's important to us to maintain a respectful and inclusive environment for all users. We appreciate your understanding and cooperation in this matter.</p>
                            <p>If you have any questions, please don't hesitate to contact our support team.</p>
                            <p>Warm regards,</p>
                            <p><strong>Aqua Guard Team</strong></p>
                        </td>
                    </tr>
                </table>
            </body>
            
          `;

          await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Comment Deletion Notification',
            html: htmlString,
        });
            }


            const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};
