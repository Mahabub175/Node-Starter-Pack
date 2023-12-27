export const handleDuplicateError = (error: any) => {
  const match = error.message.match(/"([^"]*)"/);
  const message = match && match[1];
  return `${message} already exists`;
};
