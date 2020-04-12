
// eslint-disable-next-line import/prefer-default-export
export const getPercent = (number, total, maximumFractionDigits = 2) => {
  const percent = (number / total) * 100;
  return `${percent.toLocaleString(undefined, { maximumFractionDigits })}%`;
};
