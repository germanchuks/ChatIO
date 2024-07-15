const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    friendID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendEmail: {
        type: 'String'
    },
    friendUser: {
        type: 'String'
    },
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Friend', FriendSchema)