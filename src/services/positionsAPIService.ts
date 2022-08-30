
export const closeSpecificPosition = async (user: any, positionType: any, symbol: any) => {
    try {
        //@ts-ignore
        await global.io.emit("closeSpecificPosition", {
            user: user,
            positionType: positionType,
            symbol: symbol
        })
    } catch (err) {
        console.log(err);
        throw err;
    };
};

export const closeAllPositions = async (user: any) => {
    try {
        //@ts-ignore
        await global.io.emit("closeAllPositions", {
            user: user
        })
    } catch (err) {
        console.log(err);
        throw err;
    };
};

export const extractPositionsDetails = async (user: any) => {
    try {
        //@ts-ignore
        await global.io.emit("extractPositionsDetails", {
        })
    } catch (err) {
        console.log(err);
        throw err;
    };
};