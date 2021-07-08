const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('little').get(function (){
    return this.url.replace('/upload', '/upload/w_200')
});
ImageSchema.virtual('thumb').get(function (){
    return this.url.replace('/upload', '/upload/w_80')
});

const opts = { toJSON: { virtuals: true} };

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ImageSchema],
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: {type: Number, default: 0}
}, opts);

PostSchema.virtual('properties.popUpMark').get(function () {
    return `
    <strong class="lead"><a href="/posts/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,40)}...</p> `
});


PostSchema.pre('remove', async function(){
    console.log(this)
    await Review.deleteMany({
        _id: {
            $in: this.reviews
        }
    });
});

// CALCULATE THE AVG RATING
PostSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length){
        for(let review of this.reviews){
            ratingsTotal += review.rating
        };
        this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
    } else {
        this.avgRating = ratingsTotal;
    }
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
    
}

PostSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Post', PostSchema);
