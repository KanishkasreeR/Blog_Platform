const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    campaignIds: [{
        type: String, 
        required: true
    }],
    followedAt: {
        type: Date,
        default: Date.now
    }
});

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;

