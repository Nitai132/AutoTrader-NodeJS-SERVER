import {Document, model, Schema} from "mongoose";

const AutoUsersSymbolsSchema = new Schema({ 
    _id: String,
    symbols: Array,
    email: String
}, { collection: "AutoUsersSymbols"} );

export interface AutoUsersSymbolsDocument extends Document {
    _id?: any,
    symbols?: any,
    email?: any,
    Symbol: any
}

const AutoSymbols = model<AutoUsersSymbolsDocument>("AutoUsersSymbols", AutoUsersSymbolsSchema);
export default AutoSymbols;