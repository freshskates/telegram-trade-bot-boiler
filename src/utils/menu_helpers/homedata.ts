export function formatNumber(num: number) {
  if (num === null || num === undefined) return "";

  const absNum = Math.abs(num);
  let formattedNumber = "";

  if (absNum < 1000) {
    // If the number is small, format with 2 decimal places
    formattedNumber = num.toFixed(2);
  } else if (absNum >= 1000 && absNum < 1_000_000) {
    // Thousands
    formattedNumber = (num / 1_000).toFixed(2) + "K";
  } else if (absNum >= 1_000_000 && absNum < 1_000_000_000) {
    // Millions
    formattedNumber = (num / 1_000_000).toFixed(2) + "M";
  } else if (absNum >= 1_000_000_000) {
    // Billions
    formattedNumber = (num / 1_000_000_000).toFixed(2) + "B";
  }

  // Add commas to the number
  if (absNum < 1000) {
    formattedNumber = Number(formattedNumber).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }

  return formattedNumber;
}
