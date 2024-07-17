const UserSchema = require("../models/userModel");
const ChatSchema = require("../models/chatModel");


const { comparePassword, hashPassword } = require('../utils/auth')

exports.getUserInfo = async (req, res) => {
    const { userID } = req.params
    try {
        const user = await UserSchema.findById(userID)

        const { recentInteractions } = user;

        return res.json({
            recentInteraction: recentInteractions
        });

    } catch {
        return res.json({
            error: "Error occured"
        })
    }
};

exports.updateTheme = async (req, res) => {
    const { userID, selectedTheme } = req.body

    try {
        const user = await UserSchema.findByIdAndUpdate(
            userID,
            { theme: selectedTheme },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        return res.json({
            message: 'Theme Updated'
        })
    } catch (error) {
        return res.json({
            error: 'Could not update theme'
        })
    }
}


// Update user password
exports.updatePassword = async (req, res) => {

    try {
        const { password, newpassword, step } = req.body
        const { userID } = req.params

        const user = await UserSchema.findById(userID).select("+password")

        if (step === 1) {
            const isMatch = await comparePassword(password, user.password)

            if (!isMatch) {
                return res.json({
                    error: 'Incorrect password'
                })
            } else {
                return res.json({
                    step: 2
                })
            }
        }

        if (step === 2) {
            if (!newpassword || newpassword.length < 6) {
                return res.json({
                    error: 'Password should be at least 6 characters long'
                })
            }

            const isMatchNew = await comparePassword(newpassword, user.password)
            if (isMatchNew) {
                return res.json({
                    error: 'Your new password cannot be the same as your current password.'
                })
            }

            const hashedPassword = await hashPassword(newpassword)

            await UserSchema.findByIdAndUpdate(
                userID,
                { password: hashedPassword },
                { new: true }
            )
            return res.json({
                message: "Password changed successfully!"
            })
        }

    } catch {
        return res.json({
            error: "Error occured while trying to update password. Try again later!"
        })
    }
};


exports.getFriendList = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await UserSchema.findById(userID);
        const { friendList } = user

        return res.json({
            friendList: friendList
        })
    } catch (error) {
        res.json({
            error: "Error loading friends list"
        })
    }
}

exports.acceptRequestAndCreateChat = async (req, res) => {
    const { userID, friendID } = req.body;

    try {

        const newChat = new ChatSchema({
            members: [userID, friendID]
        });

        await newChat.save();

        const friend = await UserSchema.findById(friendID);
        const friendEmail = friend.email;
        const friendUser = friend.username;


        await UserSchema.findByIdAndUpdate(userID, {
            $push: {
                friendList: {
                    friendID: friendID,
                    friendEmail: friendEmail,
                    friendUser: friendUser,
                    chatID: newChat._id
                },
                chats: newChat._id
            },
            $pull: {
                pendingRequests: { userID: friendID }
            }
        }, { new: true });


        const user = await UserSchema.findById(userID);
        const userEmail = user.email;
        const userName = user.username;

        await UserSchema.findByIdAndUpdate(friendID, {
            $push: {
                friendList: {
                    friendID: userID,
                    friendEmail: userEmail,
                    friendUser: userName,
                    chatID: newChat._id
                },
                chats: newChat._id
            },
            $pull: {
                sentRequests: { userID: userID }
            }
        }, { new: true });

        return res.json({
            message: "Friend Added",
            chat: newChat
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error accepting request"
        });
    }
};


exports.declineFriendRequest = async (req, res) => {
    const { userID, friendID } = req.body;

    try {
        await UserSchema.findByIdAndUpdate(userID, {
            $pull: {
                pendingRequests: { userID: friendID }
            }
        });

        await UserSchema.findByIdAndUpdate(friendID, {
            $pull: {
                sentRequests: { userID: userID }
            }
        });

        return res.json({
            message: "Request Declined",
        });
    } catch (error) {
        res.json({
            error: "Error declining request"
        });
    }

}

exports.findFriends = async (req, res) => {
    const { userID, keyword } = req.body;

    try {
        if (keyword.length < 3) {
            return res.json({
                error: "Keyword must have 3 or more characters"
            })
        }
        const friends = await UserSchema.find({
            _id: { $ne: userID },
            $or: [
                { email: { $regex: keyword, $options: 'i' } },
                { username: { $regex: keyword, $options: 'i' } }
            ]
        });

        return res.json({
            suggestedFriends: friends
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error finding friends'
        });
    }
}


exports.sendFriendRequest = async (req, res) => {
    const { userID, email } = req.body;
    try {
        const friend = await UserSchema.findOne({ email: email });

        if (!friend) {
            return res.json({
                error: "User not found"
            })
        }

        const user = await UserSchema.findById(userID).populate('friendList');
        const isFriendAlready = user.friendList.some(friend => friend.friendEmail === email);

        if (isFriendAlready) {
            return res.json({
                error: "User is already in your friend list"
            });
        }

        await UserSchema.findByIdAndUpdate(userID, {
            $push: {
                sentRequests: {
                    userID: friend._id,
                    userEmail: friend.email,
                    userName: friend.username
                }
            }
        });

        await UserSchema.findByIdAndUpdate(friend._id, {
            $push: {
                pendingRequests: {
                    userID: user._id,
                    userEmail: user.email,
                    userName: user.username
                }
            }
        })

        return res.json({
            message: "Request Sent!"
        })
    } catch (error) {
        return res.json({
            error: "Error sending friend request"
        })
    }
}

exports.cancelFriendRequest = async (req, res) => {
    const { userID, email } = req.body;

    try {
        const friend = await UserSchema.findOne({ email: email });

        await UserSchema.findByIdAndUpdate(userID, {
            $pull: {
                sentRequests: { userID: friend._id }
            }
        });

        await UserSchema.findByIdAndUpdate(friend._id, {
            $pull: {
                pendingRequests: { userID: userID }
            }
        })

        return res.json({
            message: "Request Cancelled"
        })
    } catch (error) {
        return res.json({
            error: "Error cancelling request"
        })
    }
}


exports.getPendingRequests = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await UserSchema.findById(userID)
        const { pendingRequests } = user

        return res.json({
            pendingRequests: pendingRequests
        })
    } catch (error) {
        res.json({
            message: "Error occured"
        })
    }
}

exports.getSentRequests = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await UserSchema.findById(userID)
        const { sentRequests } = user

        return res.json({
            sentRequests: sentRequests
        })
    } catch (error) {
        res.json({
            message: "Error occured"
        })
    }
}


exports.removeFriend = async (req, res) => {
    const { userID, chatID, email } = req.body;
    try {
        const user = await UserSchema.findByIdAndUpdate(userID, {
            $pull: {
                friendList: {
                    friendEmail: email,
                },
                chats: chatID
            }
        })

        const friend = await UserSchema.findOneAndUpdate({ email: email }, {
            $pull: {
                friendList: {
                    friendEmail: user.email,
                },
                chats: chatID
            }
        });

        // Delete chat
        await ChatSchema.findByIdAndDelete(chatID)


        return res.json({
            message: "Friend removed successfully"
        })
    } catch (error) {
        res.json({
            message: "Error occured"
        })
    }
}