const Review = require('../models/review');
const Post = require('../models/post');
const User = require('../models/user');
const {cloudinary} = require('../cloudinary');

module.exports.wrapAsync = function(fn) {
    return function(req, res,next) {
        fn(req,res,next).catch(e => next(e));
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    try{
        // find review
        const review = await Review.findById(req.params.review_id);
        // check if is the same author
        if(review.author.equals(req.user._id)){
            return next();
        } 
        req.flash('error','Bye bye!');
        res.redirect('/');
    } catch(err){
        return next(err);
    }
};

module.exports.isLoggedIn = async (req,res,next) => {
    try{
    if(req.isAuthenticated()) return next();
    req.flash('error','You must be logged in to do that!');
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
};

module.exports.isValidPassword = async (req,res,next) => {
    try{
        const {user} = await User.authenticate()(req.user.username, req.body.user.currentPassword);
        if(user){
            // add user to res.locals
            res.locals.user = user;
            return next();
        } else {
            this.deleteProfileImage(req);
            req.flash('error', 'Incorrect current Password');
            return res.redirect('/profile');
        }
    } catch(err) {
        return next(err);
    }
};

module.exports.changePassword = async (req,res,next) => {
    try{
        const {
            newPassword,
            passwordConfirmation
        } = req.body.user;
        if (newPassword && !passwordConfirmation) {
            this.deleteProfileImage(req);
            req.flash('error', 'Missing password confirmation!');
            return res.redirect('/profile')
        } else if (newPassword && passwordConfirmation){
            const {user} = res.locals
            if(newPassword === passwordConfirmation){
                await user.setPassword(newPassword);
                return next();
            } else {
                this.deleteProfileImage(req);
                req.flash('error', 'New Passwords must match');
                return res.redirect('/profile');
            }
        } else {
            return next();
        }
    } catch(err){
        return next(err)
    }
};

module.exports.deleteProfileImage = async req => {
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
};
