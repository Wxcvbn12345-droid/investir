export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value >= 10_000 ? 0 : 2,
  }).format(value);

export const formatPercent = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);

export const formatMonths = (months: number) => {
  if (months < 12) return `${months} mois`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} ans` : `${years.toFixed(1).replace(".", ",")} ans`;
};
