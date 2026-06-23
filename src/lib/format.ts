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
  if (!Number.isFinite(months) || months < 1) return "1 mois";
  if (months < 12) return `${months} mois`;
  const years = months / 12;
  if (Number.isInteger(years)) {
    return years === 1 ? "1 an" : `${years} ans`;
  }
  return `${years.toFixed(1).replace(".", ",")} ans`;
};
