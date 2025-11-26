// utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delayInSeconds: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delayInSeconds * 1000);
  };
}
