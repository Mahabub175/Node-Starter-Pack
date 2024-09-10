import mongoose from "mongoose";
import config from "../../config";
import { userModel } from "./user.model";
import jwt from "jsonwebtoken";
import {
  checkCurrentPasswordToPreviousPassword,
  compareHashPassword,
  getPreviousPasswords,
  hashPassword,
} from "../../utils/passwordUtils";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { base_url } from "../../utils/base_url";
import { TUser } from "./user.interface";
import { applyFilters } from "../../utils/applyFilters";
import { paymentModel } from "../payment/payment.model";

const createUserService = async (userData: TUser) => {
  const result = await userModel.create(userData);

  const { _id, username, email, role, createdAt, updatedAt } = result;

  const userInfo = {
    _id,
    username,
    email,
    role,
    createdAt,
    updatedAt,
  };

  return userInfo;
};

const loginUserService = async (userData: {
  usernameOrEmail: string;
  password: string;
}) => {
  const query = userData.usernameOrEmail.includes("@")
    ? { email: userData.usernameOrEmail }
    : { username: userData.usernameOrEmail };

  const user = await userModel
    .findOne(query)
    .select("_id username email password role status");

  if (!user) {
    throw new Error("User not found!");
  }

  if (user.status !== "active") {
    throw new Error("Your account is inactive. Please contact support.");
  }

  if (!(await compareHashPassword(userData.password, user.password))) {
    throw new Error("Wrong password! Please try again with a valid password!");
  }

  const expirationTime = Math.floor(Date.now() / 1000 + 2 * 24 * 60 * 60);

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    exp: expirationTime,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const changeUserPasswordService = async (
  userId: string,
  userData: { currentPassword: string; newPassword: string }
) => {
  const user = await userModel
    .findById(userId)
    .select("password previousPasswords");

  const matchPassword = await compareHashPassword(
    userData?.currentPassword,
    user?.password as string
  );

  if (!matchPassword) {
    throw new Error("Passwords do not match! Please try again!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const previousPasswords = user?.previousPasswords;
    const compareCurrentAndPreviousPasswords = await compareHashPassword(
      userData?.newPassword,
      user?.password as string
    );

    if (compareCurrentAndPreviousPasswords) {
      throw new Error(
        "Password Change Failed! Please Ensure that new password in unique from the previous used 2 passwords!"
      );
    }

    const hashedPassword = await hashPassword(userData?.newPassword);
    if (previousPasswords && previousPasswords.length > 0) {
      const crossCheck = await checkCurrentPasswordToPreviousPassword(
        userData?.newPassword,
        previousPasswords
      );
      if (crossCheck) {
        throw new Error(
          "Password Change Failed! Please Ensure that new password in unique from the previous used 2 passwords!"
        );
      }
      if (previousPasswords.length >= 2) {
        const lastPreviousPassword = await getPreviousPasswords(
          previousPasswords
        );

        const deletePreviousPassword = await userModel.findByIdAndUpdate(
          userId,
          {
            $pull: {
              previousPasswords: {
                password: lastPreviousPassword.password,
              },
            },
          },
          {
            session,
            runValidators: true,
          }
        );
        if (!deletePreviousPassword) {
          throw new Error("Failed to change password!");
        }
        const changePassword = await userModel.findByIdAndUpdate(
          userId,
          {
            password: hashedPassword,
            $addToSet: {
              previousPasswords: {
                password: hashedPassword,
                createdAt: new Date(),
              },
            },
          },
          {
            session,
            runValidators: true,
          }
        );
        if (!changePassword) {
          throw new Error("Failed to change password!");
        } else {
          const changePassword = await userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            $addToSet: {
              previousPasswords: {
                password: hashedPassword,
                createdAt: new Date(),
              },
            },
          });
          if (!changePassword) {
            throw new Error("Failed to change password!");
          }
        }
        await session.commitTransaction();
        await session.endSession();

        const updatedUser = await userModel.findById(userId);
        return updatedUser;
      }
    }
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// Get all tests with optional pagination
const getAllUserService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields: string[] = []
) => {
  let query = userModel.find();

  query = applyFilters(query, searchText, searchFields);

  let users: any;

  if (page && limit) {
    const result = await paginateAndSort(query, page, limit);

    result.results = await Promise.all(
      result.results.map(async (user: any) => {
        // Updating profile image URL
        if (user.profile_image) {
          user.profile_image = `${base_url}/${user.profile_image.replace(
            /\\/g,
            "/"
          )}`;
        }

        const totalAmount = await paymentModel.aggregate([
          { $match: { user: user._id, payment_status: "SUCCESS" } },
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        user.total_amount =
          totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

        return user;
      })
    );

    users = result;
  } else {
    const results: any = await query.exec();

    const modifiedResults = await Promise.all(
      results.map(async (user: any) => {
        if (user.profile_image) {
          user.profile_image = `${base_url}/${user.profile_image.replace(
            /\\/g,
            "/"
          )}`;
        }

        const totalAmount = await paymentModel.aggregate([
          { $match: { user: user._id, payment_status: "SUCCESS" } },
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        user.total_amount =
          totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

        return user;
      })
    );

    users = { results: modifiedResults };
  }

  return users;
};

//Get single test
const getSingleUserService = async (userId: number | string) => {
  const queryId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  const userExists = await userModel.isCategoryExists(
    queryId as number | string
  );
  if (!userExists) {
    throw new Error("User not found");
  }

  const result = await userModel.findById(queryId).exec();
  if (!result) {
    throw new Error("User not found");
  }
  if (result.profile_image) {
    result.profile_image = `${base_url}/${result.profile_image.replace(
      /\\/g,
      "/"
    )}`;
  }
  const totalAmount = await paymentModel.aggregate([
    { $match: { user: queryId, payment_status: "SUCCESS" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  result.total_amount = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

  return result;
};

const updateUserStatusService = async (
  userId: string | number,
  status: string
) => {
  const queryId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  // Check if the user exists
  const userExists = await userModel.exists({ _id: queryId });
  if (!userExists) {
    throw new Error("User not found");
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    queryId,
    { status },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Failed to update user status");
  }

  return updatedUser;
};

const updateSingleUserService = async (
  userId: string | number,
  userData: Partial<TUser>
) => {
  const queryId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  const result = await userModel
    .findByIdAndUpdate(
      queryId,
      { $set: userData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

export const userServices = {
  createUserService,
  loginUserService,
  changeUserPasswordService,
  getAllUserService,
  getSingleUserService,
  updateUserStatusService,
  updateSingleUserService,
};
