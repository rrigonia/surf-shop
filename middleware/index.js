const Review = require('../models/review');

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
