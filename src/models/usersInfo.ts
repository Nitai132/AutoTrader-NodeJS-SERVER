import {Document, model, Schema} from "mongoose";

const userSetupSchema = new Schema({
    _id: String,
    userType: String,
    gatewayStatus: Boolean,
    twsStatus: Boolean,
    stocks: Object,
    bonds: Object,
    comodity: Object,
    currencyPairs: Object,
    indexes: Object,
    investedBalance: Number,
    currentBalance: Number,
    tradesAmount: Object,
    startOfTheDayBalance: Number
}, {collection: "AutoUsersInfo"});

export interface UserInfoDocument extends Document {
    _id: string,
    userType?: string,
    gatewayStatus?: boolean,
    twsStatus?: boolean
    stocks?: any,
    bonds?: any,
    comodity?: any,
    currencyPairs?: any,
    indexes?: any,
    investedBalance?: number,
    currentBalance?: number,
    tradesAmount?: any,
    startOfTheDayBalance: any
}

const UserInfo = model<UserInfoDocument>("AutoUsersInfo", userSetupSchema);

export default UserInfo;