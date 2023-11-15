import Post from "../models/post.js";
import { validationResult } from "express-validator";
import { getCommentsByIdPost } from "./comment.js";

// Create a new post
export function addPost(req, res) { 
    const userId = req.user.userId;
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }else{
          const newPost = new Post({
            userId: userId,
            description: req.body.description,
            image: req.file.filename,
        });
        newPost.save()
            .then(post => res.status(201).json(post))
            .catch(err => res.status(500).json({ error: err }));
    }
} 
// Retrieve all posts
export function getAllPosts(req, res) {
    Post.find()
        .populate('userId', 'username role image') 
        .then(async posts => {
            const transformedPosts = await Promise.all(posts.map(async post => {
                const comments = await getCommentsByIdPost(post._id); // Await the comments
                return {
                    userName: post.userId?.username,
                    userRole: post.userId?.role,
                    userImage: post.userId?.image,
                    description: post.description,
                    postImage: post.image,
                    nbLike: post.nbLike,
                    nbComments: post.nbComments,
                    nbShare: post.nbShare, // Ensure this field exists or is calculated
                    comments: comments
                };
            }));
            res.status(200).json(transformedPosts);
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: err });
        });
}

// Retrieve a post by id
export function getPost(req, res) {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: "Post not found." });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
}
// Update a specific post
export function updatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const postId = req.params.postId;
    if (!postId) {
        return res.status(400).json({ error: "Post ID is required." });
    }
    Post.findByIdAndUpdate(postId, req.body, { new: true })
    
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: "Post not found." });
            }
        })
        .catch(err => {
            // If there's an error related to the cast of the ID (e.g., invalid format), return a 400 error
            if (err.name === 'CastError') {
                return res.status(400).json({ error: "Invalid post ID format." });
            }
            res.status(500).json({ error: err.message });
        });
}

// Delete a specific post
export function deletePost(req, res) {
    const postId = req.params.postId;
    if (!postId) {
        return res.status(400).json({ error: "Post ID is required." });
    }
    Post.findByIdAndDelete({ "_id": postId })
        .then(post => {
            if (post) {
                res.status(200).json({ message: "Post successfully deleted.", post: post });
            } else {
                res.status(404).json({ error: "Post not found." });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
}
// Retrieve all posts by a specific user

export function getAllPostsByUser(req, res) {
    const userId = req.user.userId;
    Post.find({ userId: userId })
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ error: "No posts found for this user." });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
}

// Like a post
export async function likePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.userId;
    
    if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

       
        post.likes.push(userId);
        post.nbLike += 1;

        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error liking the post', error });
    }
}

// Dislike a post
export async function dislikePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    try {

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You cannot dislike a post you have not liked' });
        }

        // Remove userId from likes array and decrement nbLike
        post.likes = post.likes.filter((userLikeId) => userLikeId.toString() !== userId.toString());
        post.nbLike -= 1;

        await post.save();
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error disliking the post', error });
    }
}
