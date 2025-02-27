const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  console.log("Received registration data:", req.body); // Debugging

  // Ensure the role is either "user" or "instructor"
  if (role !== "user" && role !== "instructor") {
    return res.status(400).json({
      success: false,
      message: "Invalid role, must be 'user' or 'instructor'",
    });
  }

  // Check for existing users with the same email or username
  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  // Hash the password and create the new user
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role, // Make sure role is correctly passed
    password: hashPassword,
  });

  await newUser.save();

  // Send success response
  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  // Look for the user based on email
  const checkUser = await User.findOne({ userEmail });

  // If the user doesn't exist or password is incorrect
  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if the user is an instructor or student
  if (checkUser.role !== "instructor" && checkUser.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "You do not have the required role to access this resource.",
    });
  }

  // Generate the JWT token
  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,  // Include role in the token
    },
    "JWT_SECRET",
    { expiresIn: "120m" } // Token expires in 2 hours
  );

  // Send back the response with the token and user info
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role, // Include role in the response data
      },
    },
  });
};

module.exports = { registerUser, loginUser };
