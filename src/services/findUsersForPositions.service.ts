import {iexStocksDocument} from "../models/iexStocks";
import UserInfo, {UserInfoDocument} from "../models/usersInfo";
import UserSetup from "../models/userSetup";
import AutoUsersPositions from "../models/AutoUsersPositions";
import Sender from "./sender.service";

// חיפוש משתמשים מחוברים ופעילים עבור אופציות של מניות
export const findUsersForStockPosition = async (position: iexStocksDocument) : Promise<void> => {
    if (position.operation == "buy") {
        const activeUsers = await UserInfo.find({gatewayStatus: true}, "_id");
        activeUsers.forEach(async (user: UserInfoDocument) => {
            const userSetup = await UserSetup.findOne({userEmail: user._id},"stocks");
            if (userSetup.stocks.activeAccount && userSetup.stocks.buyPositions && userSetup.tradingStatus) {
                const positions = await AutoUsersPositions.findOne({user: user._id},"stocks");
                if (positions.stocks == null || positions.stocks?.length < userSetup.stocks.tradesPerDay) {
                    Sender.sendPositionToUser(position,user._id,100);
                }
            }
        });
    } else if (position.operation == "sell") {

    }
};

export default {findUsersForStockPosition};