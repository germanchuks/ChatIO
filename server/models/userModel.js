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
});



const RequestSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    }
});


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatarImage: {
        type: String,
        default: "",
    },
    friendList: [
        {
            type: FriendSchema,
        }
    ],
    sentRequests: [
        {
            type: RequestSchema,
        }
    ],
    pendingRequests: [
        {
            type: RequestSchema,
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    sentMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    receivedMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)