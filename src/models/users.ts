import { Schema, model, Document } from "mongoose";

const userSchema = new Schema({ //סכמה משתמש
    _id : String,
    firstName: String, //שם פרטי
    lastName: String, //שם משפחה
    phone: String, //טלפון
    email: String, //אימייל
    password: String, //סיסמא
    isAdmin: Number, //הרשאות
    credits: Number //קרדיטים
}, { collection: "users", timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export interface UserDocument extends Document {
    firstName?: string; //שם פרטי
    lastName?: string; //שם משפחה
    phone?: string; //טלפון
    email?: string; //אימייל
    password?: string; //סיסמא
    isAdmin?: number; //הרשאות
    credits?: number; //קרדיטים
}


const Users = model<UserDocument>("users", userSchema);

export default Users;