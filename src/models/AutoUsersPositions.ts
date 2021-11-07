import {Document, model, Schema} from "mongoose";


const AutoUsersPositionSchema = new Schema({ //סכמה משתמש
    user: String, 
    userID: String,
    stocks: Array,
    bonds: Array, 
    comodity: Array, 
    currencyPairs: Array, 
    indexes: Array, 
}, { collection: "AutoUsersPositions"} );

export interface AutoUsersPositionsDocument extends Document {
    user?: string,
    userID?: string,
    stocks?: [id: any, active: any],
    bonds?: [],
    comodity?: [],
    currencyPairs?: [],
    indexes?: [],
}

const AutoUsersPositions = model<AutoUsersPositionsDocument>("AutoUsersPositions", AutoUsersPositionSchema);
export default AutoUsersPositions;