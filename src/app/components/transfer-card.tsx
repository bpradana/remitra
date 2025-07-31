import React, { useState, FormEvent } from "react";
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

export default function TransferCard() {
  const currencies = [
    { code: "IDR", flag: "🇮🇩" },
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
  ];
  const [sendCurrency, setSendCurrency] = useState(currencies[0]);
  const [receiveCurrency, setReceiveCurrency] = useState(currencies[1]);
  const [sendDropdownOpen, setSendDropdownOpen] = useState(false);
  const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState<string>(""); // string to allow empty
  const [recipient, setRecipient] = useState<string>("");
  const [errors, setErrors] = useState<{
    amount?: string;
    recipient?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const balanceAvailable = 1_000_000;

  const validate = () => {
    const errs: typeof errors = {};
    const parsed = parseFloat(sendAmount);
    if (isNaN(parsed) || parsed <= 0) {
      errs.amount = "Amount must be greater than 0";
    } else if (parsed > balanceAvailable) {
      errs.amount = "Insufficient balance";
    }
    if (!recipient.trim()) {
      errs.recipient = "Recipient username is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      console.log("Submitting:", { sendAmount, recipient });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer</CardTitle>
        <CardDescription>Transfer funds to a recipient.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* You send */}
          <div>
            <div className="text-gray-500 mb-1">You send</div>
            <div className="flex items-center gap-4">
              {/* Currency selector */}
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
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  min={0}
                  step="any"
                  aria-label="Send amount"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-sm text-red-500">{errors.amount}</div>
              <div className="text-sm text-gray-400 text-right">
                Balance available:{" "}
                <a className="underline" href="#">
                  {balanceAvailable.toLocaleString()} {sendCurrency.code}
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="text-gray-500 mb-1">Recipient gets</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="flex items-center border rounded px-4 py-2"
                  type="button"
                  onClick={() => setReceiveDropdownOpen((o) => !o)}
                >
                  <span className="mr-2">{receiveCurrency.flag}</span>
                  <span>{receiveCurrency.code}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {receiveDropdownOpen && (
                  <div className="absolute left-0 mt-2 bg-white border rounded shadow z-10 min-w-full">
                    {currencies.map((cur) => (
                      <div
                        key={cur.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          setReceiveCurrency(cur);
                          setReceiveDropdownOpen(false);
                        }}
                      >
                        <span className="mr-2">{cur.flag}</span>
                        <span>{cur.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-4xl font-bold ml-auto">
                {sendAmount
                  ? parseFloat(sendAmount).toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })
                  : "0"}
              </span>
            </div>
          </div>

          <div>
            <div className="text-gray-500 mb-1">Recipient Username</div>
            <Input
              placeholder="@username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={submitting}
              aria-label="Recipient username"
            />
            {errors.recipient && (
              <div className="text-sm text-red-500 mt-1">
                {errors.recipient}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 cursor-pointer"
            disabled={
              submitting ||
              !!errors.amount ||
              !recipient.trim() ||
              !sendAmount ||
              parseFloat(sendAmount) <= 0
            }
          >
            {submitting ? "Processing..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
