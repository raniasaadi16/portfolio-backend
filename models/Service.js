const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'you must add service name'],
        unique: [true, 'service name must be unique']
    },
    options: [String],
});


module.exports = mongoose.model('Service', serviceSchema);