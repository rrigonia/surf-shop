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
    res.send('GET REGISTER', { title: 'Surf Shop - Register' })
};
// POST REGISTER
module.exports.postRegister = async (req, res, next) => {

    const { username, password, email, image } = req.body;
    const newUser = new User({ username, email, image });
    const user = await User.register(newUser, password);
    res.redirect('/');
};

// GET LOGIN
module.exports.getLogin = (req, res, next) => {
    res.send('GET /login', { title: 'Surf Shop - Login' });
}

// POST LOGIN
module.exports.postLogin = (req,res,next) => {
    res.redirect('/');
};

// GET LOGOUT
module.exports.getLogout = (req,res,next) => {
    req.logout();
    res.redirect('/login');
};
