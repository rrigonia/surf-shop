const User = require('../models/user');
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



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

    const { username, password, email, image } = req.body;
    const newUser = new User({ username, email, image });
    // Checking if the email is unique
    try {
    const user = await User.register(newUser, password);
    req.login(user, function(err){
        if(err) return next(err)
        req.session.success = `Welcome to the Surf-Shop, ${user.username}`
        res.redirect('/');
    });
    } catch(err){
        let error = err.message;
        if(error.includes('duplicate') && error.includes('email_1 dup key')){
            error = 'A user with the given email already exists';
        }
        res.render('users/register', {title: 'Surf Shop - Register', error,username, email}  )
    }
    
};

// GET LOGIN
module.exports.getLogin = (req, res, next) => {
    if(req.isAuthenticated()) return res.redirect('/')
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
