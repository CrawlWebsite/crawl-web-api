export const toDateOrNull = (value: string | Date) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};
