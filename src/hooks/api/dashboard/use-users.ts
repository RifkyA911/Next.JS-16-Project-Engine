import { BASE_API_URL } from "@/config";
import { getQueryFn, queryClient } from "@/lib/query-client";
import { ApiResponse } from "@/types/api-type";
import { User } from "@/types/dashboard/users-type";
import { axiosReq } from "@/utils/api";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useUsers(type?: string): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: type ? ["users", type] : ["users"],
    queryFn: getQueryFn<User[]>(),
    // placeholderData: {
    //   data: [],
    //   links: {},
    //   meta: {},
    // }
    // enabled: !!type, // kalau mau fetch cuma kalau type ada
  });
}

export function useCreateUser() {
  return useMutation<
    ApiResponse<User>,
    AxiosError,
    { name: string; email: string }
  >({
    mutationFn: async (payload) => {
      const res = await axiosReq<ApiResponse<User>>({
        method: "POST",
        url: `${BASE_API_URL}/users`,
        data: payload,
      });
      return res.data;
    },
    onSuccess: () => {
      // ✅ Refresh daftar user setelah tambah berhasil
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Create user failed:", error.message);
    },
  });
}
