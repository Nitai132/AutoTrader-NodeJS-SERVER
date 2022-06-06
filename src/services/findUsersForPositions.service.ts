import { iexStocksDocument } from "../models/iexStocks";
import { liveRateBondsDocument } from "../models/liveRateBonds.model";
import UserInfo, { UserInfoDocument } from "../models/usersInfo";
import UserSetup from "../models/userSetup";
import AutoUsersPositions from "../models/AutoUsersPositions";
import Sender from "./sender.service";


const checkQuantities = (position: any, userSetup: any, type: any) => {
    let priceType: string;
    if (position.startPrice <= 5) {
        priceType = '_5';
    }
    else if (position.startPrice < 101 && position.startPrice > 5) {
        priceType = '_100';
    }
    else if (position.startPrice < 251 && position.startPrice > 100) {
        priceType = '_250';
    }
    else if (position.startPrice < 501 && position.startPrice > 250) {
        priceType = '_500';
    }
    else if (position.startPrice > 500) {
        priceType = '_1000';
    }


    let userQuantities: any = {};
    const ratesKeys = Object.keys(userSetup[type].rates);
    for (let i = 0; i < ratesKeys.length; i++) {
        const innerRatesKeys = userSetup[type].rates[Object.keys(userSetup[type].rates)[i]];
        const currentKey = Object.keys(userSetup[type].rates)[i];
        if (innerRatesKeys[priceType] === true) {
            Object.assign(userQuantities, { [currentKey]: userSetup[type].rates[currentKey][priceType + '_amount'] })
        }
    }
    return userQuantities;
}

const getTradingDays = (userSetup: any, type: any) => {
    let currentTradingDay = false;
    let now = new Date();
    let options: any = { weekday: 'long' }
    const tradingDay = userSetup[type].times.TradingDays.filter((day: any) => day === now.toLocaleString('en-US', options));

    if (tradingDay.length > 0) {
        currentTradingDay = true
    };
    return currentTradingDay
}

const getTradingHours = (userSetup: any, type: any) => {
    let currentTradingHours = false;
    let now = new Date();
    const userHours = userSetup[type].times.TradingHours;
    const fromHour = userHours[0].split(' ');
    const untilHour = userHours[1].split(' ');
    const finalfromHour = fromHour[4].split(':');
    const finaluntilHour = untilHour[4].split(':');
    const currentNewYorkHour = now.getUTCHours() - 4;
    if (finalfromHour[0] <= currentNewYorkHour && finaluntilHour[0] > currentNewYorkHour) {
        currentTradingHours = true;
    }
    return currentTradingHours;
}

const getActiveBuyAndSell = (position: any, userSetup: any, type: any) => {
    let activeBuyAndSellPosition = false;
    if (position.operation == "buy") {
        userSetup[type].buyPositions === true ? activeBuyAndSellPosition = true : activeBuyAndSellPosition = false
    }

    if (position.operation == "sell") {
        userSetup[type].sellPositions === true ? activeBuyAndSellPosition = true : activeBuyAndSellPosition = false
    }
    return activeBuyAndSellPosition
}

const getTodayTradesAmount = async (position: any, userSetup: any, type: any) => {
    const positions = await AutoUsersPositions.findOne({ user: userSetup.userEmail }, `${type}`);
    let now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaysPositions = positions[type].filter((position: any) => position.createdAt > startOfToday);
    if (positions[type] == null || todaysPositions.length < userSetup[type].tradesPerDay) {
        return true;
    }
    else {
        return false;
    };
};

// חיפוש משתמשים מחוברים ופעילים עבור אופציות של מניות
export const findUsersForStockPosition = async (position: iexStocksDocument): Promise<void> => {
    const activeUsers = await UserInfo.find({ gatewayStatus: true }, "_id");
    activeUsers.forEach(async (user: UserInfoDocument) => {
        const userSetup = await UserSetup.findOne({ userEmail: user._id });
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, 'stocks');

        if (
            userSetup.stocks.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const userQuantities = await checkQuantities(position, userSetup, 'stocks');
            let currentTradingDay = false;
            if (userSetup.stocks.times.SpecificDays === true) {
                currentTradingDay = await getTradingDays(userSetup, 'stocks');
            }

            let currentTradingHours = false;
            if (userSetup.stocks.times.SpecificHours === true) {
                currentTradingHours = await getTradingHours(userSetup, 'stocks');
            }

            if (
                Object.keys(userQuantities).length > 0 &&
                (userSetup.stocks.times.SpecificDays === false || currentTradingDay === true) &&
                (userSetup.stocks.times.SpecificHours === false || currentTradingHours === true)
            ) {
                let tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, 'stocks');
                if (tradesLimitAllowed) {
                    console.log('success');
                    Sender.sendPositionToUser(position, userSetup, userQuantities, 'stocks');
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
        const activeBuyAndSellPosition = await getActiveBuyAndSell(position, userSetup, 'bonds');

        if (
            userSetup.bonds.activeAccount &&
            activeBuyAndSellPosition &&
            userSetup.tradingStatus
        ) {
            const userQuantities = await checkQuantities(position, userSetup, 'bonds');
            let currentTradingDay = false;
            if (userSetup.bonds.times.SpecificDays === true) {
                currentTradingDay = await getTradingDays(userSetup, 'bonds');
            }

            let currentTradingHours = false;
            if (userSetup.stocks.times.SpecificHours === true) {
                currentTradingHours = await getTradingHours(userSetup, 'bonds');
            }

            if (
                Object.keys(userQuantities).length > 0 &&
                (userSetup.bonds.times.SpecificDays === false || currentTradingDay === true) &&
                (userSetup.bonds.times.SpecificHours === false || currentTradingHours === true)
            ) {
                let tradesLimitAllowed = await getTodayTradesAmount(position, userSetup, 'bonds');
                if (tradesLimitAllowed) {
                    console.log('success');
                    Sender.sendPositionToUser(position, userSetup, userQuantities, 'bonds');
                }
            }
        }
    });
};

export default { findUsersForStockPosition };