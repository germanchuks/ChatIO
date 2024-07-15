const { createGroup, joinGroup, deleteGroup, removeMember, renameGroup, makeAdmin, getGroups, leaveGroup, removeAdmin, getGroupDetail } = require('../controllers/groupController');


const router = require('express').Router()

router.post('/create-group', createGroup);
router.post('/join-group', joinGroup);

router.post('/delete-group', deleteGroup);
router.post('/leave-group', leaveGroup);
router.post('/remove-member', removeMember);
router.post('/rename-group', renameGroup);
router.post('/make-admin', makeAdmin);
router.post('/remove-admin', removeAdmin)
router.get('/get-groups/:userID', getGroups);

router.get('/get-group-details/:groupID', getGroupDetail);


// router.post('/add-')

module.exports = router