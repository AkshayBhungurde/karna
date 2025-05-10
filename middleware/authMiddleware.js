// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // const JWT_SECRET = "your_jwt_secret"; // move to .env for production

// // // Authenticate Token
// // exports.authMiddleware = async (req, res, next) => {
// //   const token = req.header("Authorization");

// //   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

// //   try {
// //     const decoded = jwt.verify(token, JWT_SECRET);
// //     req.user = await User.findById(decoded.id).select("-password");
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ msg: "Token is not valid" });
// //   }
// // };

// // // Admin Only
// // exports.adminOnly = (req, res, next) => {
// //   if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });
// //   next();
// // };

// // // Teacher Only
// // exports.teacherOnly = (req, res, next) => {
// //   if (req.user.role !== "teacher") return res.status(403).json({ msg: "Access denied" });
// //   next();
// // };










// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // const authMiddleware = async (req, res, next) => {
// //   const token = req.header("x-auth-token");

// //   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded.user;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ msg: "Token is not valid" });
// //   }
// // };

// // const teacherOnly = (req, res, next) => {
// //   if (req.user.role !== "teacher") {
// //     return res.status(403).json({ msg: "Access denied" });
// //   }
// //   next();
// // };

// // const adminOnly = (req, res, next) => {
// //   if (req.user.role !== "admin") {
// //     return res.status(403).json({ msg: "Access denied" });
// //   }
// //   next();
// // };

// // module.exports = { authMiddleware, teacherOnly, adminOnly };



// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const dotenv = require('dotenv');


// dotenv.config();

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("x-auth-token");

//   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     req.user = user; // now req.user has 'role' and other fields
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

// const teacherOnly = (req, res, next) => {
//   if (!req.user || req.user.role !== "teacher") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   next();
// };

// const adminOnly = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   next();
// };

// module.exports = { authMiddleware, teacherOnly, adminOnly };










const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "teacher") {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const teacherOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

module.exports = { authMiddleware, teacherOnly, adminOnly };
