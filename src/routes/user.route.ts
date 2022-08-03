import express from 'express';
import bcrypt from 'bcrypt';
import * as dotenv from "dotenv";

import { User, userArray } from '../models/user.model';
import { JWTAuth } from '../utils/jwt.util';
import { ErrorMessage } from '../models/error.model';

dotenv.config();
const saltRounds = 10;
const SECRET = 'C743BDE82646FD4CF7C43DBCE89CF';

let userRoute = express.Router();

// GET all users 
userRoute.get('', (req, res, next) => {
    res.status(200).send(userArray);
});

// GET current user
userRoute.get("/:userId", (req, res, next) => {
    let currentUser = JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof User) {
        let foundUser = userArray.filter(u => u.userId === req.params.userId);
        if (foundUser.length > 0)
            res.status(200).send(foundUser[0]);
        else
            res.status(404).send(new ErrorMessage(404, 'User not Found'));
    }
    else
        res.status(401).send(new ErrorMessage(401, "error"));
});

// GET login user and create authToken
userRoute.get('/:userId/:password', (req, res, next) => {
    // let user = userArray.find(u => (u.userId === req.params.userId));
    let user = userArray.filter(u => u.userId === parseInt(req.params.userId));

    if (user.length > 0) {
        user[0].validatePassword(req.params.password).then((validPwd: any) => {
            if (validPwd) {
                let token = JWTAuth.GenerateWebToken(user[0])
                res.status(200).send({ token: token });
            }
            else {
                res.status(401).send(new ErrorMessage(401, 'Invalid Username or Password'));
            }
        }).catch((e: any) => {
            console.log(e);
        });
    }
    else
        res.status(404).send(new ErrorMessage(404, 'User not Found'));
});

// POST new user
userRoute.post('', async (req, res, next) => {
    let obj = req.body;
    let hashedPassword = await bcrypt.hash(obj.password, saltRounds)
    let userId = 0
    let lastElement = userArray[userArray.length - 1];
    if (lastElement !== undefined) {
        userId = lastElement.userId + 1;
    }
    // console.log(obj);
    let newUser = new User(userId, obj.firstName, obj.lastName, obj.email, hashedPassword, obj.isAdmin);

    if (newUser.CompleteUser()) {
        userArray.push(newUser);
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
    let currentUser = JWTAuth.VerifyToken(req.headers);
    if (currentUser instanceof User) {
        let foundUser = userArray.filter(u => u.userId == req.params.userId);
        if (foundUser.length > 0) {
            userArray.splice(userArray.findIndex(u => u.userId === req.params.userId), 1);
            res.status(204).send('');
        }
        else
            res.status(404).send(new ErrorMessage(404, 'User not Found'));
    }
    else
        res.status(401).send(new ErrorMessage(401, 'User not Found'));
});

export { userRoute }