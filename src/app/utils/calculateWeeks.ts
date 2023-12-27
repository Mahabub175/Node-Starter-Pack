export const calculateWeeks = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const difference = end - start;
  const totalWeeks = Math.ceil(difference / (1000 * 60 * 60 * 24 * 7));
  return totalWeeks;
};
