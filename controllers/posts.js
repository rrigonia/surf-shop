const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


// POSTs INDEX
module.exports.postIndex = async (req, res, next) => {
    const {dbQuery} = res.locals;
    console.log(dbQuery);
    delete res.locals.dbQuery;
    const posts = await Post.paginate(dbQuery, {
        page: req.query.page || 1,
        limit: 10,
        sort: {'_id': -1}
    });
    posts.page = Number(posts.page);
    if(!posts.docs.length && res.locals.query){
        res.locals.error = 'Sorry, no results match that query.';
    }
    res.render('posts/index', { posts, title: 'Surf Shop - Posts' });
};

// NEW POST
module.exports.postNew = (req, res, next) => {
    res.render('posts/new', { title: 'Surf Shop - NewPost' });
};

// CREATE POST
module.exports.postCreate = async (req, res, next) => {
    const post = new Post(req.body.post);
    // mapbox getting geometry
    const geolocation = await geocoder.forwardGeocode({
        query: post.location,
        limit: 1
    }).send();
    post.geometry = (geolocation.body.features[0].geometry);
    post.author = req.user._id;
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await post.save();
    req.flash('success','Post created successfully');
    res.redirect(`/posts/${post._id}`);
};

// SHOW POST
module.exports.postShow = async (req, res, next) => {
    const {id} = req.params
    const post = await Post.findById(id).populate({
        path: 'reviews',
        options: {sort: {'_id': -1}},
        populate: {
            path: 'author',
            model: 'User'
        }
    });
    // const floorRating = post.calculateAvgRating();
    const floorRating = post.avgRating;
    res.render('posts/show', { post, title: 'Surf Shop - ShowPost', floorRating });
};

// EDIT POST
module.exports.postEdit = (req, res, next) => {
    res.render('posts/edit', { title: 'Surf Shop - Edit' });
};

// EDIT POST
module.exports.postUpdate = async (req, res, next) => {

    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post, {new: true});
    const geolocation = await geocoder.forwardGeocode({
        query: post.location,
        limit: 1
    }).send();
    // handle any deletion of existing img
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    // handle upload of new imgs
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    post.geometry = (geolocation.body.features[0].geometry); 
    await post.save();
    // 
    res.redirect(`/posts/${post._id}`);

};

// DESTROY POST
module.exports.postDestroy = async (req, res, next) => {
    const {post} = res.locals;
    if (post.images.length) {
        for (let image of post.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    };
    await post.remove();
    res.redirect(`/posts`);
};