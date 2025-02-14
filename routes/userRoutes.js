const express = require("express");
const { registerUser, loginUser, searchUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search/:query", authMiddleware, searchUser);

module.exports = router;
