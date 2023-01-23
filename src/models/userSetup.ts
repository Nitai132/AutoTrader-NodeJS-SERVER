import {Schema, model, Document} from "mongoose";

const UserSetupSchema = new Schema<UserSetupDocument>({
    userID: String,
    userEmail: String,
    riskActive: Boolean,
    stocks: Object,
    bonds: Object,
    comodity: Object,
    currencyPairs: Object,
    crypto: Object,
    indexes: Object,
    tradingStatus: Boolean,
    accountsOnRisk: Object
}, {collection: "AutoUsersSetup"});

export interface UserSetupDocument extends Document {
    userID: string,
    userEmail: string,
    riskActive: boolean,
    stocks: any,
    bonds: any,
    comodity: any,
    currencyPairs: any,
    crypto: any
    indexes: any,
    tradingStatus: any,
    accountsOnRisk: any
}

const UserSetup = model<UserSetupDocument>("AutoUsersSetup", UserSetupSchema);

export default UserSetup;