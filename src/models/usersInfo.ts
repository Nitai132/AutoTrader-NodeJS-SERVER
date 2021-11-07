import {Document, model, Schema} from "mongoose";

const userSetupSchema = new Schema({
    _id: String,
    userType: String,
    gatewayStatus: Boolean,
    stocks: Object,
    bonds: Object,
    comodity: Object,
    currencyPairs: Object,
    indexes: Object,
}, {collection: "AutoUsersInfo"});

export interface UserInfoDocument extends Document {
    _id: string,
    userType?: string,
    gatewayStatus?: boolean,
    stocks?: any,
    bonds?: any,
    comodity?: any,
    currencyPairs?: any,
    indexes?: any
}

const UserInfo = model<UserInfoDocument>("AutoUsersInfo", userSetupSchema);

export default UserInfo;