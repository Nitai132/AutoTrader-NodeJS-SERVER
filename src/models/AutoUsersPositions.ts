import {Document, model, Schema, Types } from "mongoose";

export interface optionsArray extends Document{
    id: any, 
    active: Boolean, 
    createdAt: Number
}


export interface AutoUsersPositionsDocument extends Document {
    user?: string,
    userID?: string,
    stocks?: [optionsArray],
    bonds?: [optionsArray],
    comodity?: [optionsArray],
    currencyPairs?: [optionsArray],
    indexes?: [optionsArray],
    [key: string]: any

}

const AutoUsersPositionSchema = new Schema({ //סכמה משתמש
    user: String, 
    userID: String,
    stocks:  [Schema.Types.Mixed],
    bonds: [Schema.Types.Mixed],
    comodity: [Schema.Types.Mixed],
    currencyPairs: [Schema.Types.Mixed],
    indexes: [Schema.Types.Mixed],
}, { collection: "AutoUsersPositions"} );

const AutoUsersPositions = model<AutoUsersPositionsDocument>("AutoUsersPositions", AutoUsersPositionSchema);
export default AutoUsersPositions;