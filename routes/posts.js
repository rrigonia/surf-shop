const express = require('express');
const router = express.Router();


/* GET posts index  /posts */
router.get('/', function(req, res, next) {
    res.send('INDEX /posts');
  });


/* GET posts new  /posts/new */
router.get('/new', function(req, res, next) {
    res.send('NEW /posts/new');
  });

/* POST posts create  /posts */
router.post('/', function(req, res, next) {
    res.send('CREATE /posts');
  });
  
/* GET posts show  /posts/:id */
router.get('/:id', function(req, res, next) {
    const { id } = req.params;
    res.send(`SHOW /posts/${id}`);
  });

/* GET posts edit  /posts/:id/edit */
router.get('/:id/edit', function(req, res, next) {
    res.send('EDIT /posts/:id/edit');
  });

/* PUT posts update  /posts/:id */
router.put('/:id', function(req, res, next) {
    res.send('UPDATE /posts/:id');
  });

/* DELETE posts destroy  /posts/:id */
router.delete('/:id', function(req, res, next) {
    res.send('DELETE /posts/:id');
  });
  
  module.exports = router;
  

  // Get index /posts
  // Get new   /posts/new
  // Post create /posts
  // Get show    /posts/:id
  // get edit    /posts/:id/edit
  // put update  /posts/:id
  // delete destroy /posts/:id