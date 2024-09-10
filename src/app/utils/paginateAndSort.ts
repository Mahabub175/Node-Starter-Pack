import { Query } from "mongoose";

export const applyFilters = (
  query: any,
  searchText?: string,
  fields: string[] = []
) => {
  if (searchText && fields.length > 0) {
    const regexPattern = new RegExp(searchText, "i");

    const searchConditions = fields.map((field) => {
      const fieldParts = field.split(".");

      const searchCondition = fieldParts.reduceRight(
        (acc: any, part, index) => {
          if (index === fieldParts.length - 1) {
            return { [part]: regexPattern };
          }
          return { [part]: acc };
        },
        {}
      );

      return searchCondition;
    });

    query = query.where({ $or: searchConditions });
  }

  return query;
};

export const paginateAndSort = async <T>(
  query: Query<T[], T>,
  page: number = 1,
  limit: number = 10,
  searchText?: string,
  fields: string[] = []
) => {
  const sortField: string = "createdAt";
  const sortOrder: "asc" | "desc" = "desc";

  const pageNumber = Math.max(1, page);
  const pageSize = Math.max(1, limit);
  const skip = (pageNumber - 1) * pageSize;

  query = applyFilters(query, searchText, fields);

  const results = await query
    .sort({ [sortField]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(pageSize)
    .exec();

  const totalCount = await query.model.countDocuments(query.getFilter()).exec();

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
