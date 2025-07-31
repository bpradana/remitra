import { useEffect, useState } from "react";
import { useUser, useSmartAccountClient } from "@account-kit/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile, BankAccount, UpdateProfileRequest } from "@/app/presentation/common";

export function useUserData() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(false);

  const user = useUser();
  const { client } = useSmartAccountClient({});
  const queryClient = useQueryClient();

  // Fetch user info using React Query
  const {
    data: userInfo,
    isLoading: loading,
    refetch: fetchUserInfo,
  } = useQuery({
    queryKey: ["userInfo", user?.userId],
    queryFn: async () => {
      if (!user?.userId) return null;
      const res = await fetch(`/api/internal/users/${user.userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const response = await res.json();
        return response.data; // Extract data from presentation layer response
      } else {
        return null;
      }
    },
    enabled: !!user?.userId,
  });

  // Fetch bank accounts from API
  const fetchBankAccounts = async () => {
    if (!user?.userId) return;
    setBankAccountsLoading(true);
    try {
      const res = await fetch(`/api/internal/users/${user.userId}/bank-accounts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const response = await res.json();
        setBankAccounts(response.data || []); // Extract data from presentation layer response
      } else {
        setBankAccounts([]);
      }
    } finally {
      setBankAccountsLoading(false);
    }
  };

  // Update profile data (email, username, identity number)
  const updateProfile = async (data: UpdateProfileRequest) => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`/api/internal/users/${user.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      // Invalidate and refetch user info immediately after successful update
      await queryClient.invalidateQueries({ queryKey: ["userInfo", user.userId] });
    } catch (err) {
      throw err;
    }
  };

  // Save user to database if not exists
  const saveUser = async () => {
    if (user?.userId && user?.email && client?.account?.address) {
      try {
        await fetch(`/api/internal/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            email: user.email,
            address: client.account.address,
          }),
        });
      } catch (err) {
        console.error("Failed to save user:", err);
      }
    }
  };

  // Call onboarding API
  const callOnboarding = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`/api/external/idrx/onboard/${user.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to complete onboarding");
      }
      // Invalidate and refetch user info immediately after successful onboarding
      await queryClient.invalidateQueries({ queryKey: ["userInfo", user.userId] });
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBankAccounts();
    saveUser();
  }, [user?.userId, user?.email, client?.account?.address]);

  return {
    userInfo,
    bankAccounts,
    loading,
    bankAccountsLoading,
    userEmail: user?.email ?? "anon",
    walletAddress: client?.account?.address,
    blockExplorerUrl: client?.chain?.blockExplorers?.default?.url,
    fetchUserInfo,
    fetchBankAccounts,
    updateProfile,
    callOnboarding,
  };
} 