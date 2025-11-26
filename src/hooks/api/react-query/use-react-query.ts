import { ApiResponse } from "@/types/api-type";
import { axiosReq } from "@/utils/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse, Method } from "axios";

// 💥 Contoh Penggunaan
// 🟩 1. Create User (POST)
// const createUser = useApiMutation<User, { name: string; email: string }>("/api/users", "POST");

// createUser.mutate({ name: "Rifky", email: "rifky@example.com" });

// 🟦 2. Update User (PUT)
// const updateUser = useApiMutation<User, { name?: string; email?: string }>("/api/users/123", "PUT");

// updateUser.mutate({ email: "updated@example.com" });

// 🟥 3. Delete User (DELETE)
// const deleteUser = useApiMutation<null, void>("/api/users/123", "DELETE");

// deleteUser.mutate();

export function useApiMutation<TResponse, TVariables = unknown>(
  url: string,
  method: Method = "POST"
): UseMutationResult<ApiResponse<TResponse>, Error, TVariables> {
  return useMutation({
    mutationFn: async (payload: TVariables) => {
      const res: AxiosResponse<ApiResponse<TResponse>> = await axiosReq({
        url,
        method,
        data: payload,
      });
      return res.data;
    },
  });
}
