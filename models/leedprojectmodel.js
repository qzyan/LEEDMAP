const mongoose = require('mongoose');
const Review = require('./review')

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})                                             //create a imageSchema and nest into leedProjectSchema

imageSchema.virtual('thumbnail').get(function () {
    if (this.url.includes('unsplash')) {
        return this.url.replace('/random', '/random/140x140')
    }
    return this.url.replace('/upload', '/upload/w_140,h_140')      // add a virtual to the imageSchema.
})


//https://res.cloudinary.com/demo/image/upload/x_385,y_90,w_300,h_250,c_crop/kitten.jpg
//https://res.cloudinary.com/dhicnpupu/image/upload/v1644546951/leedproject/g0v7s0muigdfp53k3s5w.jpg

const opts = { toJSON: { virtuals: true } }
const leedProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: String,
    location: String,
    images: [imageSchema],
    certifiLevel: {
        type: 'String',
        enum: ['Platinum', 'Gold', 'Silver', 'Certified']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Review'
    }],
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
    }
}, opts)

leedProjectSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

leedProjectSchema.virtual('properties').get(function () {
    return {
        name: this.name,
        certifiLevel: this.certifiLevel,
        id: this._id
    }
})

const leedProject = mongoose.model('leedProject', leedProjectSchema)

module.exports = leedProject