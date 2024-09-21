import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  const issues = error.issues;
  let message = "";

  issues.forEach((issue) => {
    message += `${issue.message} `;
  });
  return message;
};
