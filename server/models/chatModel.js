const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    author: {
        type: String,
        default: "",
        trim: true
    },
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        default: "",
    },
    showFor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const chatSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    messages: [
        {
            type: MessageSchema,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;