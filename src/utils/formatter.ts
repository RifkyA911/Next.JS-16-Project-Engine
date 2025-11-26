type DateFormatOptions = {
  includeDate?: boolean;
  includeTime?: boolean;
};

export const formatCurrentDate = (options?: DateFormatOptions): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  const datePart = options?.includeDate ? `${year}-${month}-${day}` : "";
  const timePart = options?.includeTime ? `${hours}-${minutes}-${seconds}` : "";

  return [datePart, timePart].filter(Boolean).join("-");
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};
