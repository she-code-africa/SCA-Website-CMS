// src/features/roles/hooks/useRoleUserCounts.ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/users/api";

export function useRoleUserCounts() {
  return useQuery({
    queryKey: ["users-all-for-role-counts"],
    queryFn: async () => {
      const result = await getUsers({ limit: 1000, page: 1 }); // fetch all users
      const users = result.users ?? []; // ✅ use 'users' instead of 'data'
      const countMap = new Map<string, number>();
      for (const user of users) {
        const roleId = user.role; // role is a string ID
        if (roleId && typeof roleId === "string") {
          countMap.set(roleId, (countMap.get(roleId) || 0) + 1);
        }
      }
      return countMap;
    },
    staleTime: 60_000
  });
}
