import { JwtPayload } from "jsonwebtoken";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategoryIntoDB = async (
  categoryData: TCategory,
  userData: JwtPayload
) => {
  console.log(userData);
  const isCategoryExist = await CategoryModel.findOne({
    name: categoryData.name,
  });
  if (isCategoryExist) {
    throw new Error(`Category ${categoryData.name} already exists`);
  }
  const updatedData = {
    createdBy: userData?.userId,
    name: categoryData?.name,
  };
  const result = await CategoryModel.create(updatedData);
  return result;
};

const getAllCategoryFromDB = async () => {
  const result = await CategoryModel.find().populate("createdBy");
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
};
