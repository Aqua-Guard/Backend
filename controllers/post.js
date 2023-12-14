import Post from "../models/post.js";
import { validationResult } from "express-validator";
import { getCommentsByIdPost } from "./comment.js";
import comment from "../models/comment.js";
import { getLikesByIdPost } from "./like.js";

// Create a new post
export function addPost(req, res) { 
    const userId = req.user.userId;
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }else{
        console.log(req.file)
          const newPost = new Post({
            userId: userId,
            description: req.body.description,
            image: req.file.filename,
        });
        newPost.save()
            .then(post => res.status(201).json( "Post Created successfully"))
            .catch(err => res.status(500).json({ error: err }));
    }
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
// Update a post
export function updatePost(req, res) {
    const userId = req.user.userId;
    const postId = req.params.postId; // Assuming the post ID is passed as a URL parameter
    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            // Check if the current user is the owner of the post
            if (post.userId.toString() !== userId) {
                return res.status(403).json({ message: 'User not authorized to update this post' });
            }
            
            if (req.body.description) {
                post.description = req.body.description;
            }
            return post.save();
        })
        .then(updatedPost => res.status(200).json( "Post Updated successfully"))
        .catch(err => res.status(500).json({ error: err }));
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
                res.status(200).json({ message: "Post successfully deleted."});
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
        .populate('userId', 'firstName lastName role image')
        .then(async posts => {
            if (posts.length > 0) {
                const transformedPosts = await Promise.all(posts.map(async post => {
                    const comments = await getCommentsByIdPost(post._id);
                    const nbComments = await comment.countDocuments({ postId: post._id });
                    const likes = await getLikesByIdPost(post._id);/////////HETHI ZEDTHA FEL IOS W ANDROID LE !!!!!!!!!
                    return {
                        idPost: post._id,
                        userName: `${post.userId.firstName} ${post.userId.lastName}`,
                        userRole: post.userId?.role,
                        userImage: post.userId?.image,
                        description: post.description,
                        postImage: post.image,
                        nbLike: post.nbLike,
                        nbComments: nbComments,
                        nbShare: post.nbShare,
                        comments: comments,
                        likes : likes/////////HETHI ZEDTHA FEL IOS W ANDROID LE !!!!!!!!!
                    };
                }));
                res.status(200).json(transformedPosts);
            } else {
                res.status(404).json({ error: "No posts found for this user." });
            }
        })
        .catch(err => {
            console.error('Error fetching user posts:', err);
            res.status(500).json({ error: err });
        });
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

// Retrieve all posts
export function getAllPosts(req, res) {
    Post.find()
        .populate('userId', 'firstName lastName role image') 
        .then(async posts => {
            const transformedPosts = await Promise.all(posts.map(async post => {
                const comments = await getCommentsByIdPost(post._id);
                const likes = await getLikesByIdPost(post._id);/////////HETHI ZEDTHA FEL IOS W ANDROID LE !!!!!!!!!
                const  nbComments = await comment.countDocuments({ postId: post._id });
                return {
                    idPost: post._id, // this is the id of the post
                    userName: `${post.userId?.firstName} ${post.userId?.lastName}`,
                    userRole: post.userId?.role,
                    userImage: post.userId?.image,
                    description: post.description,
                    postImage: post.image,
                    nbLike: post.nbLike,
                    nbComments: nbComments,
                    nbShare: post.nbShare, // Ensure this field exists or is calculated
                    comments: comments,
                    likes : likes/////////HETHI ZEDTHA FEL IOS W ANDROID LE !!!!!!!!!
                };
            }));
            res.status(200).json(transformedPosts);
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: err });
        });
}

export function getAllPostsAdmin(req, res) {
    Post.find()
        .populate('userId', 'firstName lastName role image') 
        .then(async posts => {
            const transformedPosts = await Promise.all(posts.map(async post => {
                const comments = await getCommentsByIdPost(post._id);
                const  nbComments = await comment.countDocuments({ postId: post._id });
                const likes = await getLikesByIdPost(post._id);
                return {
                    idPost: post._id, // this is the id of the post
                    userName: `${post.userId?.firstName} ${post.userId?.lastName}`,
                    userRole: post.userId?.role,
                    userImage: post.userId?.image,
                    description: post.description,
                    postImage: post.image,
                    nbLike: post.nbLike,
                    nbComments: nbComments,
                    nbShare: post.nbShare, // Ensure this field exists or is calculated
                    comments: comments,
                    likes:likes,
                };
            }));
            res.status(200).json(transformedPosts);
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: err });
        });
}
// Retrieve a single post by ID
export function getPostById(req, res) {
    const postId = req.params.postId;
    Post.findById(postId)
        .populate('userId', 'firstName lastName role image')
        .then(async post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            const comments = await getCommentsByIdPost(post._id);
            const likes = await getLikesByIdPost(post._id);

            const nbComments = await comment.countDocuments({ postId: post._id });

            const transformedPost = {              
                userName: `${post.userId.firstName} ${post.userId.lastName}`,
                userRole: post.userId?.role,
                userImage: post.userId?.image,
                description: post.description,
                postImage: post.image,
                likes:likes,
                nbLike: post.nbLike,
                nbComments: nbComments,
                nbShare: post.nbShare, // Ensure this field exists or is calculated
                comments: comments
            };
            
            res.status(200).json(transformedPost);
        })
        .catch(err => {
            console.error('Error fetching post:', err);
            res.status(500).json({ error: err });
        });

        
        
}
//------------------------------------
// Function to get the number of posts per day of the week
export function GetPostPerWeek(req, res) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Set to Monday of this week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Sunday of this week
    endOfWeek.setHours(23, 59, 59, 999);

    Post.aggregate([
        { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
        { 
            $group: {
                _id: { $dayOfWeek: '$createdAt' },
                count: { $sum: 1 }
            }
        },
        { 
            $project: {
                dayOfWeek: '$_id',
                count: 1,
                _id: 0
            }
        },
        { $sort: { dayOfWeek: 1 } } // Optional: sort by day of week
    ])
    .then(result => {
        // Optional: Format the result to include days with zero posts
        const formattedResult = formatResult(result);
        res.json(formattedResult);
    })
    .catch(err => res.status(500).json({ error: err }));
}

// Helper function to format the result
function formatResult(result) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formatted = [];

    daysOfWeek.forEach((day, index) => {
        const dayIndex = index + 1;
        const found = result.find(item => item.dayOfWeek === dayIndex);
        formatted.push({ day: day, count: found ? found.count : 0 });
    });

    return formatted;
}