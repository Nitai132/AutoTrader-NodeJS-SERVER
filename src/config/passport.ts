import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userSchema = require("../models/users");

const User = mongoose.model("User", userSchema); //שימוש בסכמה ומודל

module.exports = {
    localStrategyHandler: async (email: string, password: string, done: any) => { //לוקאל סטרטג'י
        const user = await User.findOne({ email, password }); //מחפש את המשתמש בדאטא בייס
        if (!user) {
            return done(null, false); // במידה והמשתמש לא נמצא
        }
        return done(null, user); //במידה והמשתמש נמצא
    },
    serializeUser: (user: any, done: any) => { //סיריאליזצייה
        done(null, user);
    },
    deserializeUser: (user: any, done: any) => { //דיסיריאליזצייה
        done(null, user);
    },
    isValid: (req: any, res: any, next: any) => { //בדיקה שהמשתמש מחובר
        if (req.isAuthenticated()) { //אם המשתמש מחובר
            return next(); //המשך
        }
        return res.sendStatus(401); //שגיאה: אוטנטיקציה
    }
};