var express = require('express');
var router = express.Router();
var userController = require('../controllers/users');
var roleController = require('../controllers/roles');
let { CreateSuccessRes } = require('../utils/responseHandler');
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let {check_authentication} = require('../utils/check_auth')

/* GET home page. */
router.post('/login', async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userID = await userController.CheckLogin(username, password);
        CreateSuccessRes(res, jwt.sign({
            id:userID,
            expire:(new Date(Date.now()+60*60*1000)).getTime()
        },constants.SECRET_KEY), 200)
    } catch (error) {
        next(error)
    }
});

router.post('/signup', async function (req, res, next) {
    try {
        let body = req.body;
        let roleToCreate = body.role || 'user'; // Default to 'user' if no role specified
        
        // Create role if it doesn't exist
        try {
            await roleController.CreateARole(roleToCreate);
        } catch (error) {
            // Role might already exist, continue
        }

        let newUser = await userController.CreateAnUser(
            body.username,
            body.password,
            body.email,
            roleToCreate
        )
        CreateSuccessRes(res,jwt.sign({
            id:newUser._id,
            expire:(new Date(Date.now()+60*60*1000)).getTime()
        },constants.SECRET_KEY),200);
    } catch (error) {
        next(error)
    }
})

router.post('/changepassword',check_authentication, async function (req, res, next) {
    try {
        let body = req.body;
        let oldpassword = body.oldpassword;
        let newpassword = body.newpassword;
        let result = await userController.ChangePassword(req.user,oldpassword,newpassword);
        CreateSuccessRes(res,result,200);
    } catch (error) {
        next(error)
    }
    
})

router.get('/me',check_authentication, async function (req, res, next) {
    console.log(req.user);
    CreateSuccessRes(res,req.user,200)
})


//67de10517282904fbca502ae
module.exports = router;
