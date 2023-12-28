import { Schema, model } from "mongoose";
import { userRole } from "./user.constants";
import { TCreateUser, TPreviousPasswords } from "./user.interface";
import { hashPassword } from "../../utils/passwordUtils";

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
      select: 0,
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
      select: 0,
      trim: true,
    },
  },
  { timestamps: true }
);

createUserSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

export const userModel = model<TCreateUser>("User", createUserSchema);
