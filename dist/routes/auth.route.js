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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const user_route_1 = require("../routes/user.route");
dotenv.config();
const secret = 'C743BDE82646FD4CF7C43DBCE89CF';
let authRoute = express_1.default.Router();
exports.authRoute = authRoute;
authRoute.get('/', (req, res) => {
    // res.send('Auth Route!!')
    res.status(200).send(user_route_1.users);
});
//GET a JSON Web Token for auth
authRoute.get('/:userId/:password', (req, res, next) => {
    let user = user_route_1.users.find(u => (u.userId === req.params.userId));
    console.log(user.password);
    console.log(req.params.password);
    if (user) {
        bcrypt_1.default.compare(req.params.password, user.password, function (err, result) {
            if (result == true) {
                let token = jsonwebtoken_1.default.sign({ userId: user.userId, Name: user.name }, "C743BDE82646FD4CF7C43DBCE89CF");
                res.cookie('authToken', token);
                res.status(200).send({ token: token });
            }
            else {
                res.status(401).send({ status: 401, message: `Wrong username or password` });
            }
        });
    }
    else {
        res.status(401).send({ status: 401, message: `Wrong username or password` });
    }
});
//# sourceMappingURL=auth.route.js.map