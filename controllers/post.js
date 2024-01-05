import Post from "../models/post.js";
import { validationResult } from "express-validator";
import { getCommentsByIdPost, getCommentsByIdPostAdmin } from "./comment.js";
import comment from "../models/comment.js";
import { getLikesByIdPost } from "./like.js";
import { OpenAI} from 'openai';
import dotenv from 'dotenv';
import User from '../models/user.js';
import nodemailer from 'nodemailer';

dotenv.config();

const openai =new OpenAI({
  apiKey : process.env.OPENAI_API_KEY2,
});


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
    const postId = req.params.postId; 
    console.log("--------------------" +req.body.description)// Assuming the post ID is passed as a URL parameter
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
    .sort({ createdAt: -1 })
        .populate('userId', 'firstName lastName role image') 
        .then(async posts => {
            const transformedPosts = await Promise.all(posts.map(async post => {
                const comments = await getCommentsByIdPostAdmin(post._id);
                const  nbComments = await comment.countDocuments({ postId: post._id });
                const likes = await getLikesByIdPost(post._id);
                const postedAt = timeAgo(post.createdAt);
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
                    postedAt: postedAt, 
                    verified : post.verified
                };
            }));
            res.status(200).json(transformedPosts);
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: err });
        });
}
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


export const generateDescriptionWithChat = async (req, res) => {
    try {
        // Extract prompt from request. Assuming it's sent in the body under a key named 'prompt'
        const { prompt } = req.params; // from the params

        // Validate prompt
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user",  content: `Provide a concise description for the following: "${prompt}"`  } // Use the provided prompt
            ],
        });

        // Extract the completion message
        const completionMessage = chatCompletion.choices[0].message.content;

        console.log(`openai --------------------------${completionMessage}`);

        // Send the completion message as a response
        res.json({ description: completionMessage });
    } catch (error) {
        console.error('Error generating description with ChatGPT:', error);
        res.status(500).json({ error: 'Error generating description' });
    }
};
export const detectDiscriminationInText = async (req, res) => {
    try {
        // Extract prompt from request. Assuming it's sent in the body under a key named 'prompt'
        const { prompt } = req.params; // from the params

        // Validate prompt
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user",  content: `Does the following text contain any discriminatory content? "${prompt}" Answer with 'true' or 'false' only.` }
            ],
        });
        
        // Extract the completion message
        const analysisResult = chatCompletion.choices[0].message.content;

        
        console.log(`openai --------------------------${analysisResult}`);
        // Send the analysis result as a response
        res.json({ analysis: analysisResult });
    } catch (error) {
        console.error('Error analyzing text with ChatGPT:', error);
        res.status(500).json({ error: 'Error analyzing text' });
    }
};
export const detectDiscriminationInTextAdmin = async (req, res) => {
    try {
        // Extract postId from request params
        const { postId } = req.params;

        // Fetch the post using the postId here
        // For example, assuming you have a method to fetch the post
        const post = await Post.findById(postId)

        // Check if the post exists and has a description
        if (!post || !post.description) {
            return res.status(404).json({ error: 'Post not found or no description available' });
        }

        // Analyze the post's description for discrimination
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Does the following text contain any discriminatory content? "${post.description}" Answer with 'true' or 'false' only.` }
            ],
        });

        // Extract the completion message
        const analysisResult = chatCompletion.choices[0].message.content;

        console.log(`openai --------------------------${analysisResult}`);
        // Send the analysis result as a response
        res.json({ analysis: analysisResult });
    } catch (error) {
        console.error('Error analyzing text with ChatGPT:', error);
        res.status(500).json({ error: 'Error analyzing text' });
    }
};


// Share a post
export async function sharePost(req, res) {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.nbShare += 1;

        await post.save();

        res.json({ message: "Post Shared with success" });

    } catch (error) {
        res.status(500).json({ message: 'Error sharing the post', error });
    }
}
export function verifyPost(req, res) {
    const postId = req.params.postId; 
    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
                post.verified = true;
            return post.save();
        })
        .then(updatedPost => res.status(200).json( "Post Updated successfully"))
        .catch(err => res.status(500).json({ error: err }));
}
export const notVerifyPost = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).json({ error: "Post ID is required." });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update the post's verified status to false
        post.verified = false;
        await post.save();

        // Send email to the user (assuming user ID is stored in post.userId)
        const user = await User.findById(post.userId);
        if (user) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.PASSWORD_EMAIL,
                },
            });

            const htmlString = `...`; // Your email HTML content

            await transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Post Deletion Notification',
                html: htmlString,
            });
        }

        return res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error in notVerifyPost:', error);
        res.status(500).json({ message: 'Error updating post', error });
    }
};