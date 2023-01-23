import { iexStocksDocument } from "../models/iexStocks";
import { liveRateBondsDocument } from "../models/liveRateBonds.model";
import { liveRateComodityDocument } from "../models/liveRateComodity.model";
import { liveRateCurrencyPairsDocument } from "../models/liveRateCurrencyPairs.model";
import { liveRateCryptoDocument } from "../models/liveRateCrypto.model";
import { liveRateIndexesDocument } from "../models/liveRateIndexes.model";
import UserPositionsIB, { usersPositionsIBDocument } from "../models/usersPositionsIB.model";
import UserInfo, { UserInfoDocument } from "../models/usersInfo";
import UserSetup from "../models/userSetup";
import AutoUsersPositions from "../models/AutoUsersPositions";
import Sender from "./sender.service";

const checkStocksQuantities = (position: any, userSetup: any, type: any) => {
    let priceType: string;
    if (position.startPrice <= 5) {
        priceType = "_5";
    }
    else if (position.startPrice < 101 && position.startPrice > 5) {
        priceType = "_100";
    }
    else if (position.startPrice < 251 && position.startPrice > 100) {
        priceType = "_250";
    }
    else if (position.startPrice < 501 && position.startPrice > 250) {
        priceType = "_500";
    }
    else if (position.startPrice > 500) {
        priceType = "_1000";
    }


    const userQuantities: any = {};
    const ratesKeys = Object.keys(userSetup[type].rates);
    for (let i = 0; i < ratesKeys.length; i++) {
        const innerRatesKeys = userSetup[type].rates[Object.keys(userSetup[type].rates)[i]];
        const currentKey = Object.keys(userSetup[type].rates)[i];
        if (innerRatesKeys[priceType] === true) {
            Object.assign(userQuantities, { [currentKey]: userSetup[type].rates[currentKey][priceType + "_amount"] });
        }
    }
    return userQuantities;
};

const getTradingDays = (userSetup: any, type: any) => {
    let currentTradingDay = false;
    const now = new Date();
    const options: any = { weekday: "long" };
    const tradingDay = userSetup[type].times.TradingDays.filter((day: any) => day === now.toLocaleString("en-US", options));

    if (tradingDay.length > 0) {
        currentTradingDay = true;
    }
    return currentTradingDay;
};

const getTradingHours = (userSetup: any, type: any) => {
    let currentTradingHours = false;
    const now = new Date();
    const userHours = userSetup[type].times.TradingHours;
    const fromHour = userHours[0].split(" ");
    const untilHour = userHours[1].split(" ");
    const finalfromHour = fromHour[4].split(":");
    const finaluntilHour = untilHour[4].split(":");
    const currentNewYorkHour = now.getUTCHours() - 4;
    if (finalfromHour[0] <= currentNewYorkHour && finaluntilHour[0] > currentNewYorkHour) {
        currentTradingHours = true;
    }
    return currentTradingHours;
};

const getActiveBuyAndSell = (position: any, userSetup: any, type: any) => {
    let activeBuyAndSellPosition = false;
    if (position.operation == "buy") {
        userSetup[type].buyPositions === true ? activeBuyAndSellPosition = true : activeBuyAndSellPosition = false;
    }

    if (position.operation == "sell") {
        userSetup[type].sellPositions === true ? activeBuyAndSellPosition = true : activeBuyAndSellPosition = false;
    }
    return activeBuyAndSellPosition;
};

const getTodayTradesAmount = async (position: any, userSetup: any, type: any) => {
    //OLD CODE
    // const positions = await AutoUsersPositions.findOne({ user: userSetup.userEmail }, `${type}`);
    // const now = new Date();
    // const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // let todaysPositions = [];
    // if (positions[type] != null) {
    //     todaysPositions = positions[type].filter((position: any) => position.createdAt > startOfToday);
    // }
    // if (positions[type] == null || positions[type].length == 0 || todaysPositions.length < userSetup[type].tradesPerDay) {
    //     return true;
    // }
    // else {
    //     return false;
    // }
    let allowed = false;
    const todayPositions = await UserPositionsIB.countDocuments({ user: userSetup.userEmail, positionType: type.toUpperCase() });
            console.log(todayPositions, userSetup[type].tradesPerDay)
            if (todayPositions < userSetup[type].tradesPerDay || todayPositions == 0 || todayPositions == null) {
                allowed = true;
            } else {
                allowed = false;
            }
    return allowed;
};

