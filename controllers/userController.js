const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateUserInput = require("../utils/validateInput");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName, gender, dateOfBirth, country } = req.body;

    const errors = validateUserInput(req.body);
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      gender,
      dateOfBirth,
      country,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.params;
    const user = await User.findOne({ $or: [{ username: query }, { email: query }] });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
