import { iexStocksDocument } from "../models/iexStocks";
import SocketModel, { SocketDocument } from "../models/socket";
import { AutoPositions } from "../models/AutoPositions";
import AutoUsersSymbols from "../models/AutoUsersSymbols";
import AutoUsersPositions from "../models/AutoUsersPositions";

const sendPositionToUser = async (position: any, userSetup: any, quantities: any, type: any) => {
    console.log(userSetup.userEmail, type, position, quantities);
    const filter = { user: userSetup.userEmail };
    const socket = await SocketModel.findOne(filter);
    console.log(socket);
    const symbolFilter = { Symbol: position.symbol.replace("#", "") };
    const userSymbols = await AutoUsersSymbols.find({ email: userSetup.userEmail }).select({ "symbols": 1, "_id": 0 });
    let UserHaveSymbol: any = true;
    userSymbols[0].symbols.map((symbol: any) => {
        if (symbol.Symbol === symbolFilter.Symbol) {
            UserHaveSymbol = true;
        }
    });
    if (UserHaveSymbol) {
        console.log({
            user: userSetup.userEmail,
            _id: position._id,
            positionType: type,
            operation: position.operation.toUpperCase(),
            symbol: position.symbol.replace("#", ""),
            technologies: userSetup[type].financialTechnology,
            quantities: quantities,
            takeProfit: {
                useTakeProfit: userSetup[type].takeProfit.useTakeProfit,
                takeProfit: userSetup[type].takeProfit.takeProfitPercentage
            },
        });


        //@ts-ignore
        await global.io.to(socket.id).emit("openPosition", {
            user: userSetup.userEmail,
            _id: position._id,
            exchange: 'SMART',
            margin: userSetup[type].riskManagment.margin,
            positionType: type,
            operation: position.operation.toUpperCase(),
            symbol: position.symbol.replace("#", ""),
            technologies: userSetup[type].financialTechnology,
            quantities: quantities,
            takeProfit: {
                useTakeProfit: userSetup[type].takeProfit.useTakeProfit,
                takeProfit: userSetup[type].takeProfit.takeProfitPercentage
            },
        } as AutoPositions);

        await AutoUsersPositions.updateOne(
            { user: userSetup.userEmail },
            // @ts-expect-error
            { $push: { [type]: { id: position._id, active: true, createdAt: Date.now() } } }
        );
    }
};



export default { sendPositionToUser };