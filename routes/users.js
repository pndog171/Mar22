var express = require('express');
var router = express.Router();
let userModel = require('../schemas/user');
let { check_authentication, check_authorization } = require('../utils/check_auth'); // Middleware kiểm tra quyền

// GET all users - Yêu cầu quyền 'mod'
router.get('/', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let users = await userModel.find({
      _id: { $ne: req.user._id }, // Trừ chính user đang login
      status: true
    }).populate('role');
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error);
  }
});

// GET user by id - Yêu cầu quyền 'mod'
router.get('/:id', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).populate('role');
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error);
  }
});

// POST create user - Yêu cầu quyền 'admin'
router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = new userModel({
      username: body.username,
      password: body.password,
      email: body.email,
      role: body.role
    });
    await newUser.save();
    CreateSuccessRes(res, newUser, 200);
  } catch (error) {
    next(error);
  }
});

// PUT update user - Yêu cầu quyền 'admin'
router.put('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let updatedInfo = req.body;
    let updatedUser = await userModel.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });
    CreateSuccessRes(res, updatedUser, 200);
  } catch (error) {
    next(error);
  }
});

// DELETE user - Yêu cầu quyền 'admin'
router.delete('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let updatedUser = await userModel.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    CreateSuccessRes(res, updatedUser, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
