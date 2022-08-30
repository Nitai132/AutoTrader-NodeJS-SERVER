import { model, Schema, Document } from "mongoose";


const usersPositionsIBSchema = new Schema({
    user: { type: String },
    exchange: { type: String },
    operation: { type: String },
    positionType: { type: String },
    symbol: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    startPrice: { type: Number },
    endPrice: { type: Number },
    succeeded: { type: Boolean },
    pipsed: { type: Number },
    quantity: { type: Number },
    currentAccountBalance: { type: Number },
    stopLoss: { type: Number },
    takeProfit: { type: Array },
    stoplossUsed: { type: Boolean },
    totalBrokerFee: { type: Number }

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
    takeProfit?: any,
    stoplossUsed?: boolean,
    totalBrokerFee?: number,
}

const usersPositionsIB = model<usersPositionsIBDocument>("usersPositionsIB", usersPositionsIBSchema);

export default usersPositionsIB;