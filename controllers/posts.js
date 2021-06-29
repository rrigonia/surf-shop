const Post = require('../models/post');

// POSTs INDEX
module.exports.postIndex = async (req, res, next) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
};

// NEW POST
module.exports.postNew = (req, res, next) => {
    res.render('posts/new');
};

// CREATE POST
module.exports.postCreate = async (req, res, next) => {
    const post = await Post.create(req.body.post);
    res.redirect(`/posts/${post._id}`);
};

// SHOW POST
module.exports.postShow = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
};

// EDIT POST
module.exports.postEdit = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
};

// EDIT POST
module.exports.postUpdate = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
    res.redirect(`/posts/${post._id}`);
};

// DESTROY POST
module.exports.postDestroy = async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect(`/posts`);
};