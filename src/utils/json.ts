export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    console.error("Invalid JSON string:", e);
    return false;
  }
  return true;
};

export const parseJson = <T>(str: string, defaultValue: T): T => {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.error("Invalid JSON string:", e);
    return defaultValue;
  }
};

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error("Invalid JSON string:", e);
    return "";
  }
};

export async function parseJSONSafe(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
