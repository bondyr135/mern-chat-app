const messagesModel = require('../models/messageModel');


///////////// FOR SENDING\ RECEIVING A MESSAGE
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messagesModel.create({
      message: { text: message },
      users: [from, to],
      sender: from
    });
    if (data) return res.json({ msg: "Message added successfull" });
    return res.json({ msg: "Failed to add message" })
  } catch (ex) {
    next(ex);
  }
}
/////////////  ON CONNECTING TO A CHAT, RETRIEVE ALL PAST MESSAGES BETWEEN THE TWO USERS
module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messagesModel.find({
      users: {
        $all: [from, to],
      }
    }).sort({ updatedAt: 1 }); // SORT BY DATE, SO PRESENTED IN ORDER

    const projectedMessages = messages.map(msg => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text
      }
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
}