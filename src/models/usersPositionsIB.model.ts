import { model, Schema, Document } from "mongoose";


const usersPositionsIBSchema = new Schema({
    user: String,
    mongoID : String,
    IB_ID: String,
    exchange: String,
    operation: String,
    positionType: String,
    symbol: String,
    technologies : String,
    margin : Number,
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
    totalBrokerFee: Number,
    active : Boolean
}, { collection: "usersPositionsIB" });

export interface usersPositionsIBDocument extends Document {
    user?: string,
    mongoID? : string,
    IB_ID?: string,
    exchange?: string,
    operation?: string,
    positionType?: string,
    symbol?: string,
    technologies? : string,
    margin? : number,
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
    active? : boolean
}

const usersPositionsIB = model<usersPositionsIBDocument>("usersPositionsIB", usersPositionsIBSchema);

export default usersPositionsIB;