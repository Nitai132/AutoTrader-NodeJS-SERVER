import Stocks from "../models/iexStocks";
import FindUsers from "./findUsersForPositions.service";
// הוספת האזנה לסטוקס עבור פוזיציות חדשות ועבור שינוי בפוזיציות קיימות
export const listenToStockPositions = () => {
    console.log("start listen to stocks");
    addWatchForCreate();
    addWatchForUpdate();
};

//הוספת האזנה לפוזיציה חדשה
const addWatchForCreate = () => {
    Stocks.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
        console.log("Insert action triggered");
        console.log(new Date(), data.fullDocument);
        FindUsers.findUsersForStockPosition(data.fullDocument);
    });
};

//הוספת האזנה לעדכון פוזיציה
const addWatchForUpdate = ()=> {
    Stocks.watch([{$match: {operationType: {$in: ["update"]}}}]).on("change", async (data: any) => {
        console.log(new Date(), "Update action triggered on stocks");
        console.log(new Date(), data.updateDescription.updatedFields);
        try {
            const position = await Stocks.findById(data.documentKey._id);
            console.log(new Date(), position);
        } catch (e) {
            console.error(new Date(), e);
        }
    });
};

export default {listenToStockPositions};
