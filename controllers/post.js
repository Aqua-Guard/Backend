import Post from "../models/post.js";
import { validationResult } from "express-validator";

// Create a new post
export function addPost(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        const newPost = new Post({
            userId: req.body.userId,
            description: req.body.description,
            image: req.body.image,
        });

        newPost.save()
            .then(post => res.status(201).json(post))
            .catch(err => res.status(500).json({ error: err }));
    }
} 
// Retrieve all posts
export function getAllPosts(req, res) {
    Post.find()
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ error: "No posts found." });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
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
    Post.find({ userId: req.params.userId })
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ error: "No posts found for this user." });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
}