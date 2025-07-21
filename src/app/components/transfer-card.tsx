import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

export default function TransferCard() {
    const currencies = [
        { code: "IDR", flag: "🇮🇩" },
        { code: "USD", flag: "🇺🇸" },
        { code: "EUR", flag: "🇪🇺" },
        // Add more currencies as needed
    ];
    const [sendCurrency, setSendCurrency] = useState(currencies[0]);
    const [receiveCurrency, setReceiveCurrency] = useState(currencies[1]);
    const [sendDropdownOpen, setSendDropdownOpen] = useState(false);
    const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transfer</CardTitle>
                <CardDescription>
                    Transfer funds to a recipient.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    {/* You send */}
                    <div>
                        <div className="text-gray-500 mb-1">You send</div>
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
                            <span className="text-4xl font-bold ml-auto">160,000</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1 w-full text-right">
                            Balance available: <a className="underline" href="#">1,000,000 {sendCurrency.code}</a>
                        </div>
                    </div>

                    {/* Recipient gets */}
                    <div>
                        <div className="text-gray-500 mb-1">Recipient gets</div>
                        <div className="flex items-center gap-4">
                            {/* Currency selector */}
                            <div className="relative">
                                <button
                                    className="flex items-center border rounded px-4 py-2"
                                    type="button"
                                    onClick={() => setReceiveDropdownOpen((open) => !open)}
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
                            {/* Amount */}
                            <span className="text-4xl font-bold ml-auto">10</span>
                        </div>
                    </div>

                    {/* Username input */}
                    <div>
                        <div className="text-gray-500 mb-1">Recipient Username</div>
                        <Input placeholder="@username" />
                    </div>

                    {/* Continue button */}
                    <Button className="w-full mt-2">Continue</Button>
                </div>
            </CardContent>
        </Card>
    )
}