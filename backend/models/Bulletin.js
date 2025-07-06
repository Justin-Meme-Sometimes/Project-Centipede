const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'authorModel'
    },

    authorModel: {
        type: String,
        required: true,
        enum: ['User', 'Group']
    },

    lookingFor: { 
        type: String, 
        enum: ['group', 'individual'], 
        required: true 
    },

    text: { 
        type: String, 
        required: true 
    },

    playstylePreferences:[{
        type: String,
        enum: ['narrative', 'tactical', 'freeform', 'world-building'],
    }],

    formatPreferences:[{
        type: String,
        enum: ['campaign', 'oneshot'],
    }],

    county: String,

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});