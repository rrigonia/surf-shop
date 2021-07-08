const Review = require('../models/review');
const Post = require('../models/post');
const User = require('../models/user');

module.exports.wrapAsync = function(fn) {
    return function(req, res,next) {
        fn(req,res,next).catch(e => next(e));
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    // find review
    const review = await Review.findById(req.params.review_id);
    // check if is the same author
    if(review.author.equals(req.user._id)){
        return next();
    } 
    req.session.error = 'Bye bye!';
    res.redirect('/');
};

module.exports.isLoggedIn = async (req,res,next) => {
    try{
    if(req.isAuthenticated()) return next();
    req.session.error = 'You must be logged in to do that!';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
    } catch (err){
        return next(err)
    }
};

module.exports.isAuthor = async (req,res,next) => {
    try{
    const post = await Post.findById(req.params.id);
    if(post.author.equals(req.user._id)){
        res.locals.post = post;
        return next();
    }
    req.flash('error', 'You dont have authorization to do that!' );
    res.redirect('back');
    } catch(err) {
        return next(err)
    };
}
