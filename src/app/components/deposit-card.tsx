import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useUserData } from "@/app/hooks/useUserData";
import { POST } from "@/app/api/external/idrx/transactions/mint/route";

export default function Deposit() {
  const {
    userInfo,
    bankAccounts,
    loading,
    bankAccountsLoading,
    userEmail,
    walletAddress,
    blockExplorerUrl,
    fetchUserInfo,
    fetchBankAccounts,
    updateProfile,
  } = useUserData();

  const currencies = [
    { code: "IDR", flag: "🇮🇩" },
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
    // Add more currencies as needed
  ];
  const [sendCurrency, setSendCurrency] = useState(currencies[0]);
  const [sendDropdownOpen, setSendDropdownOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);

  const handleAmountChange = async (value: string) => {
    setLoadingChange(true);
    setError(null);

    try {
      const parsed = parseFloat(value);
      if (isNaN(parsed) || parsed < 0) {
        throw new Error("Please enter a valid deposit amount.");
      }

      // Simulate async check (e.g., check max limit or call API)
      await new Promise((resolve) => setTimeout(resolve, 300)); // mock delay

      // If valid
      setAmount(parsed);
    } catch (err: any) {
      setError(err.message || "Invalid amount");
    } finally {
      setLoadingChange(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userInfo?.walletAddress || !amount) {
      alert("Missing wallet address or amount");
      return;
    }

    const body = {
      toBeMinted: amount,
      destinationWalletAddress: userInfo.walletAddress,
      expiryPeriod: 600, // 10 minutes in seconds
      networkChainId: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
      requestType: "idrx",
    };

    // try {
    //   const res = await POST(JSON.stringify(body));

    //   const data = await res.json();

    //   if (!res.ok) {
    //     throw new Error(data.error || "Something went wrong");
    //   }

    //   console.log("Mint successful:", data);
    // } catch (err) {
    //   console.error("Mint request failed:", err);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit</CardTitle>
        <CardDescription>Deposit funds instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* You send */}
          <div>
            <div className="text-gray-500 mb-1">Amount deposit</div>
            <div className="flex items-center gap-4">
              {/* Currency selector */}
              <div className="relative">
                <button
                  className="flex items-center border rounded px-4 py-2"
                  type="button"
                  onClick={() => setSendDropdownOpen((open) => !open)}
                >
                  <span className="mr-2">{sendCurrency.flag}</span>
                  <span>{sendCurrency.code}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {sendDropdownOpen && (
                  <div className="absolute left-0 mt-2 bg-white border rounded shadow z-10 min-w-full">
                    {currencies.map((cur) => (
                      <div
                        key={cur.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          setSendCurrency(cur);
                          setSendDropdownOpen(false);
                        }}
                      >
                        <span className="mr-2">{cur.flag}</span>
                        <span>{cur.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Amount */}
              <Input
                type="number"
                placeholder="Amount"
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-400 mt-1 w-full text-right">
              Balance available:{" "}
              <a className="underline" href="#">
                1,000,000 {sendCurrency.code}
              </a>
            </div>
          </div>

          {/* Continue button */}
          <Button className="w-full mt-2">Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
