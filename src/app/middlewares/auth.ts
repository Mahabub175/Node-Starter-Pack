import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TUserRole } from "./../modules/user/user.interface";
import config from "../config";
import { userModel } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("Unauthorized Access!");
      }

      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { userId, role } = decode;

      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("User not found!");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new Error("Unauthorized Access!");
      }

      req.user = decode as JwtPayload;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
