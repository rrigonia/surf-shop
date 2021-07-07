const Post = require('../models/post');
const Review = require('../models/review');


// Reviews Create
module.exports.reviewCreate = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    req.body.review.author = req.user._id
    const review = await Review.create(req.body.review);   
    post.reviews.push(review);
    await post.save();
    req.session.success = 'Review created successfully!';
    res.redirect(`/posts/${post._id}`)
};

// Reviews Update
module.exports.reviewUpdate = async (req, res, next) => {
    const {review_id, id} = req.params
    const review = await Review.findByIdAndUpdate(review_id, req.body.review);
    req.session.success = 'Review Updated Successfully!'
    res.redirect(`/posts/${id}`);
};

// Reviews Destroy
module.exports.reviewDestroy = async (req, res, next) => {
    res.send("DESTROY REVIEW")
};