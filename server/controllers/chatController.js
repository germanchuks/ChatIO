const UserSchema = require("../models/userModel");
const ChatSchema = require("../models/chatModel");
const GroupSchema = require("../models/groupModel");
const mongoose = require('mongoose');



exports.storeMessage = async (req, res) => {
    const { newMessage, chatID } = req.body;

    try {
        const chat = await ChatSchema.findById(chatID);

        newMessage.showFor = chat.members.slice();

        await ChatSchema.findByIdAndUpdate(chatID, {
            $push: {
                messages: newMessage
            }
        }, { new: true });

        return res.json({
            message: "Message saved"
        });
    } catch (error) {
        console.error('Error storing message:', error);
        return res.status(500).json({
            error: 'Error storing message'
        });
    }
};


exports.storeGroupMessage = async (req, res) => {
    const { newMessage, groupID } = req.body;
    try {
        const group = await GroupSchema.findById(groupID)

        if (!group) {
            return res.json({
                error: "Group no longer exists"
            })
        }

        if (!group.messages) {
            group.messages = [];
        }

        newMessage.showFor = group.members.map((member) => member.memberID);

        group.messages.push(newMessage);
        await group.save();

        return res.json({
            message: "Message saved"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            error: error
        })
    }
}


exports.getPreviousMessages = async (req, res) => {
    const { chatID, userID } = req.params;

    try {
        const chat = await ChatSchema.findById(chatID).populate('messages.showFor', '_id');

        const userObjectId = new mongoose.Types.ObjectId(userID);

        const filteredMessages = chat.messages.filter(message =>
            message.showFor.some(user => user._id.equals(userObjectId))
        );

        return res.json({
            messages: filteredMessages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({
            error: 'Error fetching messages'
        });
    }
}

exports.getPreviousGroupMessages = async (req, res) => {
    const { groupID, userID } = req.params;
    try {
        const group = await GroupSchema.findById(groupID).populate('messages.showFor', '_id');

        if (!group) {
            return res.json({
                error: "Group no longer exists"
            })
        }

        const userObjectId = new mongoose.Types.ObjectId(userID);

        const filteredMessages = group.messages.filter(message =>
            message.showFor.some(user => user._id.equals(userObjectId))
        );

        return res.json({
            messages: filteredMessages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({
            error: 'Error fetching messages'
        });
    }
}


exports.clearOrDeleteMessagesInChat = async (req, res) => {
    const { userID, chatID, deleteForAll } = req.body;

    try {
        const chat = await ChatSchema.findById(chatID);

        for (const message of chat.messages) {
            message.showFor = message.showFor.filter(id => id.toString() !== userID);
        }

        if (deleteForAll) {
            for (const message of chat.messages) {
                if (message.authorID.toString() === userID) {
                    message.message = 'Deleted Message';
                }
            }
        }

        await chat.save();

        return res.json({
            message: "Messages cleared."
        })

    } catch (error) {
        console.error('Error clearing messages:', error);
        return res.status(500).json({
            error: 'Error clearing messages'
        });
    }
}


exports.clearOrDeleteMessagesInGroupChat = async (req, res) => {
    const { userID, groupID, deleteForAll } = req.body;

    try {
        const group = await GroupSchema.findById(groupID);

        if (!group) {
            return res.status(404).json({
                error: 'Group not found'
            });
        }

        for (const message of group.messages) {
            if (message.showFor) {
                message.showFor = message.showFor.filter(id => id.toString() !== userID);
            }
        }

        if (deleteForAll) {
            for (const message of group.messages) {
                console.log(message)
                if (message.authorID && message.authorID.toString() === userID) {
                    message.message = 'Deleted Message';
                }
            }
        }

        await group.save();

        return res.json({
            message: "Messages cleared."
        })

    } catch (error) {
        console.error('Error clearing messages:', error);
        return res.status(500).json({
            error: 'Error clearing messages'
        });
    }
}