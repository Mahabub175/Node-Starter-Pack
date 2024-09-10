import mongoose, { ObjectId } from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { ITest } from "./test.interface";
import { testModel } from "./test.model";
import { formatResultImage } from "../../utils/formatResultImage";

//Create a test into database
const createTestService = async (userData: ITest, filePath?: string) => {
  const dataToSave = { ...userData, filePath };
  const result = await testModel.create(dataToSave);
  return result;
};

// Get all tests with optional pagination
const getAllTestService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = testModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<ITest>(
      result.results,
      "attachment"
    ) as ITest[];

    return result;
  } else {
    results = await testModel.find().exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

//Get single test
const getSingleTestService = async (testId: number | string) => {
  // Convert string ID to ObjectId if necessary
  const queryId =
    typeof testId === "string" ? new mongoose.Types.ObjectId(testId) : testId;

  // Check if the test exists
  const testExists = await testModel.isTestExists(queryId as number | string);
  if (!testExists) {
    throw new Error("Test not found");
  }

  // Find the test by ID
  const result = await testModel.findById(queryId).exec();
  if (!result) {
    throw new Error("Test not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<ITest>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};
//Update single test
const updateSingleTestService = async (
  testId: string | number,
  testData: ITest
) => {
  const queryId =
    typeof testId === "string" ? new mongoose.Types.ObjectId(testId) : testId;

  const result = await testModel
    .findByIdAndUpdate(
      queryId,
      { $set: testData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Test not found");
  }

  return result;
};

//Delete single test
const deleteSingleTestService = async (testId: string | number) => {
  const queryId =
    typeof testId === "string" ? new mongoose.Types.ObjectId(testId) : testId;

  const result = await testModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Test not found");
  }

  return result;
};

//Delete many test
const deleteManyTestsService = async (testIds: (string | number)[]) => {
  const queryIds = testIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await testModel.deleteMany({ _id: { $in: queryIds } }).exec();

  return result;
};

export const testServices = {
  createTestService,
  getAllTestService,
  getSingleTestService,
  updateSingleTestService,
  deleteSingleTestService,
  deleteManyTestsService,
};
