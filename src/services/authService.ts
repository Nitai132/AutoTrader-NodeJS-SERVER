import  Users  from "../models/users";

export const authUser = async (email: any, password: any) => {
    try {
      const user = Users.findOne({email: email, password: password});
      let isAuth = false;
      if (user) {
        isAuth = true; 
      }
      return isAuth;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
