import { iexStocksDocument } from "../models/iexStocks";
import SocketModel, { SocketDocument } from "../models/socket";
import { AutoPositions } from "../models/AutoPositions";
import AutoSymbols from "../models/autoSymbols";
import AutoUsersSymbols from '../models/AutoUsersSymbols';
import AutoUsersPositions from "../models/AutoUsersPositions";

const sendPositionToUser = async (position: any, userEmail: string, quantity: number) => {

    const filter = { user: userEmail };
    const socket = await SocketModel.findOne(filter);
    const symbolFilter = { Symbol: position.symbol.replace("#", "") };
    const autoSymbol = await AutoSymbols.findOne(symbolFilter);
    const userSymbols = await AutoUsersSymbols.find({ email: userEmail }).select({ 'symbols': 1, "_id": 0 });
    let UserHaveSymbol: any;
    const symbolsMapping = userSymbols[0].symbols.map((symbol: any) => {
        if (symbol.Symbol === symbolFilter.Symbol) {
            UserHaveSymbol = symbol
        }
    })

    console.log(new Date(), " try to send position to: ", userEmail);
    if (UserHaveSymbol) {
        console.log('success')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.io.to(socket.id).emit("message", {
            action: position.operation.toUpperCase(),
            symbol: position.symbol.replace("#", ""),
            quantity: quantity,
            limitPrice: position.startPrice,
            stopLossLimitPrice: position.startPrice - 1,
            takeProfitLimitPrice: position.startPrice + 2,
            exchange: autoSymbol.exchange
        } as AutoPositions).then(async () => {
            await AutoUsersPositions.updateOne(
                { user: userEmail },
                { $push: { stocks: { id: autoSymbol._id, active: true } } }
            )
        });
    }
};


export default { sendPositionToUser };