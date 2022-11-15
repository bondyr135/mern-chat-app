const { addMessage, getAllMessages } = require("../controllers/messagesController");

const express = require("express");
const router = express.Router();

// For adding a message
router.post("/addmsg", addMessage);
// For getting all shared messages
router.post("/getallmsgs", getAllMessages);

module.exports = router;