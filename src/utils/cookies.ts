export function getCookie(name: string): string | null {
  const cookies = typeof document !== "undefined" ? document.cookie : "";
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const result = parts.pop()?.split(";").shift();
    return result !== undefined ? result : null;
  }
  return null;
}

export async function getTokenFromCookies(): Promise<string | null> {
  // Simulate an asynchronous operation, e.g., fetching from an API or secure storage
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = getCookie("CMS.TOKEN") || null;
      resolve(token);
    }, 10); // Simulated delay of 10ms
  });
}
