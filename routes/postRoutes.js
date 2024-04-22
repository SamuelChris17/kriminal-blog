const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');


router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.get('/user/blogs', authenticateUser, postController.getOwnBlogs);

module.exports = router;
