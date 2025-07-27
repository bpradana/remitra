"use client";

import { useSignerStatus } from "@account-kit/react";
import UserInfoCard from "./components/user-info/user-info-card";
import NftMintCard from "./components/nft-mint-card";
import LoginCard from "./components/login-card";
import Header from "./components/header";
import LearnMore from "./components/learn-more";
import TransferCard from "./components/transfer-card";
import WithdrawCard from "./components/withdraw-card";
import DepositCard from "./components/deposit-card";

export default function Home() {
  const signerStatus = useSignerStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="bg-bg-main bg-cover bg-center bg-no-repeat min-h-screen">
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {signerStatus.isConnected ? (
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
              <div className="flex flex-col gap-8">
                <UserInfoCard />
                <LearnMore />
              </div>
              <div className="flex flex-col gap-8">
                <NftMintCard />
                <TransferCard />
              </div>
              <div className="flex flex-col gap-8">
                <WithdrawCard />
                <DepositCard />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full pb-[4rem]">
              <LoginCard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
