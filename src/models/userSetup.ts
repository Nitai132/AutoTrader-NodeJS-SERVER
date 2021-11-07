import {Schema, model, Document} from "mongoose";

const UserSetupSchema = new Schema({
    userID: String,
    userEmail: {type: String, unique: true},
    activeTrading: Boolean,
    stocks: Object,
    bonds: Object,
    comodity: Object,
    currencyPairs: Object,
    indexes: Object,
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
    indexes: any,
    tradingStatus: boolean
}

const UserSetup = model<UserSetupDocument>("AutoUsersSetup", UserSetupSchema);

export default UserSetup;