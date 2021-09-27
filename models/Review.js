const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'you must add client name'],
    },
    content:  {
        type: String,
        required: [true, 'you must add the content'],
    },
    rating: {
        type: Number,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    country: {
        countryName: String,
        countryFlag: String,
    }
});


module.exports = mongoose.model('Review', reviewSchema);