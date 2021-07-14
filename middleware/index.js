const Review = require('../models/review');
const Post = require('../models/post');
const User = require('../models/user');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  };

module.exports.wrapAsync = function(fn) {
    return function(req, res,next) {
        fn(req,res,next).catch(e => next(e));
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    try{
        // find review
        const review = await Review.findById(req.params.review_id);
        // check if is the same author
        if(review.author.equals(req.user._id)){
            return next();
        } 
        req.flash('error','Bye bye!');
        res.redirect('/');
    } catch(err){
        return next(err);
    }
};

module.exports.isLoggedIn = async (req,res,next) => {
    try{
    if(req.isAuthenticated()) return next();
    req.flash('error','You must be logged in to do that!');
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
    } catch (err){
        return next(err)
    }
};

module.exports.isAuthor = async (req,res,next) => {
    try{
    const post = await Post.findById(req.params.id);
    if(post.author.equals(req.user._id)){
        res.locals.post = post;
        return next();
    }
    req.flash('error', 'You dont have authorization to do that!' );
    res.redirect('back');
    } catch(err) {
        return next(err)
    };
};

module.exports.isValidPassword = async (req,res,next) => {
    try{
        const {user} = await User.authenticate()(req.user.username, req.body.user.currentPassword);
        if(user){
            // add user to res.locals
            res.locals.user = user;
            return next();
        } else {
            this.deleteProfileImage(req);
            req.flash('error', 'Incorrect current Password');
            return res.redirect('/profile');
        }
    } catch(err) {
        return next(err);
    }
};

module.exports.changePassword = async (req,res,next) => {
    try{
        const {
            newPassword,
            passwordConfirmation
        } = req.body.user;
        if (newPassword && !passwordConfirmation) {
            this.deleteProfileImage(req);
            req.flash('error', 'Missing password confirmation!');
            return res.redirect('/profile')
        } else if (newPassword && passwordConfirmation){
            const {user} = res.locals
            if(newPassword === passwordConfirmation){
                await user.setPassword(newPassword);
                return next();
            } else {
                this.deleteProfileImage(req);
                req.flash('error', 'New Passwords must match');
                return res.redirect('/profile');
            }
        } else {
            return next();
        }
    } catch(err){
        return next(err)
    }
};

module.exports.deleteProfileImage = async req => {
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
};

module.exports.searchAndFilterPosts = async (req,res, next) => {
    try{
    // Check if the user submit the searchAndFiler form . Put the query into an array with the keys.
    const queryKeys = Object.keys(req.query);
    // Now we check if this array exists
    if(queryKeys.length){
        const dbQueries = [];
        let {search, price, avgRating, location, distance} = req.query;
        // if there is a search input...
        if (search){
            // using regular expression to escape the $& strings
            search = new RegExp(escapeRegExp(search), 'gi');
            // Then we push to our array an object with title,description and location with the 'search' result 
            dbQueries.push({$or: [
                {title: search},
                {description: search},
                {location: search}
            ]});
        };
        if(location) {
            let coordinates;
            try{
                if(typeof JSON.parse(location) === 'number') {
                    throw new Error;
                }
                
                location = JSON.parse(location);  
                coordinates = location;              
            } catch(err) {
                const geolocation = await geocoder.forwardGeocode({
                    query: location,
                    limit: 1
                }).send();
                coordinates = geolocation.body.features[0].geometry.coordinates;
            }
            
            let maxDistance = distance || 25;
            maxDistance *= 1609.34;
            dbQueries.push({
                geometry: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates
                        },
                        $maxDistance: maxDistance
                    }
                }
            });   
        };
        if(price){
            if(price.min) dbQueries.push({price: {$gt: Number(price.min)}});
            if(price.max) dbQueries.push({price: {$lt: Number(price.max)}});
        };
        if(avgRating){
            dbQueries.push({avgRating: {$in: avgRating}})
        };
        res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};

    };

    res.locals.query = req.query;
    queryKeys.splice(queryKeys.indexOf('page'), 1);
    const delimiter = queryKeys.length ? '&' : '?';
    res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
    next();
    } catch(err){
        next(err);
    }
};