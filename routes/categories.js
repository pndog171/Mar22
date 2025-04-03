var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth'); // Middleware kiểm tra quyền

// GET all categories - Không yêu cầu đăng nhập
router.get('/', async function (req, res, next) {
  let categories = await categoryModel.find({
    isDeleted: false
  });
  CreateSuccessRes(res, categories, 200);
});

// GET category by id - Không yêu cầu đăng nhập
router.get('/:id', async function (req, res, next) {
  try {
    let category = await categoryModel.findOne({
      _id: req.params.id, isDeleted: false
    });
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

// POST create category - Yêu cầu quyền 'mod'
router.post('/', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categoryModel({
      name: body.name,
    });
    await newCategory.save();
    CreateSuccessRes(res, newCategory, 200);
  } catch (error) {
    next(error);
  }
});

// PUT update category - Yêu cầu quyền 'mod'
router.put('/:id', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updatedInfo = {};
    if (body.name) {
      updatedInfo.name = body.name;
    }
    let updatedCategory = await categoryModel.findByIdAndUpdate(
      id, updatedInfo, { new: true }
    );
    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});

// DELETE category - Yêu cầu quyền 'admin'
router.delete('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  let id = req.params.id;
  try {
    let updatedCategory = await categoryModel.findByIdAndUpdate(
      id, { isDeleted: true }, { new: true }
    );
    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
