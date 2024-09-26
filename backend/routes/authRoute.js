// const express = require("express");
// const route = express.Router();

// const {
//   authMiddleware,
//   isAdmin,
// } = require("../middlewares/authMiddleware.js");
// const {
//   addUser,
//   loginUser,
//   loginAdmin,
//   updateUser,
//   updatePassword,
//   getAllUsers,
//   getsignUser,
//   handleRefreshToken,
//   logout,
//   deletesignUser,
// } = require("../controllers/userController.js");

// route.post("/register", addUser);
// route.post("/login", loginUser);
// route.post("/admin-login", loginAdmin);

// route.put(
//   "/update-user/:_id",
//   authMiddleware,
//   updateUser
// );
// route.put(
//   "/password",
//   authMiddleware,
//   updatePassword
// );

// route.get("/all-user", getAllUsers);
// route.get(
//   "/get-user/:_id",
//   authMiddleware,
//   isAdmin,
//   getsignUser
// );
// route.get(
//   "/refresh",
//   handleRefreshToken
// );
// route.get("/logout", logout);

// route.delete(
//   "/delete-user/:_id",
//   deletesignUser
// );

// module.exports = route;
