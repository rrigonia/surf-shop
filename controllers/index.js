const User = require('../models/user');


// Home Page
module.exports.index = (req, res, next) => {
    res.render('index', { title: 'Surf Shop - Home' })
};

// GET REGISTER
module.exports.getRegister = (req, res, next) => {
    res.send('GET REGISTER')
};
// POST REGISTER
module.exports.postRegister = async (req, res, next) => {
    try{
    const { username, password, email, image } = req.body;
    const newUser = new User({ username, email, image });
    const user = await User.register(newUser, password);
    console.log(user);
    res.redirect('/');
    } catch(err){
        res.send(`Error to create your account: ${err}`)
    }
};

