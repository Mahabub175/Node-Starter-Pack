import bcrypt from "bcrypt";
import config from "../config";

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds as string)
  );
  return hashedPassword;
};

export default hashPassword;
