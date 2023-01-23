
export const closeSpecificPosition = async (user: any, IB_ID: any) => {
    try {
        //@ts-ignore
        await global.io.emit("closeSpecificPosition", {
            user: user,
            IB_ID: IB_ID,
        });
        console.log(user, IB_ID);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const closeAllPositions = async (user: any) => {
    try {
        //@ts-ignore
        await global.io.emit("closeAllPositions", {
            user: user
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const extractPositionsDetails = async (user: any) => {
    try {
        //@ts-ignore
        await global.io.emit("extractPositionDetails", {
            user: user
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};