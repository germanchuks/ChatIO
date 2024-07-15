const { getUserInfo, updatePassword, getFriendList, acceptRequestAndCreateChat, sendFriendRequest, getPendingRequests, getSentRequests, declineFriendRequest, cancelFriendRequest, removeFriend } = require('../controllers/userController');


const router = require('express').Router()

router.get('/get-info/:userID', getUserInfo)
router.put('/update-password/:userID', updatePassword)
router.get('/get-friends/:userID', getFriendList);
router.post('/accept-request', acceptRequestAndCreateChat);
router.post('/decline-request', declineFriendRequest);
router.post('/send-friend-request', sendFriendRequest);
router.post('/cancel-friend-request', cancelFriendRequest);
router.get('/get-pending-requests/:userID', getPendingRequests);
router.get('/get-sent-requests/:userID', getSentRequests);
router.post('/remove-friend', removeFriend);

// router.post('/add-')

module.exports = router