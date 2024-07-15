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

const MemberSchema = new mongoose.Schema({
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    memberName: {
        type: String,
        trim: true
    },
    memberEmail: {
        type: String,
        trim: true
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
            type: MemberSchema,
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