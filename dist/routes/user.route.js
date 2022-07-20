"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const user_model_1 = require("../models/user.model");
const jwt_util_1 = require("../utils/jwt.util");
const error_model_1 = require("../models/error.model");
dotenv.config();
const saltRounds = 10;
const SECRET = 'C743BDE82646FD4CF7C43DBCE89CF';
let userRoute = express_1.default.Router();
exports.userRoute = userRoute;
// GET all users 
userRoute.get('', (req, res, next) => {
    res.status(200).send(user_model_1.userArray);
});
// GET current user
userRoute.get("/:userId", (req, res, next) => {
    let currentUser = jwt_util_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof user_model_1.User) {
        let foundUser = user_model_1.userArray.filter(u => u.userId === req.params.userId);
        if (foundUser.length > 0)
            res.status(200).send(foundUser[0]);
        else
            res.status(404).send(new error_model_1.ErrorMessage(404, 'User not Found'));
    }
    else
        res.status(401).send(new error_model_1.ErrorMessage(401, "error"));
});
// GET login user and create authToken
userRoute.get('/:userId/:password', (req, res, next) => {
    // let user = userArray.find(u => (u.userId === req.params.userId));
    let user = user_model_1.userArray.filter(u => u.userId === parseInt(req.params.userId));
    if (user.length > 0) {
        user[0].validatePassword(req.params.password).then((validPwd) => {
            if (validPwd) {
                let token = jwt_util_1.JWTAuth.GenerateWebToken(user[0]);
                res.status(200).send({ token: token });
            }
            else {
                res.status(401).send(new error_model_1.ErrorMessage(401, 'Invalid Username or Password'));
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    else
        res.status(404).send(new error_model_1.ErrorMessage(404, 'User not Found'));
});
// POST new user
userRoute.post('', async (req, res, next) => {
    let obj = req.body;
    let hashedPassword = await bcrypt_1.default.hash(obj.password, saltRounds);
    let userId = 0;
    let lastElement = user_model_1.userArray[user_model_1.userArray.length - 1];
    if (lastElement !== undefined) {
        userId = lastElement.userId + 1;
    }
    // console.log(obj);
    let newUser = new user_model_1.User(userId, obj.firstName, obj.lastName, obj.email, hashedPassword);
    if (newUser.CompleteUser()) {
        user_model_1.userArray.push(newUser);
        res.status(201).send(newUser.GetPasswordlessUser());
    }
    else {
        res.status(406).send({ message: 'All properties are required for a new user userId, firstName, lastName, mail, password', status: 406 });
    }
});
//PATCH update a user
userRoute.patch('/users/:userId', (req, res, next) => {
});
//DELETE user
userRoute.delete('/:userId', (req, res, next) => {
    let currentUser = jwt_util_1.JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof user_model_1.User) {
        let foundUser = user_model_1.userArray.filter(u => u.userId == req.params.userId);
        if (foundUser.length > 0) {
            user_model_1.userArray.splice(user_model_1.userArray.findIndex(u => u.userId === req.params.userId), 1);
            res.status(204).send('');
        }
        else
            res.status(404).send(new error_model_1.ErrorMessage(404, 'User not Found'));
    }
    else
        res.status(401).send(new error_model_1.ErrorMessage(401, 'User not Found'));
});
//# sourceMappingURL=user.route.js.map