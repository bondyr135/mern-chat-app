const { addMessage, getAllMessages } = require("../controllers/messagesController");

const express = require("express");
const router = express.Router();

///////////// MESSAGE-RELATED ROUTES

// FOR ADDING A MESSAGE
router.post("/addmsg", addMessage);
// FOR RECEIVING ALL SHARED MESSAGES
router.post("/getallmsgs", getAllMessages);

module.exports = router;