const express = require("express");
const router = express.Router();

import {closeSpecificPosition, closeAllPositions, extractPositionsDetails, getActivePositions, closePosition} from "../services/positionsAPIService";

router.post("/closeSpecificPosition", async (req : any, res : any) => {
    try {
        const { user, IB_ID } = req.body; // מקבל את האיידי של הפוזיציה שיצאה פולס מהשרת השני
        const CloseSpecificPosition : any = await closeSpecificPosition(user, IB_ID); // מוצא את כל היוזרים שיש להם את הפוזיציה שהיא לא נכונה
        return res.json(CloseSpecificPosition); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});

router.post("/closeAllPositions", async (req : any, res : any) => {
    try {
        const { user } = req.body; // מקבל את האיידי של הפוזיציה שיצאה פולס מהשרת השני
        const CloseAllPositions : any = await closeAllPositions(user); // מוצא את כל היוזרים שיש להם את הפוזיציה שהיא לא נכונה
        return res.json(CloseAllPositions); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});

router.post("/extractPositionsDetails", async (req : any, res : any) => {
    try {
        const { user } = req.body; // מקבל את האיידי של הפוזיציה שיצאה פולס מהשרת השני
        const ExtractPositionsDetails : any = await extractPositionsDetails(user); // מוצא את כל היוזרים שיש להם את הפוזיציה שהיא לא נכונה
        return res.json(ExtractPositionsDetails); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});

router.get("/activePositions/:user", async (req : any, res : any) => {
    try {
        const { user } = req.params; 
        const activePositions : any = await getActivePositions(user);
        return res.json(activePositions); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});

router.post("/closePosition", async (req : any, res : any) => {
    try {
        const { user, IB_ID } = req.body; 
        const activePositions : any = await closePosition(user, IB_ID); 
        return res.json(activePositions); //במקרה של הצלחה
    } catch (err) {
        console.log(err); // במקרה של כשלון
        res.sendStatus(400);
    }
});


export = router;