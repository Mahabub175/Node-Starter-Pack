import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategoryIntoDB = async (categoryData: TCategory) => {
  const isCategoryExist = await CategoryModel.findOne({
    name: categoryData.name,
  });
  if (isCategoryExist) {
    throw new Error(`Category ${categoryData.name} already exists`);
  }
  const result = await CategoryModel.create(categoryData);
  return result;
};

const getAllCategoryFromDB = async () => {
  const result = await CategoryModel.find().populate("user");
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
};
