import {Document, model, Schema, Types } from "mongoose";

export interface AutoPositions extends Document { 
    account: string;
    action: string;
    quantity: number;
    symbol: string;
    limitPrice: number;
    stopLossLimitPrice: number;
    takeProfitLimitPrice: number;
}

const AutoPositionsSchema = new Schema({ //סכמה משתמש
    account: String, 
    action: String,
    quantity:  Number,
    symbol: String,
    limitPrice: Number,
    stopLossLimitPrice: Number,
    takeProfitLimitPrice: Number,
}, { collection: "AutoUsersPositions"} );

const AutoUsersPositions = model<AutoPositions>("AutoUsersPositions", AutoPositionsSchema);
export default AutoUsersPositions;