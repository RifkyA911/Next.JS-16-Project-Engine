import { BASE_API_URL } from "@/config";
import { throwIfResNotOk } from "@/utils/api";
import { joinUrl } from "@/utils/url";
import { QueryCache, QueryClient, QueryFunction } from "@tanstack/react-query";

type UnauthorizedBehavior = "returnNull" | "throw";

// ---------------------------------- Get Fetcher ----------------------------------
interface GetQueryFnOptions {
  on401?: UnauthorizedBehavior;
  withCredentials?: boolean; // if need to send cookies
  baseUrlOverride?: string; // if custom another BASE_API_URL
}

export const getQueryFn = <T = unknown>(
  options?: GetQueryFnOptions
): QueryFunction<T> => {
  const {
    on401: unauthorizedBehavior,
    baseUrlOverride,
    withCredentials = false,
  } = options ?? {};

  return async ({ queryKey, signal }) => {
    const [path, params] = Array.isArray(queryKey)
      ? [queryKey[0], queryKey[1]]
      : [queryKey];

    const base = baseUrlOverride ?? BASE_API_URL;
    const url = new URL(path as string, base);

    if (params && typeof params === "object") {
      Object.entries(params as Record<string, string | number>).forEach(
        ([k, v]) => url.searchParams.append(k, String(v))
      );
    }

    const res = await fetch(url.toString(), {
      credentials: withCredentials ? "include" : "omit",
      signal,
    });

    if (
      (unauthorizedBehavior ?? "returnNull") === "returnNull" &&
      res.status === 401
    ) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
};

// ---------------------------------- Query Client ----------------------------------
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query error:", error, "on", query.queryKey);
      // misal redirect ke login kalau 401
    },
  }),
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
