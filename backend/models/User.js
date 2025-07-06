const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    favoriteGame: {
        type: String
    },

    gameplayPreferences:[String],
    address:{
        type:String,
        required: false
    }, //need to figure out to how to ensure this is private to most users
    
    groups: [
        {
            group: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Group'
            },
            role: {
                type: String,
                enum: ['owner','member','waiting'],
                default: 'member',
            }
        }
    ],       
});

module.exports = mongoose.model('User', UserSchema);