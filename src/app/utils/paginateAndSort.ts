import { Query } from "mongoose";

type SortOrder = "asc" | "desc";

export const paginateAndSort = async <T>(
  query: Query<T[], T>,
  page: number = 1,
  limit: number = 10
) => {
  const pageNumber = Math.max(1, page);
  const pageSize = Math.max(1, limit);

  const skip = (pageNumber - 1) * pageSize;

  const results = await query.skip(skip).limit(pageSize).exec();

  const totalCount = await query.model.countDocuments().exec();

  const meta = {
    page: pageNumber,
    limit: pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };

  return {
    results,
    meta,
  };
};
