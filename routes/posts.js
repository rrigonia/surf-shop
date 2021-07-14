const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});
const {wrapAsync, isLoggedIn, isAuthor, searchAndFilterPosts} = require('../middleware');
const {postIndex, postNew, postCreate, postShow, postEdit, postUpdate, postDestroy} = require('../controllers/posts')


/* GET posts index  /posts */
router.get('/',searchAndFilterPosts, wrapAsync(postIndex));


/* GET posts new  /posts/new */
router.get('/new',isLoggedIn, postNew);

/* POST posts create  /posts */
router.post('/',isLoggedIn, upload.array('images', 4), wrapAsync(postCreate));
  
/* GET posts show  /posts/:id */             
router.get('/:id', wrapAsync(postShow));

/* GET posts edit  /posts/:id/edit */
router.get('/:id/edit',isLoggedIn, isAuthor,  postEdit);

/* PUT posts update  /posts/:id */
router.put('/:id',isLoggedIn, isAuthor, upload.array('images', 4), wrapAsync(postUpdate));

/* DELETE posts destroy  /posts/:id */
router.delete('/:id',isLoggedIn, isAuthor, wrapAsync(postDestroy));
  
  module.exports = router; 