const {
  genarateToken,
} = require("../config/jwtToken.js");
const {
  genarateRefreshToken,
} = require("../config/refreshToken.js");
const userModel = require("../models/userModel.js");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

// create user
const addUser = async (req, res) => {
  const { email } = req.body;
  const exisitingUser =
    await userModel.findOne({ email }); // kiểm tra có email nào chưa
  if (exisitingUser) {
    return res.status(500).send({
      success: true,
      message: "Email này đã tồn tại", // nếu tìm thấy có tồn tại
    });
  }
  try {
    const newUser = new userModel(
      req.body
    ).save();
    res.status(201).send({
      newUser: req.body,
      success: true,
      message:
        "Create new user successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Create new User False",
      success: false,
      error: error,
    });
  }
};

// login user
const loginUser = asyncHandle(
  async (req, res) => {
    const { email, password } =
      req.body;

    const findUser =
      await userModel.findOne({
        email,
      });
    if (
      findUser &&
      (await findUser.isPasswordMatched(
        password
      ))
    ) {
      const refreshToken =
        await genarateRefreshToken(
          findUser?._id
        ); // tạo taoken trong 3 ngày
      const updateUser =
        await userModel.findByIdAndUpdate(
          findUser?._id,
          {
            refreshToken: refreshToken,
          },
          {
            new: true,
          }
        );
      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000, // thơi gian sống của cookie và có tên là refreshtoken (72 giờ)
        }
      );
      res.status(201).send({
        success: true,
        message: "Login successfully",
        _id: findUser?._id,
        name: findUser?.name,
        email: findUser?.email,
        address: findUser?.address,
        mobile: findUser?.mobile,
        password: findUser?.password,
        role: findUser?.role,
        token: genarateToken(
          findUser?._id
        ), // hiển thị ra token
      });
    } else {
      return res.status(500).send({
        success: true,
        message:
          "please create new user, Invalid", // nếu tìm thấy có tồn tại
      });
    }
  }
);

// login admin
const loginAdmin = asyncHandle(
  async (req, res) => {
    const { email, password } =
      req.body;
    const findAdmin =
      await userModel.findOne({
        email,
      });
    if (findAdmin.role !== "admin") {
      return res.status(500).send({
        success: false,
        message: "not authorised", // nếu tìm thấy có tồn tại
      });
    }
    if (
      findAdmin &&
      (await findAdmin.isPasswordMatched(
        password
      ))
    ) {
      const refreshToken =
        await genarateRefreshToken(
          findAdmin?._id
        );
      const updateUser =
        await userModel.findByIdAndUpdate(
          findAdmin?._id,
          {
            refreshToken: refreshToken,
          },
          {
            new: true,
          }
        );
      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
        }
      );
      res.status(201).send({
        success: true,
        message: "Login successfully",
        _id: findAdmin?._id,
        name: findAdmin?.name,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        password: findAdmin?.password,
        role: findAdmin?.role,
        token: genarateToken(
          findAdmin?._id
        ), // hiển thị ra token
      });
    } else {
      return res.status(500).send({
        success: true,
        message:
          "please create new user, Invalid", // nếu tìm thấy có tồn tại
      });
    }
  }
);

// handle refresh token
const handleRefreshToken = asyncHandle(
  async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie?.refreshToken) {
      res.send({
        success: false,
        message:
          "No refresh token in cookies",
      });
    }
    const refreshToken =
      cookie?.refreshToken;
    console.log(refreshToken);
    const user =
      await userModel.findOne({
        refreshToken,
      });
    if (!user) {
      res.status(401).send({
        success: false,
        message:
          "No refresh token present in db or not matched",
        user,
      });
    }
    jwt.verify(
      refreshToken,
      "SECRET",
      (err, decoded) => {
        if (
          err ||
          user.id !== decoded.id
        ) {
          res.status(401).send({
            success: false,
            message:
              "there is something wrong with refresh token",
          });
        }
        const accessToken =
          genarateToken(user.id);
        res.status(200).send({
          success: true,
          message:
            "refresh token success",
          accessToken,
        });
      }
    );
  }
);

// logout func
const logout = asyncHandle(
  async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)
      throw new Error(
        "No Refresh Token in Cookies"
      );
    const refreshToken =
      cookie.refreshToken;
    const user =
      await userModel.findOne({
        refreshToken,
      });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(200).send({
        success: true,
        message:
          "clear cookies success",
      }); // forbidden
    }
    await userModel.findOneAndUpdate(
      { refreshToken },
      {
        $set: { refreshToken: "" },
      }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).send({
      success: true,
      message: "clear cookies success",
    }); // forbidden
  }
);

// get all users
const getAllUsers = async (
  req,
  res
) => {
  try {
    const user = await userModel.find(
      {}
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get all users error !",
    });
  }
};

// get a user
const getsignUser = async (
  req,
  res
) => {
  const { _id } = req.params;
  try {
    const getUser =
      await userModel.findById(_id);
    res.status(200).json({
      success: true,
      message:
        "Get user successfully !",
      getUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get user error !",
    });
  }
};

// update user
const updateUser = asyncHandle(
  async (req, res) => {
    const { _id } = req.params;
    try {
      // Hash lại mật khẩu mới nếu có
      if (req.body.password) {
        const salt =
          await bcrypt.genSaltSync(10);
        req.body.password =
          await bcrypt.hash(
            req.body.password,
            salt
          );
      }

      const user =
        await userModel.findByIdAndUpdate(
          _id,
          {
            name: req?.body?.name,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            password:
              req?.body?.password,
            role: req?.body?.role,
          },
          {
            new: true,
          }
        );
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Update user error !",
      });
    }
  }
);

// delete a user
const deletesignUser = async (
  req,
  res
) => {
  const { _id } = req.params;
  try {
    const user =
      await userModel.findByIdAndDelete(
        _id
      );
    res.status(200).json({
      success: true,
      message:
        "delete user successfully !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "delete user error !",
    });
  }
};
const updatePassword = asyncHandle(
  async (req, res) => {
    const { _id } = req.user;
    const password = req.body.password;
    validateMongooseDbId(_id);
    const user =
      await userModel.findById(_id);
    console.log(password);
    if (password) {
      user.password = password;
      const updatedPassword =
        await user.save();
      res.status(200).send({
        success: true,
        message:
          "Update password success",
        updatedPassword,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Update password ...",
        user,
      });
    }
  }
);

module.exports = {
  addUser,
  loginUser,
  getAllUsers,
  getsignUser,
  deletesignUser,
  updateUser,
  handleRefreshToken,
  logout,
  updatePassword,
  loginAdmin,
};
