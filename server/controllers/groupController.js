const GroupSchema = require('../models/groupModel');
const UserSchema = require("../models/userModel");
const mongoose = require('mongoose');


exports.createGroup = async (req, res) => {
    const { groupName, members, admin } = req.body;

    try {

        const membersDetailed = members.map(member => ({
            memberID: new mongoose.Types.ObjectId(member.userID),
            memberName: member.userName,
            memberEmail: member.userEmail
        }));

        const newGroup = new GroupSchema({
            groupName: groupName,
            admin: new mongoose.Types.ObjectId(admin),
            members: membersDetailed
        });

        await newGroup.save();

        for (const member of members) {
            try {
                const userObjectId = new mongoose.Types.ObjectId(member.userID);
                const user = await UserSchema.findById(userObjectId);

                user.groups.push({ groupID: newGroup._id });

                await user.save()

            } catch (updateError) {
                console.error(`Failed to update user ${userObjectId}:`, updateError);
            }
        }

        return res.json({
            message: "Group Created",
            group: newGroup
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error creating group"
        });
    }
};


exports.joinGroup = async (req, res) => {
    const { userInfo, groupID } = req.body;

    try {
        const { userID, userName, userEmail } = userInfo;


        const user = await UserSchema.findById(userID).populate('groups.groupID');

        const groupObjectID = new mongoose.Types.ObjectId(groupID);
        const isMemberAlready = user.groups.some(group => group.groupID.equals(groupObjectID));

        if (isMemberAlready) {
            return res.json({
                error: "You are already a member"
            });
        }


        const memberDetailed = {
            memberID: new mongoose.Types.ObjectId(userID),
            memberName: userName,
            memberEmail: userEmail
        }

        const group = await GroupSchema.findByIdAndUpdate(groupID, {
            $push: {
                members: memberDetailed
            }
        })

        await UserSchema.findByIdAndUpdate(userID, {
            $push: {
                groups: {
                    groupID: groupObjectID
                }
            }
        })

        if (group && group.messages) {
            for (let message of group.messages) {
                if (!message.showFor.includes(userID)) {
                    message.showFor.push(userID);
                }
            }
            await group.save();
        }

        return res.json({
            message: "You have joined the group",
            group: group
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error creating group"
        });
    }
}

exports.deleteGroup = async (req, res) => {
    const { userID, id } = req.body;

    try {
        const group = await GroupSchema.findById(id);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const groupObjectId = new mongoose.Types.ObjectId(id);

        for (const member of group.members) {
            const userObjectId = new mongoose.Types.ObjectId(member.memberID);
            const user = await UserSchema.findById(userObjectId);

            if (user) {
                user.groups.pull({ groupID: groupObjectId });
                await user.save();
            } else {
                console.error(`User not found: ${member.memberID}`);
            }
        }

        await group.deleteOne();

        return res.json({
            message: "Group deleted",
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: "Error deleting group"
        });
    }
};


exports.leaveGroup = async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        const groupObjectId = new mongoose.Types.ObjectId(groupID);
        const userObjectId = new mongoose.Types.ObjectId(userID);

        const group = await GroupSchema.findById(groupObjectId);

        if (!group) {
            return res.status(404).json({ error: "Group no longer exists" });
        }

        // Update the group
        group.members.pull({ memberID: userObjectId });
        await group.save();

        // Update the user
        const user = await UserSchema.findById(userObjectId);
        user.groups.pull({ groupID: groupObjectId });
        await user.save()


        return res.json({
            message: "You left the group",
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error leaving group"
        });
    }
}

exports.removeMember = async (req, res) => {
    const { userID, memberID, groupID } = req.body;

    try {
        const group = await GroupSchema.findById(groupID)

        if (!group) {
            return res.status(404).json({ error: "Group no longer exists" });
        }

        const isAdmin = group.admin.some(adminID => adminID.equals(userID));
        if (!isAdmin) {
            return res.status(403).json({ error: "You are not an admin" });
        }

        // Remove the member from the group's members list
        await GroupSchema.findByIdAndUpdate(groupID, {
            $pull: {
                members: { memberID: memberID }
            }
        });

        // Remove the group from the member's list of groups
        await UserSchema.findByIdAndUpdate(memberID, {
            $pull: {
                groups: { groupID: groupID }
            }
        });


        return res.json({
            message: "Member removed",
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error removing member"
        });
    }
}

exports.renameGroup = async (req, res) => {
    const { userID, groupID, newName } = req.body;

    try {
        const group = await GroupSchema.findById(groupID)

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const isAdmin = group.admin.some(adminID => adminID.equals(userID));
        if (!isAdmin) {
            return res.status(403).json({ error: "You are not an admin" });
        }

        group.groupName = newName;
        await group.save();

        return res.json({
            message: "Group name changed",
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error changing group name"
        });
    }
}


exports.makeAdmin = async (req, res) => {
    const { userID, memberID, groupID } = req.body;

    try {
        const group = await GroupSchema.findById(groupID)

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const isAdmin = group.admin.some(adminID => adminID.equals(userID));
        if (!isAdmin) {
            return res.status(403).json({ error: "You are not an admin" });
        }

        // if (group.admin.includes(memberID)) {
        //     return res.status(400).json({ error: 'Member is already an admin' });
        // }

        group.admin.push(memberID);
        await group.save();

        return res.json({
            message: "New admin set"
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error setting new admin"
        });
    }
}

exports.removeAdmin = async (req, res) => {
    const { userID, memberID, groupID } = req.body;

    try {
        const group = await GroupSchema.findById(groupID)

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const isAdmin = group.admin.some(adminID => adminID.equals(userID));
        if (!isAdmin) {
            return res.status(403).json({ error: "You are not an admin" });
        }

        group.admin.pull(memberID);
        await group.save();

        return res.json({
            message: "Member admin status removed"
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            error: "Error occured"
        });
    }
}


exports.getGroups = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await UserSchema.findById(userID);

        const groupIDs = user.groups.map(group => group.groupID);

        const groups = await GroupSchema.find({ _id: { $in: groupIDs } });

        return res.json({
            groups: groups
        })
    } catch (error) {
        res.json({
            error: "Error loading groups"
        })
    }
}

exports.getGroupDetail = async (req, res) => {
    const { groupID } = req.params;
    try {
        const group = await GroupSchema.findById(groupID).select('-createdAt -messages')

        if (!group) {
            return res.status(404).json({ error: "Group no longer exists" });
        }

        return res.json({
            group: group
        })
    } catch (error) {
        res.json({
            error: "Error occured"
        })
    }
}