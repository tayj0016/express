"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTAuth {
    static VerifyToken(headers) {
        // console.log(headers.authorization);
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            try {
                let user = jsonwebtoken_1.default.verify(headers.authorization.split(' ')[1], JWTAuth.SecretSalt);
                if (user.UserData) {
                    let currentUser = user_model_1.User.ToUser(user.UserData);
                    if (currentUser instanceof user_model_1.User) {
                        if (user_model_1.userArray.find(u => u.userId === currentUser.userId))
                            return currentUser;
                        else
                            throw `Invalid user ${currentUser.userId}`;
                    }
                    else
                        throw 'Malformed User Data in JWT';
                }
                else
                    throw 'Malformed User Data in JWT';
            }
            catch (ex) {
                return ex;
            }
        }
        else
            return 'Invalid Authorization Header';
    }
    static GenerateWebToken(user) {
        let token = jsonwebtoken_1.default.sign({ UserData: user }, JWTAuth.SecretSalt, { subject: user.firstName });
        return token;
    }
}
exports.JWTAuth = JWTAuth;
JWTAuth.SecretSalt = '3B6EE5719030481808A3DF9193326C6ED8B4D3566818DB551C73226B1736292A';
//# sourceMappingURL=jwt.util.js.map