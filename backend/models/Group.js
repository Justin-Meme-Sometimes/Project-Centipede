const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    county:{
        type: String,
        required: true
    },

    ownerLocation: { //need to integrate the API here somehow... confused lol
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], //assuming longitude and latitude tbh idk the vibe on how this would work with the API
            required: true,
        },
    },

    groupSize: {
        type: Number, 
        default: 1 
    },

    maxGroupSize: {
        type: Number,
        required: true
    },

    acceptingNewMembers: {
        type: Boolean,
        default: true
    },

    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['owner', 'member'],
                default: 'member',
            } // change default to owner if they made the group... need to figure out how to do that
        }
    ],

    waitingList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

GroupSchema.index({ location: '2dsphere' }); // change ts when we figure out the tea with location API

module.exports = mongoose.model('Group', GroupSchema);