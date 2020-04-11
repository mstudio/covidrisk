
// eslint-disable-next-line import/prefer-default-export
export const getPercent = (number, total) => {
  const percent = Math.round((number / total) * 1000) / 10;
  return `${percent.toLocaleString()}%`;
};
