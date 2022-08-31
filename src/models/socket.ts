import { Schema, model, Document } from "mongoose";

const SocketSchema = new Schema<SocketDocument>({
    createTime: { type: Date, default: Date.now },

    id: {
        type: String,
        unique: true,
        index: true,
    },
    user: {
        type: String,
        index: true,
        unique: true,
    }
});

export interface SocketDocument extends Document {
    id: string;
    user: any;
    createTime: Date;
}

const Socket = model<SocketDocument>("Socket", SocketSchema);

export default Socket;
