const express = require('express');
const router = express.Router();
const passport = require('passport');
const {wrapAsync, isLoggedIn, isValidPassword, changePassword} = require('../middleware')
const {
   postRegister,
   getRegister,
   index,
   postLogin,
   getLogin,
   getLogout,
   getProfile,
   putProfile } = require('../controllers');

/* GET home page. */
router.get('/', index);

// REGISTER ROUTE
router.route('/register')
  .get(getRegister)
  .post(wrapAsync(postRegister));


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
  .put(isValidPassword, changePassword, putProfile);

// FORGOT ROUTE
router.route('/forgot')
    .get((req, res, next) => {
      res.send('GET /forgot');
    })
    .put((req, res, next) => {
      res.send('PUT /forgot');
    });

// RESET TOKEN ROUTE
router.route('/reset/:token')
  .get((req, res, next) => {
  res.send('GET /reset/:token');
  })
  .put((req, res, next) => {
    res.send('PUT /reset/:token');
  });


module.exports = router;
