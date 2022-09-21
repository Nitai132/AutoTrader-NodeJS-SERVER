const express = require("express");
const router = express.Router();

import {authUser} from "../services/authService";


router.post("/auth", async (req : any, res : any) => {
    try {
        const { userName, password } = req.body; // מקבל את האיידי של הפוזיציה שיצאה פולס מהשרת השני
        const userDetails : any = authUser(userName, password);
        return res.json(userDetails); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});


export = router;