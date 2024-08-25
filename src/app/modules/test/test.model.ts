import { model, Schema, Document, Model } from "mongoose";
import { ITest } from "./test.interface";

// Define the schema
const testSchema = new Schema<ITest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    number: {
      type: Schema.Types.Mixed,
      required: true,
      trim: true,
      unique: true,
    },
    attachment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Define a static method for the model
testSchema.statics.isTestExists = async function (
  testId: number | string
): Promise<boolean> {
  const existingTest = await this.findOne({ _id: testId });
  return !!existingTest;
};

// Create an interface that includes the static methods
interface TestModel extends Model<ITest> {
  isTestExists(testId: number | string): Promise<boolean>;
}

// Create and export the model
export const testModel = model<ITest, TestModel>("Test", testSchema);
