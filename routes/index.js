const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});
const {wrapAsync, isLoggedIn, isValidPassword, changePassword} = require('../middleware')
const {
   postRegister,
   getRegister,
   index,
   postLogin,
   getLogin,
   getLogout,
   getProfile,
   putProfile,
   getForgotPw,
   putForgotPw,
   getReset,
   putReset } = require('../controllers');

/* GET home page. */
router.get('/', index);

// REGISTER ROUTE
router.route('/register')
  .get(getRegister)
  .post(upload.single('image'), wrapAsync(postRegister));


//LOGIN ROUTE
router.route('/login')
  .get(getLogin) 
  .post(passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Incorrect username or password'
    }), wrapAsync(postLogin));


// GET /logout
router.get('/logout', getLogout);

//PROFILE ROUTE
router.route('/profile')
  .get(isLoggedIn, wrapAsync(getProfile))
  .put(upload.single('image'), isValidPassword, changePassword, putProfile);

// FORGOT ROUTE
router.route('/forgot-password')
    .get(getForgotPw)
    .put(wrapAsync(putForgotPw));

// RESET TOKEN ROUTE
router.route('/reset/:token')
  .get(wrapAsync(getReset))
  .put(wrapAsync(putReset));


module.exports = router;
