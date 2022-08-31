import {Schema, model, Document} from "mongoose";

const UserSetupSchema = new Schema<UserSetupDocument>({
    userID: String,
    userEmail: String,
    activeTrading: Boolean,
    stocks: Object,
    bonds: Object,
    comodity: Object,
    currencyPairs: Object,
    crypto: Object,
    indexes: Object,
    doubleTheTradeValues: Object,
    tradingStatus: Boolean
}, {collection: "AutoUsersSetup"});

export interface UserSetupDocument extends Document {
    userID: string,
    userEmail: string,
    activeTrading: boolean,
    stocks: any,
    bonds: any,
    comodity: any,
    currencyPairs: any,
    crypto: any
    indexes: any,
    doubleTheTradeValues: any,
    tradingStatus: any
}

const UserSetup = model<UserSetupDocument>("AutoUsersSetup", UserSetupSchema);

export default UserSetup;