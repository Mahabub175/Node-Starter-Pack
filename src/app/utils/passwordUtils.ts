import bcrypt from "bcrypt";
import { TPreviousPasswords } from "../modules/user/user.interface";
import moment from "moment";

// export const hashingPassword=async (password:string)=>{
//     const hashPassword=
// }

export const compareHashPassword = async (
  plainPass: string,
  hashPass: string
) => {
  return await bcrypt.compare(plainPass, hashPass);
};

export const checkCurrentPasswordToPreviousPassword = async (
  newPass: string,
  previousPass: TPreviousPasswords[]
) => {
  let match;
  for (const passObj of previousPass) {
    const matchedPassword = await compareHashPassword(
      newPass,
      passObj.password
    );
    if (matchedPassword) {
      match = moment(passObj.createdAt).format("YYYY-MM-DD [at] hh:mm A");
    }
  }
  return match;
};

export const getPreviousPasswordFromPreviousPassword = async (
  previousPass: TPreviousPasswords[]
) => {
  const sortingLastPassword = previousPass.sort(
    (x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()
  );
  return sortingLastPassword[0];
};
