import { Server, Socket } from "socket.io";
import SocketModel, { SocketDocument } from "../models/socket";
import UserInfoModel, { UserInfoDocument } from "../models/usersInfo";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import UserPositionsIB, { usersPositionsIBDocument } from "../models/usersPositionsIB.model";
import Shop, { shopDocument } from "../models/shop.model";
import User from "../models/users";
import AutoUsersPositions, { AutoUsersPositionsDocument } from "../models/AutoUsersPositions";
import nodemailer from 'nodemailer';
import { userInfo } from "os";

const addListenersToSocketAndUpdateTables = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void => {


    const sendClosePositionMail = async (email: any) => {
        try {

            var transporter = nodemailer.createTransport({
                host: 'box2539.bluehost.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'ib.donotreply@tradingandcoffeeapplication.com',
                    pass: 'JOVANYFOREVEr34189696#@#'
                },
                tls: { rejectUnauthorized: false }
            });
            var mailOptions = {
                from: 'support.ib@tradingandcoffeeapplication.com',
                to: email,
                subject: 'Trading & Coffee GateWay logged out.',
                html: `<h3>Your gateway has been dissconected from the server.</h3>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    //אירוע התחברות לקוח CONNECTION
    io.on("connection", async (socket: Socket) => {
        const user = String(socket.handshake.headers.username);
        if (socket.handshake.headers.username) {
            const filter = { user: user };
            console.log("gateway user connected", socket.id);
            const userDetails = { email: String(socket.handshake.headers.username), password: String(socket.handshake.headers.passcode) };
            const auth = await User.findOne(userDetails)
            if (auth) {
                console.log('authenticated')
                socket.emit("authenticated", {
                    user: socket.handshake.headers.username,
                    isAuthenticated: true
                })
                await SocketModel.findOneAndUpdate(filter, {
                    id: socket.id,
                    user: user
                } as SocketDocument, {
                    useFindAndModify: false,
                    upsert: true
                });
                const userInfoFilter = { _id: user };
                await UserInfoModel.findOneAndUpdate(userInfoFilter, {
                    gatewayStatus: true,
                    userType: socket.handshake.headers.accountType
                } as UserInfoDocument, {
                    useFindAndModify: false
                });

            }
            else {
                socket.emit("authenticated", {
                    user: socket.handshake.headers.username,
                    isAuthenticated: false

                })
            }
        }

        else if (socket.handshake.query.email) {
            console.log("web user connected", socket.id, socket.handshake.query.email);
            const filter = { user: socket.handshake.query.email }
            await SocketModel.findOneAndUpdate(filter, {
                webId: socket.id,
                user: filter.user,
            } as SocketDocument, {
                useFindAndModify: false,
                upsert: true
            });
        }
        socket.on("onPositionClose", async (arg: any) => {
            console.log("POSITION CLOSED", arg.IB_ID);
            const d = new Date();
            let time = d.getTime();
            if (arg.user == "tradingandcoffeeapplication@gmail.com") {
                await Shop.findOneAndUpdate({ IB_ID: arg.IB_ID }, {
                    mongoID: arg.mongoID,
                    user: arg.user,
                    IB_ID: arg.IB_ID,
                    exchange: arg.exchange,
                    operation: arg.operation,
                    positionType: arg.positionType,
                    symbol: arg.symbol,
                    technologies: arg.technologies,
                    margin: arg.margin,
                    startDate: arg.startDate,
                    endDate: arg.endDate,
                    startPrice: arg.startPrice,
                    endPrice: arg.endPrice,
                    succeeded: arg.succeeded,
                    pipsed: arg.pipsed,
                    quantity: arg.quantity,
                    currentAccountBalance: arg.currentAccountBalance,
                    stopLoss: arg.stopLoss,
                    takeProfit: arg.takeProfit,
                    stoplossUsed: arg.stoplossUsed,
                    totalBrokerFee: arg.totalBrokerFee,
                    insertTime: time,
                    active: false,
                });
                await UserPositionsIB.findOneAndUpdate({ IB_ID: arg.IB_ID }, {
                    mongoID: arg.mongoID,
                    user: arg.user,
                    IB_ID: arg.IB_ID,
                    exchange: arg.exchange,
                    operation: arg.operation,
                    positionType: arg.positionType,
                    symbol: arg.symbol,
                    technologies: arg.technologies,
                    margin: arg.margin,
                    startDate: arg.startDate,
                    endDate: arg.endDate,
                    startPrice: arg.startPrice,
                    endPrice: arg.endPrice,
                    succeeded: arg.succeeded,
                    pipsed: arg.pipsed,
                    quantity: arg.quantity,
                    currentAccountBalance: arg.currentAccountBalance,
                    stopLoss: arg.stopLoss,
                    takeProfit: arg.takeProfit,
                    stoplossUsed: arg.stoplossUsed,
                    totalBrokerFee: arg.totalBrokerFee,
                    insertTime: time,
                    active: false,
                });
            } else {
                await UserPositionsIB.findOneAndUpdate({ IB_ID: arg.IB_ID }, {
                    mongoID: arg.mongoID,
                    user: arg.user,
                    IB_ID: arg.IB_ID,
                    exchange: arg.exchange,
                    operation: arg.operation,
                    positionType: arg.positionType,
                    symbol: arg.symbol,
                    technologies: arg.technologies,
                    margin: arg.margin,
                    startDate: arg.startDate,
                    endDate: arg.endDate,
                    startPrice: arg.startPrice,
                    endPrice: arg.endPrice,
                    succeeded: arg.succeeded,
                    pipsed: arg.pipsed,
                    quantity: arg.quantity,
                    currentAccountBalance: arg.currentAccountBalance,
                    stopLoss: arg.stopLoss,
                    takeProfit: arg.takeProfit,
                    stoplossUsed: arg.stoplossUsed,
                    totalBrokerFee: arg.totalBrokerFee,
                    insertTime: time,
                    active: false,
                });
            }
            await UserInfoModel.findOneAndUpdate({ _id: arg.user }, {
                currentBalance: arg.currentAccountBalance,
            } as UserInfoDocument, {
                useFindAndModify: false,
                upsert: true
            })
            let updateKey = `${arg.positionType}.id`
            let updateString = `${arg.positionType}.$.active`
            let updateDoc = {
                $set: { [updateString]: false }
            };
            await AutoUsersPositions.updateOne({ user: arg.user, [updateKey]: arg.mongoID }, updateDoc);

            if (arg.stoplossUsed) {
                //need to email user here about stoploss being used on a position
            }
        });

        socket.on("onPositionOpen", async (arg) => {
            if (arg.user == "tradingandcoffeeapplication@gmail.com") {
                const shopPosition = new Shop(arg);
                await shopPosition.save();
                const userPositionsIB = new UserPositionsIB(arg);
                await userPositionsIB.save();

            } else {
                const userPositionsIB = new UserPositionsIB(arg);
                await userPositionsIB.save();
            }
            let updateString = `${arg.positionType.toLowerCase()}.tradesAmount.${arg.operation.toLowerCase()}`
            let updateDoc = {
                $inc: {
                    [updateString]: 1
                }
            };
            await UserInfoModel.updateOne({ _id: arg.user }, updateDoc);
            console.log(arg, updateString);
        })

        socket.on("onPositionOpenFailure", (arg) => {
            console.log(arg);
        });

        socket.on("onPositionCloseFailure", async (arg) => {
            const User = await SocketModel.findOne({ id: socket.id });
            socket.to(User.webId).emit("PositionCloseFailed", arg);
            console.log(arg);
        });

        socket.on("onCloseAllPositionFailure", async (arg) => {
            const User = await SocketModel.findOne({ id: socket.id });
            socket.to(User.webId).emit("CloseAllPositionFailed", arg);
            console.log(arg);
        });

        socket.on("onExtractPositionsDetails", async (positions) => {
            const User = await SocketModel.findOne({ id: socket.id });
            console.log(positions, 'recieved positions', User);

            socket.to(User.webId).emit("SendUserPositions", positions);
        });

        socket.on("statusTWS", async (arg) => {
            console.log(arg);
            await UserInfoModel.findOneAndUpdate({ _id: arg.user }, {
                twsStatus: arg.isTWSConnected
            } as UserInfoDocument, {
                useFindAndModify: false
            });
        });

        //אירוע התנתקות לקוח
        socket.on("disconnect", async () => {
            console.log('user Dissconnected');
            const User = await SocketModel.findOne({ id: socket.id });
            if (User) {
                sendClosePositionMail(User.user);
            }
            const userInfoFilter = { _id: user };
            // await SocketModel.deleteOne({
            //     id: socket.id
            // });
            await UserInfoModel.findOneAndUpdate(userInfoFilter, {
                gatewayStatus: false
            } as UserInfoDocument, {
                useFindAndModify: false
            });
            await UserInfoModel.findOneAndUpdate(userInfoFilter, {
                twsStatus: false
            } as UserInfoDocument, {
                useFindAndModify: false
            });
        });
    });
};


export default { addListenersToSocketAndUpdateTables };