const checkRiskManagment = async (userSetup: any, type: any) => {
    let riskManagmentUsed = false;
    if (userSetup[type].riskManagment.usePositionsRisk) {
        await UserPositionsIB.countDocuments({ user: userSetup.userEmail, succeeded: false, positionType: type.toUpperCase() }, async (err, failedPositionsCount) => {
            if (err) {
                console.log(err);
                riskManagmentUsed = false;
                console.log('reason: ERROR');
            }
            else {
                if (failedPositionsCount >= userSetup[type].riskManagment.positionsRisk) {
                    riskManagmentUsed = true;
                    console.log('reason: failed positions count');
                } else {
                    riskManagmentUsed = false;
                }
            };
        });
    };
    if (userSetup[type].riskManagment.useRatesRisk && riskManagmentUsed == false) {
        const userInfo = await UserInfo.findOne({_id: userSetup.userEmail});
        console.log(userInfo.currentBalance, userInfo.startOfTheDayBalance-userInfo.startOfTheDayBalance/100*userSetup[type].riskManagment.ratesRisk)
        if (userInfo.currentBalance < userInfo.startOfTheDayBalance-userInfo.startOfTheDayBalance/100*userSetup[type].riskManagment.ratesRisk ) {
            riskManagmentUsed = true;
            console.log('reason: rates risk');
        } 
    }
    if(userSetup[type].riskManagment.useDollarsRisk && riskManagmentUsed == false) {
        const userInfo = await UserInfo.findOne({_id: userSetup.userEmail});
        console.log(userInfo.currentBalance, userInfo.startOfTheDayBalance-userSetup[type].riskManagment.dollarsRisk)
        if (userInfo.currentBalance < userInfo.startOfTheDayBalance-userSetup[type].riskManagment.dollarsRisk) {
            riskManagmentUsed = true;
            console.log('reason: dollars risk');
        }
    }
    if (riskManagmentUsed) {
        console.log('RISK MANAGMENT ACTIVATED', userSetup.userEmail);
        let updateString = `${type}.activeAccount`;
        let updateDoc = {
            $set: { [updateString]: false }
        };
        await UserSetup.updateOne({ userEmail: userSetup.userEmail }, updateDoc);
    }
    return riskManagmentUsed;
}

const checkSameTimeTrade = async (userSetup: any, type: any) => {
    let toReturn = false;
    await UserPositionsIB.countDocuments({ user: userSetup.userEmail, active: true, positionType: type.toUpperCase() }, async (err, activePositions) => {
        if (err) {
            console.log(err);
            toReturn = false;
        }
        if (userSetup[type].riskManagment.sameTimeTrades > activePositions) {
            toReturn = false;
        } else {
            toReturn = true;
            console.log('reason: SAME TIME TRADES');
        }
    })
    return toReturn

}

// חיפוש משתמשים מחוברים ופעילים עבור אופציות של מניות
export const findUsersForStockPosition = async (position: iexStocksDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "stocks");
        if (
            userSetup.stocks.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const riskManagment = await checkRiskManagment(userSetup, 'stocks');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'stocks');
            const userQuantities = await checkStocksQuantities(position, userSetup, "stocks");
            let currentTradingDay = false;
            if (userSetup.stocks.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "stocks");
            }

            let currentTradingHours = false;
            if (userSetup.stocks.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "stocks");
            }

            if (
                Object.keys(userQuantities).length > 0 &&
                (userSetup.stocks.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.stocks.times.SpecificHours === true || currentTradingHours === true) 
                // riskManagment === false && 
                // sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "stocks");
                console.log(tradesLimitAllowed)
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, userQuantities, "stocks");
                }
            }
        }
    });
};


//צריך עדיין לסדר
export const findUsersForBondsPosition = async (position: liveRateBondsDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "bonds");
        const Quantities = {
            stocks: 0,
            options: 0,
            futureContract: userSetup.bonds.rates.futureContracts.amount,
            futureContractOptions: userSetup.bonds.rates.futureContracts.amount
        };
        if (
            userSetup.bonds.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus 
        ) {
            let currentTradingDay = false;
            const riskManagment = await checkRiskManagment(userSetup, 'bonds');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'bonds');
            if (userSetup.bonds.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "bonds");
            }

            let currentTradingHours = false;
            if (userSetup.bonds.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "bonds");
            }
            if (
                (userSetup.bonds.rates.futureContracts.amount > 0 || userSetup.bonds.rates.futureContractOptions.amount > 0) &&
                (userSetup.bonds.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.bonds.times.SpecificHours === true || currentTradingHours === true) &&
                riskManagment === false &&
                sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "bonds");
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, Quantities, "bonds");
                }
            }
        }
    });
};

