const leedProject = require('../models/leedprojectmodel')
const seeds = require('./seedHelpers')
const cities = require('./cities')
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/leedproject')
    .then(res => { return leedProject.find({}).exec() })
    .then(res => {
        console.log('Successfully connected!')
    })
    .catch(err => {
        console.log('Failed to connect' + `${err}`)
    })

const sample = (arr) => {
    const index = Math.floor(Math.random() * arr.length)
    const result = arr[index]
    return result
}

const seedDB = async () => {
    await leedProject.deleteMany({}).exec();
    await leedProject.insertMany(arr)
    const projects = await leedProject.find({})
    console.log(projects)
}

const arr = []
const arrLevel = ['Platinum', 'Gold', 'Silver', 'Certified']
for (let i = 0; i < 30; i++) {
    const locationData = sample(cities)
    const newLeedProject = new leedProject({
        name: sample(seeds.descriptors) + ' ' + sample(seeds.places),
        location: `${locationData.city}, ${locationData.state}`,
        images: [{ url: 'https://source.unsplash.com/random/?interior', filename: 'img1' }, { url: 'https://source.unsplash.com/random/?architecture', filename: 'img2' }],
        price: Math.floor(Math.random() * 300),
        geometry: {
            type: 'Point',
            coordinates: [locationData.longitude, locationData.latitude]
        },
        certifiLevel: arrLevel[Math.floor(Math.random() * 4)],
        author: '61fdf38ca7b70d229b788b42',
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, magni obcaecati autem beatae magnam ea veritatis enim quaerat sint sed voluptas, voluptatem unde veniam dolore ab totam numquam. Delectus, placeat."
    })
    arr.push(newLeedProject)
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })
