require('dotenv');
const User = require('../models/user');
const Post = require('../models/post');
const util = require('util');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const {cloudinary} = require('../cloudinary');
const {deleteProfileImage} = require('../middleware');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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
  };

//   GET FORGOT PASSWORD
  module.exports.getForgotPw = async (req,res,next) => {
    res.render('users/forgot');
  };

//   PUT FORGOT PASSWORD
  module.exports.putForgotPw = async (req,res,next) => {
    const token = await crypto.randomBytes(20).toString('hex');
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        req.flash('error', 'No account with that e-mail.');
        return res.redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const msg = {
        to: email,
        from: 'Surf Shop Admin <rrigoni.a@gmail.com>', // Use the email address or domain you verified above
        subject: 'Surf Shop - Forgot Password / Reset',
        text: `You are receiving this because you (or someone else)
        have requested the reset of the password for your account.
        Please click on the following linnk, or copy and paste it
        into your browser to complete the process:
        http://${req.headers.host}/reset/${token} 
        If You did not request this, please ignore this email 
        and your password will remain unchanged.`.replace(/        /g,''),
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    await sgMail.send(msg);
    req.flash('success', `An email has been sent to ${email} with further instructions. `);
    res.redirect('/forgot-password');
  };

//   GET RESET PASSWORD
  module.exports.getReset = async (req,res,next) => {
      const {token} = req.params;
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });
      if (!user){
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot-password');
      }
      res.render('users/reset', {token});
  };

//   PUT FORGOT PASSWORD
  module.exports.putReset = async (req,res,next) => {
    const {token} = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot-password');
    } 

    const {password, confirm} = req.body;
    if(password === confirm){
        await user.setPassword(password);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);   

    } else {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(`/reset/${token}`);
    }

    const msg = {
        to: user.email,
        from: 'Surf Shop Admin <rrigoni.a@gmail.com>', // Use the email address or domain you verified above
        subject: 'Surf Shop - Forgot Password / Reset',
        text: `This email is to confirm that the password for your account has just been
        changed. `.replace(/        /g,'')
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    await sgMail.send(msg);
    req.flash('success', 'Password updated successfully!')
    res.redirect('/');
  };
