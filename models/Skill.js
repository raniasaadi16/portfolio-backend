const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: [true, 'you must add skill name'],
        unique: [true, 'skill name must be unique']
    },
    options: [{
        optionName: {
            type: String,
            required: true
        },
        optionIcon: {
            type: String,
            required: true
        }
    }],
});


module.exports = mongoose.model('Skill', skillSchema);