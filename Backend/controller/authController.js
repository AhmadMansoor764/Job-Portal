import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../config/google.js";
import EmailVerification from "../model/EmailVerification.js";
import transporter from "../config/mail.js";
import PendingRegistration from "../model/PendingRegistration.js";

const isProduction = process.env.NODE_ENV === "production";

// generation the otp code to verify the email
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, location, role } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email || !password || !phone || !location || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Only allow these two roles
    if (!["jobSeeker", "employer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account role",
      });
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail = email.toLowerCase().trim();

    // ==========================================
    // CHECK IF USER ALREADY EXISTS
    // ==========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // REMOVE OLD PENDING REGISTRATION
    // ==========================================

    await PendingRegistration.deleteMany({
      email: normalizedEmail,
    });

    // ==========================================
    // REMOVE OLD OTP
    // ==========================================

    await EmailVerification.deleteMany({
      email: normalizedEmail,
    });

    // ==========================================
    // SAVE PENDING REGISTRATION
    // ==========================================

    await PendingRegistration.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      location: location.trim(),
      role,
    });

    // ==========================================
    // GENERATE OTP
    // ==========================================

    const otp = generateOTP();

    // OTP expires after 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ==========================================
    // SAVE OTP
    // ==========================================

    await EmailVerification.create({
      email: normalizedEmail,
      otp,
      expiresAt,
    });

    // ==========================================
    // SEND EMAIL
    // ==========================================

    console.log("EMAIL USER:", process.env.EMAIL_USER);
    console.log("OTP RECIPIENT:", normalizedEmail);

    const info = await transporter.sendMail({
      from: `"JobPortal" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Verify your JobPortal email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2 style="color: #2563eb;">
            Welcome to JobPortal
          </h2>

          <p>
            Hello ${name.trim()},
          </p>

          <p>
            Thank you for creating your JobPortal account.
            Please use the verification code below to verify your email address.
          </p>

          <div
            style="
              background: #f1f5f9;
              padding: 20px;
              text-align: center;
              border-radius: 10px;
              margin: 25px 0;
            "
          >
            <div
              style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #1e293b;
              "
            >
              ${otp}
            </div>
          </div>

          <p>
            This verification code will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not create a JobPortal account, you can safely ignore
            this email.
          </p>

          <hr style="margin-top: 30px;" />

          <p style="font-size: 12px; color: #64748b;">
            JobPortal
          </p>

        </div>
      `,
    });

    console.log("Email sent successfully:", info.messageId);

    // ==========================================
    // IMPORTANT:
    // DO NOT CREATE USER YET
    // DO NOT CREATE JWT YET
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start registration",
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

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail = email.toLowerCase().trim();

    // ==========================================
    // FIND OTP
    // ==========================================

    const verification = await EmailVerification.findOne({
      email: normalizedEmail,
    });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Verification code not found or expired",
      });
    }

    // ==========================================
    // CHECK EXPIRATION
    // ==========================================

    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    // ==========================================
    // CHECK OTP
    // ==========================================

    if (verification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // ==========================================
    // FIND PENDING REGISTRATION
    // ==========================================

    const pendingUser = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Registration information not found",
      });
    }

    // ==========================================
    // CREATE REAL USER
    // ==========================================

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      phone: pendingUser.phone,
      location: pendingUser.location,
      role: pendingUser.role,
      emailVerified: true,
    });

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ==========================================
    // SET AUTH COOKIE
    // ==========================================

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ==========================================
    // DELETE OTP
    // ==========================================

    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    // ==========================================
    // DELETE PENDING REGISTRATION
    // ==========================================

    await PendingRegistration.deleteOne({
      _id: pendingUser._id,
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Email verified successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // JWT expiration
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberMe ? "30d" : "1d",
      },
    );

    // Cookie options for this login
    const loginCookieOptions = {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
    };

    // Store token in HTTP-only cookie
    res.cookie("token", token, loginCookieOptions);

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
