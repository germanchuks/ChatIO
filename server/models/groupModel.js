const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    author: {
        type: String,
        default: "",
        trim: true
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
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    admin: [
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

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;