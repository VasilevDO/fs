const { Router } = require('express');
const config = require('config');
const Post = require('../models/BlogPost');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();
const userRights = require('../userRights');

router.post('/create', auth, async (request, response) => {
    try {
        const user = await User.findOne({ _id: request.headers.userid });
        const rights = userRights[user.status];
        if (!rights.canAddBlogPosts) {
            response.status(403).json({ status: 'red', message: 'Access denied (no rights)' });
            return;
        }
        const { text, title, createdBy } = request.body;
        const post = new Post({
            text: text, title: title, owner: request.user.userId, createdBy: createdBy
        })
        await post.save();
        response.status(201).json({ post });
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.post('/delete', auth, async (request, response) => {
    try {
        const user = await User.findOne({ _id: request.headers.userid });
        const rights = userRights[user.status];
        const { id } = request.body;
        const post = await Post.findOne({ _id: id });
        if (user._id.toString() !== post.owner.toString() && !rights.canModerateBlog) {
            response.status(403).json({ status: 'red', message: 'Access denied (no rights)' });
            return;
        }
        await post.delete();
        response.status(201).json({ message: 'Post was successfuly deleted' })
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.post('/like', auth, async (request, response) => {
    try {
        const user = await User.findOne({ _id: request.headers.userid });
        const { postId } = request.body;
        const post = await Post.findOne({ _id: postId });

        await post.delete();
        response.status(201).json({ message: 'Post was successfuly deleted' })
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.post('/update', auth, async (request, response) => {
    try {
        const user = await User.findOne({ _id: request.headers.userid });
        const rights = userRights[user.status];
        const { id, title, text } = request.body.post;
        const post = await Post.findOne({ _id: id });
        if (user._id.toString() !== post.owner.toString() && !rights.canModerateBlog) {
            response.status(403).json({ status: 'red', message: 'Access denied (no rights)' });
            return;
        }
        const editedBy = user.name;
        for (const key in request.body.post) {
            if (post[key] !== request.body.post[key]) post[key] = request.body.post[key];
        }
        post.dateEdited = new Date();
        post.editedBy = user.name;
        await post.save();
        response.status(201).json(post);
    } catch (e) {
        console.log(e.message);
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})

router.get('/', auth, async (request, response) => {
    try {
        const posts = await Post.find();
        response.status(201).json({ posts });
    } catch (e) {
        response.status(500).json({ message: 'Something went wrong. Try again later' });
    }
})


module.exports = router;




