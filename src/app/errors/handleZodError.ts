import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  const issues = error.issues;
  let message = "Something went wrong!";

  issues.forEach((issue) => {
    message += `${issue.path[issue.path.length - 1]} is ${issue.message}`;
  });
  return message;
};
