import { useQuery } from "@tanstack/react-query";
import { useUser } from "@account-kit/react";

interface Bank {
    bankCode: string;
    bankName: string;
    maxAmountTransfer: string;
}

interface BanksResponse {
    statusCode: number;
    message: string;
    data?: Bank[];
    error?: string;
}

export function useBanks() {
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

            const res = await fetch(`/api/external/idrx/banks?userId=${user.userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch banks");
            }

            return res.json();
        },
        enabled: !!user?.userId,
    });

    return {
        banks: banks?.data || [],
        isLoading,
        error: error?.message || banks?.error,
        refetch,
    };
} 