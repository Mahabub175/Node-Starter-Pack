import { Model, Schema, model } from "mongoose";
import { userRole } from "./user.constants";
import { TPreviousPasswords, TUser } from "./user.interface";
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

const userSchema = new Schema<TUser>(
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
      default: "user",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    profile_image: {
      type: String,
      required: false,
      trim: true,
    },
    total_amount: {
      type: Number,
      required: false,
    },
    previousPasswords: {
      type: [previousPasswordsSchema],
      select: 0,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

// Define a static method for the model
userSchema.statics.isCategoryExists = async function (
  userId: number | string
): Promise<boolean> {
  const existingUser = await this.findOne({ _id: userId });
  return !!existingUser;
};

// Create an interface that includes the static methods
interface UserModel extends Model<TUser> {
  isCategoryExists(userId: number | string): Promise<boolean>;
}

export const userModel = model<TUser, UserModel>("user", userSchema);
