const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'you must add project name'],
    },
    description:  {
        type: String,
        required: [true, 'you must add the description'],
    },
    url: {
        type: String
    },
    sourceCode: {
        type: String
    },
    picture: {
        type: String,
        required: true
    },
    gallery: [String],
    tools: [{
        toolName: String,
        toolIcon: String
    }],
    category: {
        type: String,
        required: [true, 'you must add category']
    }
});


module.exports = mongoose.model('Project', projectSchema);