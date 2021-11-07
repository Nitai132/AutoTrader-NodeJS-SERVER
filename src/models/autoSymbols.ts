import {Document, model, Schema} from "mongoose";


const AutoSymbolsSchema = new Schema({ //סכמה משתמש
    Symbol: String,
    exchange: String,
    option_on_contract: Boolean,
    options: Boolean,
    contract: Boolean,
    stocks: Boolean,
    price: Number,
}, { collection: "AutoSymbols"} );

export interface AutoSymbolsDocument extends Document {
    Symbol?: string,
    exchange?: string,
    option_on_contract?: boolean,
    options?: boolean,
    contract?: boolean,
    stocks?: boolean,
    price?: number,


}

const AutoSymbols = model<AutoSymbolsDocument>("AutoSymbols", AutoSymbolsSchema);
export default AutoSymbols;