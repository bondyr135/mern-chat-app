const { register, login, setAvatar, getAllUsers } = require("../controllers/usersController");

const express = require("express");
const router = express.Router();

///////////// USER-RELATED ROUTES

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get('/allusers/:id', getAllUsers);

module.exports = router;