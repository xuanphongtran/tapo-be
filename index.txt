"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const Account_1 = __importDefault(require("./routes/Account"));
const Group_1 = __importDefault(require("./routes/Group"));
const DMChat_1 = __importDefault(require("./routes/DMChat"));
const GroupChat_1 = __importDefault(require("./routes/GroupChat"));
const Image_1 = __importDefault(require("./routes/Image"));
const socket_io_1 = require("socket.io");
const DMChat_2 = require("./controller/DMChat");
const GroupChat_2 = require("./controller/GroupChat");
const PORT = 3000;
const CLUSTERNAME = "cluster0";
const PASSWORD = "6vVdndp9h5vXUwp1";
const DBNAME = "RealTimeChat";
//App set up
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://siri-real-time-chat.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.static(__dirname + "/public"));
app.use(express_1.default.json());
var port = PORT || 3000;
var server = app.listen(port, () => {
    console.log("Server is running");
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://siri-real-time-chat.netlify.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
});
io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`);
    socket.on("on-chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.type === "dm") {
            const result = yield (0, DMChat_2.getChatDMDataAndReturn)(data);
            io.emit("user-chat", result);
        }
        else {
            const result = yield (0, GroupChat_2.getChatGroupDataAndReturn)(data);
            io.emit("user-chat", result);
        }
    }));
    socket.on("disconnect", () => {
        console.log(`bye ${socket.id}`);
    });
});
//Set up mongoose
const uri = `mongodb+srv://sa:${PASSWORD}@${CLUSTERNAME}.yuh6by2.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;
mongoose_1.default.connect(uri);
//Router
app.get("/", (req, res) => {
    res.send("This is Sirikakire calling app server api side, this server is running very well. Hope you are having a wonderful day");
});
app.use("/api/Account", Account_1.default);
app.use("/api/Group", Group_1.default);
app.use("/api/DMChat", DMChat_1.default);
app.use("/api/GroupChat", GroupChat_1.default);
app.use("/api/Image", Image_1.default);
