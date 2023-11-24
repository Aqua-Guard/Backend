import Like from '../models/like.js';
import  Post from '../models/post.js';



export const getLikesByIdPost = async (postId) => {
    try {
        const likes = await Like.find({ postId: postId })
            .populate('userId', 'firstName lastName image') // Populate only specific fields
            .lean();
        return likes.map(comment => {
            return {
                likeAvatar: comment.userId.image,
                likeUsername: `${comment.userId.firstName} ${comment.userId.lastName}`,             
            };
        });
    } catch (error) {
        console.error('Error getting comments for post:', error);
        return []; // Return an empty array on error
    }
};

export const addLike = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId; // Assuming you have user information in req.user

    try {
        // Check if the like already exists
        const existingLike = await Like.findOne({ postId: postId, userId: userId });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Fetch the post that you want to like
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new like
        const newLike = new Like({ userId: userId, postId: postId });
        await newLike.save();

        // Increment the likes count on the post and save
        post.nbLike += 1;
        await post.save();

        res.status(201).json({ message: 'Like added successfully' });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: error.message });
    }
};

export const isPostLiked = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId; // Assuming you have user information in req.user

    try {
        // Check if the user has liked the post
        const like = await Like.findOne({ postId: postId, userId: userId });

        // Return true if the like exists, otherwise false
        res.status(200).json( !!like );
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ error: error.message });
    }
};

export const dislikePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId; // Assuming you have user information in req.user

    try {
        // Check if the like exists
        const like = await Like.findOne({ postId: postId, userId: userId });
        if (!like) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        // Remove the like
        await Like.deleteOne({ _id: like._id });

        // Fetch the post and decrement the likes count
        const post = await Post.findById(postId);
        if (post) {
            post.nbLike = Math.max(0, post.nbLike - 1); // Prevent negative counts
            await post.save();
        }

        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ error: error.message });
    }
};


export const nbrLikes = async (req, res) => {
    try {
        const postId = req.params.postId;
           
        const likeCount = await Like.countDocuments({ postId: postId });
        res.json({ likeCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

