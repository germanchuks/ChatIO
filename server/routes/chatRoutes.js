const { storeMessage, getPreviousMessages, deleteMessagesForOne, clearMessagesForOne, storeGroupMessage, getPreviousGroupMessages, deleteMessagesInChat, clearOrDeleteMessagesInChat, clearOrDeleteMessagesInGroupChat } = require('../controllers/chatController');

const router = require('express').Router()

// Chat routes
router.post('/store-message', storeMessage);
router.get('/get-previous-messages/:chatID/:userID', getPreviousMessages);

// Group chat routes
router.post('/store-group-message', storeGroupMessage);
router.get('/get-previous-group-messages/:groupID/:userID', getPreviousGroupMessages);

router.post('/clear-messages', clearOrDeleteMessagesInChat);
router.post('/clear-group-messages', clearOrDeleteMessagesInGroupChat);


module.exports = router