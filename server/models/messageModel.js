const mongoose = require("mongoose");


/////////////   HOW SHOULD THE MESSAGE LOOK LIKE
const messageSchema = mongoose.Schema({
  message: {
    text: {
      type: String,
      required: true
    },
  },
  users: Array,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model("Messages", messageSchema);