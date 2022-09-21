import { model, Schema, Document } from "mongoose";


const usersPositionsIBSchema = new Schema({
    user: String,
    exchange: String,
    operation: String,
    positionType: String,
    symbol: String,
    startDate: String,
    endDate: String,
    startPrice: Number,
    endPrice: Number,
    succeeded: Boolean,
    pipsed: Number,
    quantity: Number,
    currentAccountBalance: Number,
    stopLoss: Number,
    takeProfit: Array,
    stoplossUsed: Boolean,
    totalBrokerFee: Number
}, { collection: "usersPositionsIB" });

export interface usersPositionsIBDocument extends Document {
    user?: string,
    exchange?: string,
    operation?: string,
    positionType?: string,
    symbol?: string,
    startDate?: string,
    endDate?: string,
    startPrice?: number,
    endPrice?: number,
    succeeded?: boolean,
    pipsed?: number,
    quantity?: number,
    currentAccountBalance?: number,
    stopLoss?: number,
    takeProfit?: string,
    stoplossUsed?: boolean,
    totalBrokerFee?: number,
}

const usersPositionsIB = model<usersPositionsIBDocument>("usersPositionsIB", usersPositionsIBSchema);

export default usersPositionsIB;