export const findUsersForComodityPosition = async (position: liveRateComodityDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "comodity");
        const Quantities = {
            stocks: 0,
            options: 0,
            futureContract: userSetup.comodity.rates.futureContracts.amount,
            futureContractOptions: userSetup.comodity.rates.futureContracts.amount
        };
        if (
            userSetup.comodity.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus 
        ) {
            const riskManagment = await checkRiskManagment(userSetup, 'comodity');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'comodity');
            let currentTradingDay = false;
            if (userSetup.comodity.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "comodity");
            }

            let currentTradingHours = false;
            if (userSetup.comodity.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "comodity");
            }
            if (
                (userSetup.comodity.rates.futureContracts.amount > 0 || userSetup.comodity.rates.futureContractOptions.amount > 0) &&
                (userSetup.comodity.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.comodity.times.SpecificHours === true || currentTradingHours === true) && 
                riskManagment === false &&
                sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "comodity");
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, Quantities, "comodity");
                }
            }
        }
    });
};

export const findUsersForPairsPosition = async (position: liveRateCurrencyPairsDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "currencyPairs");
        const Quantities = {
            stocks: 0,
            options: 0,
            futureContract: userSetup.currencyPairs.rates.futureContracts.amount,
            futureContractOptions: userSetup.currencyPairs.rates.futureContracts.amount
        };
        if (
            userSetup.currencyPairs.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const riskManagment = await checkRiskManagment(userSetup, 'currencyPairs');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'currencyPairs');
            let currentTradingDay = false;
            if (userSetup.currencyPairs.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "currencyPairs");
            }

            let currentTradingHours = false;
            if (userSetup.currencyPairs.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "currencyPairs");
            }
            if (
                (userSetup.currencyPairs.rates.futureContracts.amount > 0 || userSetup.currencyPairs.rates.futureContractOptions.amount > 0) &&
                (userSetup.currencyPairs.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.currencyPairs.times.SpecificHours === true || currentTradingHours === true) &&
                riskManagment === false &&
                sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "currencyPairs");
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, Quantities, "currencyPairs");
                }
            }
        }
    });
};

export const findUsersForCryptoPosition = async (position: liveRateCryptoDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "crypto");
        const Quantities = {
            stocks: 0,
            options: 0,
            futureContract: userSetup.crypto.rates.futureContracts.amount,
            futureContractOptions: userSetup.crypto.rates.futureContracts.amount
        };
        if (
            userSetup.crypto.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const riskManagment = await checkRiskManagment(userSetup, 'crypto');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'crypto');
            let currentTradingDay = false;
            if (userSetup.crypto.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "crypto");
            }

            let currentTradingHours = false;
            if (userSetup.crypto.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "crypto");
            }
            if (
                (userSetup.crypto.rates.futureContracts.amount > 0 || userSetup.crypto.rates.futureContractOptions.amount > 0) &&
                (userSetup.crypto.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.crypto.times.SpecificHours === true || currentTradingHours === true) &&
                riskManagment === false &&
                sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "crypto");
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, Quantities, "crypto");
                }
            }
        }
    });
};

export const findUsersForIndexesPosition = async (position: liveRateIndexesDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, "indexes");
        const Quantities = {
            stocks: 0,
            options: 0,
            futureContract: userSetup.indexes.rates.futureContracts.amount,
            futureContractOptions: userSetup.indexes.rates.futureContracts.amount
        };
        if (
            userSetup.indexes.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const riskManagment = await checkRiskManagment(userSetup, 'indexes');
            const sameTimeTrades = await checkSameTimeTrade(userSetup, 'indexes');
            let currentTradingDay = false;
            if (userSetup.indexes.times.SpecificDays === false) {
                currentTradingDay = await getTradingDays(userSetup, "indexes");
            }

            let currentTradingHours = false;
            if (userSetup.indexes.times.SpecificHours === false) {
                currentTradingHours = await getTradingHours(userSetup, "indexes");
            }
            if (
                (userSetup.indexes.rates.futureContracts.amount > 0 || userSetup.indexes.rates.futureContractOptions.amount > 0) &&
                (userSetup.indexes.times.SpecificDays === true || currentTradingDay === true) &&
                (userSetup.indexes.times.SpecificHours === true || currentTradingHours === true) &&
                riskManagment === false &&
                sameTimeTrades === false
            ) {
                const tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, "indexes");
                if (tradesLimitAllowed) {
                    console.log("success");
                    Sender.sendPositionToUser(position, userSetup, Quantities, "indexes");
                }
            }
        }
    });
};


export default {
    findUsersForStockPosition,
    findUsersForBondsPosition,
    findUsersForComodityPosition,
    findUsersForPairsPosition,
    findUsersForCryptoPosition,
    findUsersForIndexesPosition
};