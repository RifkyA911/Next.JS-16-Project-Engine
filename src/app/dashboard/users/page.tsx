// UsersList.tsx
"use client";
import { useUsers } from "@/hooks/api/dashboard/use-users";

export default function UsersList() {
    const { data, error, isLoading } = useUsers();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;


    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    // const createUser = useApiMutation<User, { name: string; email: string }>("/api/users", "POST");

    // createUser.mutate({ name: "Rifky", email: "rifky@example.com" });
    // };

    return (
        <ul>
            {data?.map((user: any) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
