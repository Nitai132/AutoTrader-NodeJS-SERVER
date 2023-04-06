import { model, Schema, Document } from "mongoose";


const shopSchema = new Schema({
    user: String,
    mongoID: String,
    IB_ID: String,
    exchange: String,
    operation: String,
    positionType: String,
    symbol: String,
    technologies: String,
    margin: Number,
    startDate: String,
    endDate: String,
    startPrice: Number,
    endPrice: Number,
    succeeded: Boolean,
    pipsed: Number,
    quantity: Number,
    currentAccountBalance: Number,
    stopLoss: Object,
    takeProfit: Array,
    stoplossUsed: Boolean,
    totalBrokerFee: Number,
    insertTime: Number,
    active: Boolean
}, { collection: "usersPositionsIB" });

export interface shopDocument extends Document {
    user?: string,
    mongoID?: string,
    IB_ID?: string,
    exchange?: string,
    operation?: string,
    positionType?: string,
    symbol?: string,
    technologies?: string,
    margin?: number,
    startDate?: string,
    endDate?: string,
    startPrice?: number,
    endPrice?: number,
    succeeded?: boolean,
    pipsed?: number,
    quantity?: number,
    currentAccountBalance?: number,
    stopLoss?: object,
    takeProfit?: string,
    stoplossUsed?: boolean,
    totalBrokerFee?: number,
    insertTime?: number,
    active?: boolean
}

const shop = model<shopDocument>("shop", shopSchema);

export default shop;