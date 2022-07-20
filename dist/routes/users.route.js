"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let authRoute = express_1.default.Router();
exports.authRoute = authRoute;
const users = [];
//GET all users 
authRoute.get('/', (req, res, next) => {
    try {
        const safeUsers = [];
        for (let i = 0; i < users.length; i++) {
            const { password, ...safeObj } = users[i];
            safeUsers.push(safeObj);
        }
    }
    catch (ex) {
        res.status(401).send({ status: 401, message: `Unauthorized - Access token is missing or invalid` });
    }
});
//# sourceMappingURL=users.route.js.map