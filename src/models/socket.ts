import { Schema, model, Document } from "mongoose";

const SocketSchema = new Schema({
    createTime: { type: Date, default: Date.now },

    id: {
        type: String,
         unique:true, 
         sparse:true
    },
    user: {
        type: String,
        index: true,
        unique: true,
    },
    webId: {
        type: String,
        unique:true, 
        sparse:true
    }
});

export interface SocketDocument extends Document {
    id: string;
    user: any;
    webId: string;
    createTime: Date;
}
const SocketModel = model<SocketDocument>("sockets", SocketSchema);

export default SocketModel;
