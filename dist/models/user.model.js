"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    constructor(userId, firstName, lastName, email, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    static ToUser(obj) {
        return obj.hasOwnProperty('userId') && obj.hasOwnProperty('firstName') && obj.hasOwnProperty('lastName') && obj.hasOwnProperty('email') ? new User(obj.userId, obj.firstName, obj.lastName, obj.email, '') : false;
    }
    // Return true if all the properties are filled in
    CompleteUser() {
        if (this.userId != null && this.firstName.length > 0 && this.lastName.length > 0 && this.email.length > 0 && this.password.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    validatePassword(password) {
        return bcrypt_1.default.compare(password, this.password);
    }
    // Return a user without the password property
    GetPasswordlessUser() {
        let pwdLess = new User(-1, '', '', '', '');
        Object.assign(pwdLess, this);
        let returnObj = pwdLess;
        delete returnObj.password;
        return returnObj;
    }
}
exports.User = User;
// POPULATE USER ARRAY 
const userArray = [];
exports.userArray = userArray;
userArray.push(new User(1, "james", "taylor", "tayj0016@gmail.com", ""));
bcrypt_1.default.genSalt(10, function (err, saltRounds) {
    bcrypt_1.default.hash('password', saltRounds, function (err, hash) {
        userArray[0].password = hash;
    });
});
//# sourceMappingURL=user.model.js.map