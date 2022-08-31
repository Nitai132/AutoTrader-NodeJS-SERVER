import {model, Schema, Document} from "mongoose";


const liveRateBondSchema = new Schema({
    _id : { type: String},
    symbol: { type: String },
    close: { type: Number },
    operation: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    startPrice: { type: Number },
    endPrice: { type: Number },
    succeeded: { type: Boolean },
    pipsed: { type: Number },
    openPosId: { type: String },
    insertTime: { type: Number }
},{collection : "liveRateBonds"});

export interface liveRateBondsDocument extends Document {
    symbol?: string,
    close?: number,
    operation?: string,
    startDate?: string,
    endDate?: string,
    startPrice?: number,
    endPrice?: number,
    succeeded?: boolean,
    pipsed?: number,
    openPosId?: string,
    insertTime?: number
}

const liveRateBonds = model<liveRateBondsDocument>("liveRateBonds", liveRateBondSchema);

export default liveRateBonds;