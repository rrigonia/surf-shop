const Post = require('../models/post');
const Review = require('../models/review');


// Reviews Create
module.exports.reviewCreate = async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('reviews').exec();
    let haveReviewed = post.reviews.filter(review => {
        return review.author.equals(req.user._id);
    }).length;
    if(haveReviewed) {
        req.flash('error','Sorry, you can only create 1 review per post.');
        res.redirect(`/posts/${post._id}`);
    } else {
    req.body.review.author = req.user._id
    const review = await Review.create(req.body.review);   
    post.reviews.push(review);
    await post.save();
    req.flash('success','Review created successfully!');
    res.redirect(`/posts/${post._id}`)
}};

// Reviews Update
module.exports.reviewUpdate = async (req, res, next) => {
    const {review_id, id} = req.params
    const review = await Review.findByIdAndUpdate(review_id, req.body.review);
    req.flash('success','Review Updated Successfully!');
    res.redirect(`/posts/${id}`);
};

// Reviews Destroy
module.exports.reviewDestroy = async (req, res, next) => {
    const {id, review_id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {$pull: {reviews: {$in: req.params.review_id}}} );
    await Review.findByIdAndDelete(review_id);
    req.flash('success','Review Deleted Successfully!');
    res.redirect(`/posts/${id}`);
};