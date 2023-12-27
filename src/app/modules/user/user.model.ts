import { Schema, model } from "mongoose";
import { userRole } from "./user.constants";
import { TCreateUser, TPreviousPasswords } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const previousPasswordsSchema = new Schema<TPreviousPasswords>({
  password: {
    type: "string",
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const createUserSchema = new Schema<TCreateUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },

    role: {
      type: String,
      enum: userRole,
      required: true,
      trim: true,
    },
    previousPasswords: {
      type: [previousPasswordsSchema],
      select: false,
      trim: true,
    },
  },
  { timestamps: true }
);

createUserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const userModel = model<TCreateUser>("User", createUserSchema);
