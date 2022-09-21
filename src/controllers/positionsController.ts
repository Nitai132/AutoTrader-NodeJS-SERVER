const express = require("express");
const router = express.Router();

import {closeSpecificPosition, closeAllPositions, extractPositionsDetails} from "../services/positionsAPIService";

router.post("/closeSpecificPosition", async (req : any, res : any) => {
    try {
        const { user, positionType, symbol } = req.body; // מקבל את האיידי של הפוזיציה שיצאה פולס מהשרת השני
        const CloseSpecificPosition : any = await closeSpecificPosition(user, positionType, symbol); // מוצא את כל היוזרים שיש להם את הפוזיציה שהיא לא נכונה
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


export = router;