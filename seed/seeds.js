
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
    await Post.deleteMany();
    for(const i of new Array(200)){
        const rand1000 = Math.floor(Math.random() *1000);
        const rand5 = Math.floor(Math.random() *6);
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: '60e73c701d445a10e012bb4c',
            location: `${cities[rand1000].city} ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
             },
             price: rand1000,
             avgRating: rand5,
        };
        
        await Post.create(post);
    }

};

seedPosts().then(()=>{
    console.log('new 200 posts created!');
    mongoose.connection.close();
});