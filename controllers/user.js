import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.js";

import sendGridMail from "@sendgrid/mail";

// ON DEPLOYMENT, SWITCH TO "process.env.SENDGRID_API_KEY"
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// CREATE NEW USER
export const signup = async (req, res, next) => {
  console.log(req.body);

  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hash,
      userProfile: {
        role: req.body.userProfile.role,
        department: req.body.userProfile.department,
        firstName: req.body.userProfile.firstName,
        lastName: req.body.userProfile.lastName,
        phoneNumber: req.body.userProfile.phoneNumber,
        themePref: req.body.userProfile.themePref,
        businessId: req.body.userProfile.businessId,
        location: req.body.userProfile.location,
      },
    });

    // CUSTOM "UNIQUE EMAIL" VALIDATOR
    try {
      const checkEmailUnique = await User.findOne({ email: req.body.email });
      console.log("||| checking email unique |||");
      console.log(checkEmailUnique);
      if (checkEmailUnique && checkEmailUnique.email) {
        res.status(422).json({
          message:
            "Email already in use. Please sign in or create your account with a different email.",
        });
      }
    } catch (error) {
      console.log(error);
      if (!res.headersSent) {
        res.status(500).json({
          message: "Signup failed! Please try again.",
          message: error,
        });
      }
    }
    // CUSTOM "UNIQUE EMAIL" VALIDATOR // END

    const newUser = await user.save();

    sendGridMail.send({
      to: req.body.email,
      from: "info@calebdickson.com",
      subject: "Welcome to InventoryApp!",
      html: `<style>
      main {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
          Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }
      .title {
        color: #363636;
      }
    </style>
    <script defer></script>
    <main>
      <body>
        <h1 class="title">You have successfully signed up for "Inventory App"</h1>
        <p>Welcome!</p>
        <p>Click <a href="http://localhost:4200">here</a> to confirm your email</p>
      </body>
    </main>`,
    });

    res.status(201).json({
      message: "Signup successful! Check your email.",
      result: newUser,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Signup failed! Please try again.",
        message: error,
      });
    }
  }
};
// CREATE NEW USER /// END

// USER LOGIN
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).json({
        message: "Login failed. User not found.",
      });
    } else if (user) {
      const bcryptRes = await bcrypt.compare(req.body.password, user.password);
      if (!bcryptRes) {
        res.status(401).json({
          message: "Login failed. Password incorrect.",
        });
      }
    }

    const userToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        userRole: user.userProfile.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "4h" }
    );

    res.status(200).json({
      token: userToken,
      expiresIn: 14400,
      user: user,
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: error,
      });
    }
  }
};
// USER LOGIN /// END

export const updateUser = async (req, res, next) => {
  console.log(req.file);
  console.log("||| ^^^ req.file ^^^ |||");
  console.log(req.body);
  console.log("||| ^^^ req.body ^^^ |||");
  let imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/users/" + req.file.filename;
    console.log(imagePath);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        // email: req.body.email,
        // "userProfile.role": req.body.role,
        // "userProfile.department": req.body.department,
        "userProfile.firstName": req.body.firstName,
        "userProfile.lastName": req.body.lastName,
        "userProfile.phoneNumber": req.body.phoneNumber,
        "userProfile.themePref": req.body.themePref,
        "userProfile.userPhoto": imagePath,
      },
      { new: true }
    );
    console.log(updatedUser);
    console.log("||| ^^^ updatedUser ^^^ |||");

    if (updatedUser) {
      res.status(200).json({ updatedUser: updatedUser });
    } else {
      res
        .status(500)
        .json({ message: "An unknown server error has occurred." });
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: error,
      });
    }
  }
};

// ||| Unfinished Unfinished Unfinished Unfinished Unfinished |||
// FETCH ALL LOCATIONS WHERE USER IS AUTHORIZED
export const getUserLocations = async (req, res, next) => {
  try {
    if (+req.params.userRole === 2) {
      const userLocations = await Location.find({ manager: req.params.userId });
    }
    if (+req.params.userRole === 1) {
      const userLocations = await Location.find({
        staffMember: req.params.userId,
      });
    }
    console.log(userLocations);
    console.log("||| ^^^ userLocations here ^^^");

    if (userLocations) {
      res.status(200).json({ fetchedLocations: userLocations });
    }
    if (!userLocations) {
      res
        .status(404)
        .json({ message: "No authorized locations were found for this user." });
    }
  } catch (error) {
    // CATCH AND RETURN UNEXPECTED ERRORS
    console.log(error);
    res.status(500).json({
      message: error._message,
    });
  }
};
// FETCH ALL LOCATIONS WHERE USER IS AUTHORIZED /// END
