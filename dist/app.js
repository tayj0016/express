"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = require("./routes/user.route");
const app = express_1.default();
// CORS 
app.use(cors_1.default({ credentials: true, origin: true }));
// app.options('*', cors({credentials: true, origin: true}));
app.use(cors_1.default({
    credentials: true,
    origin: '*'
}));
// DATABASE
// dotenv.config();
// export const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME
// });
app.use(express_1.default.json()); //New Body Parser
app.use(express_1.default.urlencoded({ extended: false })); // Also parse HTML Forms
app.use(cookie_parser_1.default()); //Cookie parser
app.use('/users', user_route_1.userRoute);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000);
//# sourceMappingURL=app.js.map