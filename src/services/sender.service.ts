import { iexStocksDocument } from "../models/iexStocks";
import SocketModel, { SocketDocument } from "../models/socket";
import { AutoPositions } from "../models/AutoPositions";
import AutoUsersSymbols from '../models/AutoUsersSymbols';
import AutoUsersPositions from "../models/AutoUsersPositions";

const sendPositionToUser = async (position: any, userSetup: any, quantities: any, type: any) => {
    console.log(userSetup.userEmail, type);
    const filter = { user: userSetup.userEmail };
    const socket = await SocketModel.findOne(filter);
    const symbolFilter = { Symbol: position.symbol.replace("#", "") };
    const userSymbols = await AutoUsersSymbols.find({ email: userSetup.userEmail }).select({ 'symbols': 1, "_id": 0 });
    let UserHaveSymbol: any = false;
    userSymbols[0].symbols.map((symbol: any) => {
        if (symbol.Symbol === symbolFilter.Symbol) {
            UserHaveSymbol = true
        }
    })
    if (UserHaveSymbol) {
        console.log('symbol exists');
        // console.log({
        //     user: userSetup.userEmail,
        //     action: position.operation.toUpperCase(),
        //     symbol: position.symbol.replace("#", ""),
        //     technologies: userSetup.stocks.financialTechnology,
        //     quantities: quantities,
        //     startPrice: position.startPrice,
        //     stopLoss: userSetup.stocks.stopLoss.useSystemStopLoss ? position.sp.currentStopPrice : userSetup.stocks.stopLoss.userStopLoss,
        //     riskManagment: userSetup.stocks.riskManagment,
        //     takeProfit: {
        //         useTakeProfit: userSetup.stocks.takeProfit.useTakeProfit, 
        //         takeProfit: userSetup.stocks.takeProfit.systemTakeProfit ? position.tp : userSetup.stocks.takeProfit.userTakeProfit
        //     },
        //     doubleTheTrade: userSetup.doubleTheTradeValues,
        //     exchange: autoSymbol.exchange
        // })



        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // await global.io.to(socket.id).emit("message", {
        //     action: position.operation.toUpperCase(),
        //     symbol: position.symbol.replace("#", ""),
        //     quantity: 100,
        //     limitPrice: position.startPrice,
        //     stopLossLimitPrice: position.startPrice - 1,
        //     takeProfitLimitPrice: position.startPrice + 2,
        //     exchange: autoSymbol.exchange
        // } as AutoPositions)

        await AutoUsersPositions.updateOne(
            { user: userSetup.userEmail },
        // @ts-expect-error
            { $push: { [type]: { id: position._id, active: true, createdAt: Date.now() } } }
        )
    }
};

export default { sendPositionToUser };