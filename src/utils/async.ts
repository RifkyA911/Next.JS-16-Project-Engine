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

export function debouncePromise<T>(
  fn: () => Promise<T>,
  delayInSeconds: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    let timer: any;

    clearTimeout(timer);

    timer = setTimeout(async () => {
      try {
        resolve(await fn());
      } catch (err) {
        reject(err);
      }
    }, delayInSeconds * 1000);
  });
}