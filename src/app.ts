import express from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import {MONGODB_URI} from "./util/secrets";
import {Server} from "socket.io";
import {createServer} from "http";
import PositionsService from "./services/positions.service";
import SocketService from "./services/socket.service";
import Sender from "./services/sender.service";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = "mongodb+srv://jovany:Jj12345@cluster0.4mfvt.mongodb.net/TradingData";
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, {useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true }).then(
    () => {} 
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});


// הגדרות השרת
app.set("port", process.env.PORT || 3006);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Jovani123!$@#$",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl,
        mongoOptions: {
            autoReconnect: true
        },
    }),
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60 * 60000 * 24 * 7
    },
}));

// app.use(passport.initialize());
// app.use(passport.session());
app.use(flash());

app.use(
    express.static(path.join(__dirname, "public"), {maxAge: 31557600000})
);

//הגדרות socket.io
const httpServer = createServer(app);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.io = new Server(httpServer, {
});

// הוספת אירועים להתחברות והתנתקות לקוח
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SocketService.addListenersToSocketAndUpdateTables(global.io);

httpServer.listen(3007);
PositionsService.listenToStockPositions();
export default app;
