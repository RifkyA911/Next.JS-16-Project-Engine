export function joinUrl(
  base: string,
  parts: (string | number)[] | readonly unknown[]
): string {
  return [
    base.replace(/\/$/, ""),
    ...parts.map((p) => String(p).replace(/^\/+/, "")),
  ].join("/");
}

export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    console.error("Invalid URL string:", e);
    return false;
  }
};

export const isAbsoluteUrl = (str: string): boolean => {
  return /^(?:[a-z]+:)?\/\//i.test(str);
};

export const isRelativeUrl = (str: string): boolean => {
  return !isAbsoluteUrl(str);
};

export const ensureUrlHasProtocol = (
  url: string,
  defaultProtocol = "http"
): string => {
  if (!/^(?:[a-z]+:)?\/\//i.test(url)) {
    return `${defaultProtocol}://${url}`;
  }
  return url;
};

export const removeUrlProtocol = (url: string): string => {
  return url.replace(/(^\w+:|^)\/\//, "");
};
