import Stocks from "../models/iexStocks";
import Bonds from "../models/liveRateBonds.model";
import Comodity from "../models/liveRateComodity.model";
// import Pairs from "../models/liveRateBonds.model";
// import Crypto from "../models/liveRateBonds.model";
// import Indexes from "../models/liveRateBonds.model";

import FindUsers from "./findUsersForPositions.service";

// הוספת האזנה לסטוקס עבור פוזיציות חדשות ועבור שינוי בפוזיציות קיימות
export const listenToPositions = () => {
    console.log("start listen to positions");
    addWatchForCreateStocks();
    addWatchForCreateBonds();
    addWatchForCreateComodity();
    // addWatchForCreatePairs();
    // addWatchForCreateCrypto();
    // addWatchForCreateIndexes();
    addWatchForUpdateStocks();

};

//הוספת האזנה לפוזיציה חדשה מסוג סטוקס
const addWatchForCreateStocks = () => {
    Stocks.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
        console.log("Stocks Insert action triggered");
        console.log(new Date(), data.fullDocument);
        FindUsers.findUsersForStockPosition(data.fullDocument);
    });
};


const addWatchForCreateBonds = () => {
    Bonds.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
        console.log("Bonds Insert action triggered");
        console.log(new Date(), data.fullDocument);
        FindUsers.findUsersForBondsPosition(data.fullDocument);
    });
};

const addWatchForCreateComodity = () => {
    Comodity.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
        console.log("Comodity Insert action triggered");
        console.log(new Date(), data.fullDocument);
        FindUsers.findUsersForComodityPosition(data.fullDocument);
    });
};

// const addWatchForCreatePairs = () => {
//     Pairs.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
//         console.log("Pairs Insert action triggered");
//         console.log(new Date(), data.fullDocument);
//         FindUsers.findUsersForPairsPosition(data.fullDocument);
//     });
// };

// const addWatchForCreateCrypto = () => {
//     Crypto.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
//         console.log("Crypto Insert action triggered");
//         console.log(new Date(), data.fullDocument);
//         FindUsers.findUsersForCryptoPosition(data.fullDocument);
//     });
// };

// const addWatchForCreateIndexes = () => {
//     Indexes.watch([{$match: {operationType: {$in: ["insert"]}}}]).on("change", async (data: any) => {
//         console.log("Indexes Insert action triggered");
//         console.log(new Date(), data.fullDocument);
//         FindUsers.findUsersForIndexesPosition(data.fullDocument);
//     });
// };



//הוספת האזנה לעדכון פוזיציה מסוג סטוק
const addWatchForUpdateStocks = ()=> {
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

export default {listenToPositions};
