const Post = require('../models/posts');
const User = require('../models/User');
const logger = require('../config/logger');

// Function to calculate the reading time of a blog post
function calculateReadingTime(body) {
  const words = body.trim().split(/\s+/);
  const averageWPM = 200; // Adjust as needed
  const totalReadingTime = words.length / averageWPM;
  return Math.ceil(totalReadingTime);
}



// Controller methods for handling blog post operations
const postController = {
  getAllPosts: async (req, res) => {
    let { page = 1, limit = 20, author, title, tags, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;

    // Define the search query
    const query = {};
    if (author) query.author = author;
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (tags) query.tags = { $in: tags.split(',') }; // Split tags by comma and search for posts containing any of them

    // Define the sort order
    const sortOptions = {};
    if (sortBy === 'readCount' || sortBy === 'readingTime' || sortBy === 'timestamp') {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.timestamp = sortOrder === 'asc' ? 1 : -1; // Default to sorting by timestamp
    }

    try {
      const posts = await Post.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPosts = await Post.countDocuments(query);

      res.json({
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        totalPosts,
        posts
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getPostById: async (req, res) => {
    const postId = req.params.id;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      // Update the read count by 1
      post.readCount += 1;
      await post.save();

      // Get the user information (author) for the blog post
      const author = await User.findById(post.author);

      // Return the blog post along with the author information
      res.json({
        post: {
          _id: post._id,
          title: post.title,
          description: post.description,
          tags: post.tags,
          timestamp: post.timestamp,
          state: post.state,
          readCount: post.readCount,
          readingTime: post.readingTime,
          body: post.body,
          author: {
            _id: author._id,
            firstName: author.firstName,
            lastName: author.lastName,
            email: author.email
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createPost: async (req, res) => {
    const { title, description, tags, body, state  } = req.body;
    const author = req.user.userId;

    try {
      const readingTime = calculateReadingTime(body); // Calculate reading time
      const newPost = new Post({
        title,
        description,
        tags,
        author,
        state,
        readingTime,
        body
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updatePost: async (req, res) => {
    const postId = req.params.id;
    const updatePostData = req.body;
    const { title, description, tags, body, state } = req.body; 
    
    

    try {
      const readingTime = calculateReadingTime(body); 
      console.log(`Estimated reading time for updated post: ${readingTime} minutes`);
      const post = await Post.findByIdAndUpdate(postId, {
        title,
        description,
        tags,
        state,
        readingTime,
        body
      }, { new: true });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      
      if (req.user.userId !== post.author.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this post' });
      }
  
      
      post.title = title;
      post.content = content;
      post.state = state; 
  
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  deletePost: async (req, res) => {
    const postId = req.params.id;
    try {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOwnBlogs: async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 10, state } = req.query;
  
    const query = { author: userId };
    if (state) {
      query.state = state;
    }
  
    try {
      const blogs = await Post.find(query)
        .sort({ createdAt: -1 }) 
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalBlogs = await Post.countDocuments(query);
  
      res.json({
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: page,
        totalBlogs,
        blogs
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
};

module.exports = postController;
