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

export default function Withdraw() {
  const currencies = [
    { code: "IDR", flag: "🇮🇩" },
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
  ];
  const [sendCurrency, setSendCurrency] = useState(currencies[0]);
  const [sendDropdownOpen, setSendDropdownOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>(""); // string to allow empty
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const balanceAvailable = 1_000_000;

  const validate = () => {
    const parsed = parseFloat(withdrawAmount);
    if (isNaN(parsed) || parsed <= 0) {
      return "Amount must be greater than 0";
    }
    if (parsed > balanceAvailable) {
      return "Insufficient balance";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // perform withdraw logic here
      console.log("Withdrawing:", {
        amount: parseFloat(withdrawAmount),
        currency: sendCurrency.code,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw</CardTitle>
        <CardDescription>
          Withdraw your money, anytime and securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <div className="text-gray-500 mb-1">Amount withdraw</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="flex items-center border rounded px-4 py-2"
                  type="button"
                  onClick={() => setSendDropdownOpen((o) => !o)}
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
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min={0}
                  step="any"
                  aria-label="Withdraw amount"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-sm text-red-500">{error}</div>
              <div className="text-sm text-gray-400 text-right">
                Balance available:{" "}
                <a className="underline" href="#">
                  {balanceAvailable.toLocaleString()} {sendCurrency.code}
                </a>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 cursor-pointer"
            disabled={
              submitting || !!validate() // disables if there's any validation error
            }
          >
            {submitting ? "Processing..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
