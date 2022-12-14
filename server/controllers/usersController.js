const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

///////////// WHEN REGISTERING AS A NEW USER 
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await Users.findOne({ username });
    if (usernameCheck) { // IF USERNAME ALREADY EXISTS
      return res.json({ msg: "Username is already in use", status: false })
    };

    const emailCheck = await Users.findOne({ email });
    if (emailCheck) { //  IF CHOSEN E-MAIL IS ALREADY USER
      return res.json({ msg: "Email is already in use", status: false })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword
    });
    delete newUser.password;

    return res.json({
      status: true,
      newUser
    })
  } catch (ex) {
    next(ex)
  }
}

///////////// LOGIN AS A REGISTERED USER
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (!user) { // USER NOT FOUND IN DB
      return res.json({ msg: "Incorrect username or password", status: false })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { // WRONG PASSWORD
      return res.json({ msg: "Incorrect username or password", status: false });
    }
    delete user.password;

    return res.json({
      status: true,
      user
    })
  } catch (ex) {
    next(ex)
  }
}

///////////// SET AVATAR
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage
    });
    return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (ex) {
    next(ex)
  }
}

///////////// GET ALL USERS
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({
      _id: { $ne: req.params.id }
    }).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex)
  }
}
