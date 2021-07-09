const User = require('../models/user');
const Post = require('../models/post');
const util = require('util');
const {cloudinary} = require('../cloudinary');
const {deleteProfileImage} = require('../middleware');



// GET LandingPage
module.exports.index = async (req, res, next) => {
    const posts = await Post.find({});
    res.render('index', { posts, title: 'Surf Shop - Home' })
};

// GET REGISTER
module.exports.getRegister = (req, res, next) => {
    res.render('users/register', { title: 'Surf Shop - Register', username: '', email: '' })
};
// POST REGISTER
module.exports.postRegister = async (req, res, next) => {
    try {
        if(req.file) {
            const { path, filename } = req.file;
            req.body.image = {path, filename};
        }
        // Checking if the email is unique            
        const user = await User.register(new User(req.body), req.body.password);
        req.login(user, err => {
            if(err) return next(err)
            req.flash('success', `Welcome to the Surf-Shop, ${user.username}`)
            res.redirect('/');
        });
    } catch(err){
        deleteProfileImage(req);
        let error = err.message;
        if(error.includes('duplicate') && error.includes('email_1 dup key')){
            error = 'A user with the given email already exists';
        }
        res.render('users/register', {title: 'Surf Shop - Register', error,username, email}  )
    }
    
};

// GET LOGIN
module.exports.getLogin = (req, res, next) => {
    if(req.isAuthenticated()) return res.redirect('/');
    if(req.query.returnTo) req.session.redirectTo = req.headers.referer;
    res.render('users/login', { title: 'Surf Shop - Login' });
}

// POST LOGIN
module.exports.postLogin = async (req,res,next) => {
    const redirectUrl = req.session.redirectTo || '/posts';
    req.session.redirectTo = ''
    res.redirect(redirectUrl);
};

// GET LOGOUT
module.exports.getLogout = (req,res,next) => {
    req.logout();
    res.redirect('/login');
};

// GET PROFILE
module.exports.getProfile = async (req, res, next) => {
    const posts = await Post.find({author: req.user._id}).limit(10).exec();
    res.render('users/profile', {posts, title: `Surf Shop - ${req.user.username}`})
};

// UPDATE PROFILE
module.exports.putProfile = async (req, res, next) => {
    const { username, email } = req.body.user;
    const {user} = res.locals;
    if(username) user.username = username;
    if(email) user.email = email;
    if(req.file) {
        if(user.image.filename) cloudinary.uploader.destroy(user.image.filename);
        const {path, filename} = req.file;
        user.image = {path, filename};
    }
    await user.save();
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.flash('success', 'Profile has been successfully updated!');
    
    res.redirect('/profile');
  }
