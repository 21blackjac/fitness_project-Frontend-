const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for authentication
// function auth(req, res, next) {
//   const token  = req.header("x-auth-token");
//   // Check if not token is supplied
//   if (!token) return res.status(401).send({ msg: "No Token Provided" });

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     console.log(decoded);
//     // Get the user from the database using the email from the payload
//     User = Admin.findOne({email : decoded.email});
//     // Attach the user to the request so it can be accessed in subsequent middleware functions
//     req.user = User;
//     next();
//   } catch (e) {
//     res.status(401).send({ msg: "Invalid Token" })
//   }
// }

// router.get("/signup", (req, res) => {
//   res.send(
//     "<form action='/admin/signup' method='POST'>Sign-up formular:<br /><br /><input type='text' name='username' required /><br /><br /><input type='email' name='email'  required /><br /><br /><input type='password' name='password' required /><br /><br /><input type='submit' value='Register' /> </form> "
//   );
// });

// router.get("/login", (req, res) => {
//   res.send(
//     "<form action='/admin/login' method='POST'>Login formular:<br /><br /><input type='email' name='email'  required /><br /><br /><input type='password' name='password' required /><br /><br /><input type='submit' value='Login' /> </form> "
//   );
// });

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).send({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const token = jwt.sign({ _id: newAdmin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
      })
      .status(201)
      .json({
        message: "Admin created successfully!",
        token,
        userId: newAdmin._id,
      });
  } catch (err) {
    console.error("Error:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).send("Invalid Email or Password");
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).send("Invalid Email or Password");
    }

    const token = jwt.sign({ _id: admin._id }, JWT_SECRET, { expiresIn: "1h" });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
      })
      .json({
        message: "You've been logged in successfully!",
        token,
        userId: admin._id,
      });
    console.log("Admin: ", admin);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("adminId").json({ message: "Logged out successfully!" });
});

router.get("/display", async (req, res) => {
  try {
    const admin = await Admin.find();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.log("Error:", error.message);
  }
});

router.get("/display/:id", async (req, res) => {
  try {
    const admin_id = req.params.id;
    if (!admin_id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await Admin.findById(admin_id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.json({ message: "Admin data updated successfully", admin });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
