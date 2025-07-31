import { useQuery } from "@tanstack/react-query";
import { useUser } from "@account-kit/react";
import { BanksResponse } from "@/app/presentation/external/idrx/banks";

export function useBanks(enabled: boolean = false) {
  const user = useUser();

  const {
    data: banks,
    isLoading,
    error,
    refetch,
  } = useQuery<BanksResponse>({
    queryKey: ["banks", user?.userId],
    queryFn: async () => {
      if (!user?.userId) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(`/api/external/idrx/banks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch banks");
      }

      const response = await res.json();
      return response; // Return the full response for type safety
    },
    enabled: enabled && !!user?.userId,
  });

  return {
    banks: banks?.data || [],
    isLoading,
    error: error?.message || banks?.error,
    refetch,
  };
} 