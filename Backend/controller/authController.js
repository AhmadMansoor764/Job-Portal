import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../config/google.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, location, role } = req.body;

    if (!name || !email || !password || !phone || !location || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User have successfully registered",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({
      exists: true,
      message: "Email is already registered.",
    });
  }

  res.json({
    exists: false,
  });
};

export const login = async (req, res) => {
  try {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Store the token in an HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    // Send success response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// google authentication section when the user logs in

export const googleLogin = async (req, res) => {
  try {
    const { credential, role, action } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    // LOGIN
    if (action === "login") {
      if (!user) {
        return res.status(404).json({
          success: false,
          userExists: false,
          message: "No account found. Please sign up first.",
        });
      }

      if (!user.googleId) {
        user.googleId = googleId;
      }

      user.profileImage = picture;
      user.authProvider = "google";

      await user.save();
    }

    // SIGN UP
    else if (action === "signup") {
      // Existing account
      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
        }

        user.profileImage = picture;
        user.authProvider = "google";

        await user.save();
      }

      // New account
      else {
        user = await User.create({
          name,
          email,
          googleId,
          profileImage: picture,
          authProvider: "google",
          role,
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",

      profileComplete: Boolean(user.role && user.phone && user.location),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};

// write the backend logic for completing the account information
export const completeProfile = async (req, res) => {
  try {
    const { phone, location, role } = req.body;

    if (!phone || !location || !role) {
      return res.status(400).json({
        success: false,
        message: "All profile fields are required",
      });
    }

    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        phone,
        location,
        role,
      },
      {
        new: true,
      },
    );

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",

      profileComplete: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        profileComplete: true,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Profile completion failed",
    });
  }
};
