const User = require('../models/user');



// GET HOME
module.exports.index = (req, res, next) => {
    res.render('index', { title: 'Surf Shop - Home' })
};

// GET REGISTER
module.exports.getRegister = (req, res, next) => {
    res.send('GET REGISTER')
};
// POST REGISTER
module.exports.postRegister = async (req, res, next) => {

    const { username, password, email, image } = req.body;
    const newUser = new User({ username, email, image });
    const user = await User.register(newUser, password);
    console.log(user);
    res.redirect('/');
};

// POST LOGIN
module.exports.postLogin = (req,res,next) => {
    res.redirect('/');
};

// GET LOGOUT
module.exports.getLogout = (req,res,next) => {
    req.logout();
    res.redirect('/login');
};
