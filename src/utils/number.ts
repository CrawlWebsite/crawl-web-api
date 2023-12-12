export const toNumberOrNull = (value: any): number | null => {
  const num = Number(value);
  return !isNaN(num) || value === null ? num : null;
};
