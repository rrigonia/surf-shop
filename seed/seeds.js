
const faker = require('faker');
const Post = require('../models/post');
const mongoose = require('mongoose');
const cities = require('./cities')


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/surf-shop', { useNewUrlParser: true, useUnifiedTopology: true });
// testing db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Database')
});

async function seedPosts() {
    await Post.remove();
    for(const i of new Array(60)){
        const rand1000 = Math.floor(Math.random() *1000);
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: {
                _id :'60e5a9c0cf38c631dc32b519',
                username : 'ramon2'
            },
            location: `${cities[rand1000].city} ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
             }
        };
        
        await Post.create(post);
    }

};

seedPosts().then(()=>{
    console.log('new 60 posts created!');
    mongoose.connection.close();
});