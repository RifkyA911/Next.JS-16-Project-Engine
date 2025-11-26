import { BASE_API_URL } from "@/config";
import { throwIfResNotOk } from "@/utils/api";
import { joinUrl } from "@/utils/url";
import { QueryCache, QueryClient, QueryFunction } from "@tanstack/react-query";

type UnauthorizedBehavior = "returnNull" | "throw";

// ---------------------------------- Get Fetcher ----------------------------------
interface GetQueryFnOptions {
  on401?: UnauthorizedBehavior;
}
export const getQueryFn = <T = unknown>(
  options?: GetQueryFnOptions
): QueryFunction<T> => {
  const { on401: unauthorizedBehavior } = options ?? {};
  return async ({ queryKey, signal }) => {
    const res = await fetch(joinUrl(BASE_API_URL, queryKey), {
      credentials: "include",
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
