import {Server, Socket} from "socket.io";
import SocketModel, {SocketDocument} from "../models/socket";
import UserInfoModel, {UserInfoDocument} from "../models/usersInfo";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import UserPositionsIB, {usersPositionsIBDocument} from '../models/usersPositionsIB.model'

const addListenersToSocketAndUpdateTables = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) : void => {
    //אירוע התחברות לקוח
    io.on("connection", async (socket: Socket) => {

        const user = socket.handshake.auth?.user;
        const filter = {user: user};
        console.log('user connected', socket.id);
        await SocketModel.findOneAndUpdate(filter, {
            id: socket.id,
            user: user
        } as SocketDocument, {
            useFindAndModify: false,
            upsert: true
        });
        const userInfoFilter = {_id: user};
        await UserInfoModel.findOneAndUpdate(userInfoFilter, {
            gatewayStatus: true
        } as UserInfoDocument, {
            useFindAndModify: false
        });

        socket.on("onPositionClose", async (data) => {
            const userPositionsIB = new UserPositionsIB(data);
            await userPositionsIB.save()
        });


        socket.on("onPositionOpenFailure", (data) => {
            console.log(data)
        });

        socket.on("onPositionCloseFailure", async (data) => {
           const User = await SocketModel.findOne({user: data.user});
           socket.to(User.id).emit("PositionCloseFailure", data)
        });

        socket.on("onCloseAllPositionFailure",async (data) => {
            const User = await SocketModel.findOne({user: data.user});
            socket.to(User.id).emit("CloseAllPositionFailure", data)
        });

        socket.on("onExtractPositionsDetails",async (data) => {
            const User = await SocketModel.findOne({user: data.user});
            socket.to(User.id).emit("ExtractPositionsDetails", data)
        });
        
        //אירוע התנתקות לקוח
        socket.on("disconnect", async () => {
            await SocketModel.deleteOne({
                id: socket.id
            });
            await UserInfoModel.findOneAndUpdate(userInfoFilter, {
                gatewayStatus: false
            } as UserInfoDocument, {
                useFindAndModify: false
            });
        });       
    });
};


export default {addListenersToSocketAndUpdateTables};
