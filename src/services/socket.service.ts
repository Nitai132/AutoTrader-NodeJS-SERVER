import {Server, Socket} from "socket.io";
import SocketModel, {SocketDocument} from "../models/socket";
import UserInfoModel, {UserInfoDocument} from "../models/usersInfo";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

const addListenersToSocketAndUpdateTables = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) : void => {
    //אירוע התחברות לקוח
    io.on("connection", async (socket: Socket) => {
        const user = socket.handshake.auth?.user;
        const filter = {user: user};
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
