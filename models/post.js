const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    ]
});


module.exports = mongoose.model('Post', PostSchema);
