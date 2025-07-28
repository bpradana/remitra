import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { greetUser } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useUserData } from "@/app/hooks/useUserData";
import UsernameSection from "@/app/components/user-info/username-section";
import WalletAddressSection from "@/app/components/user-info/wallet-address-section";
import BankAccountsDialog from "@/app/components/user-info/bank-accounts-dialog";
import EditProfileDialog from "@/app/components/user-info/edit-profile-dialog";

export default function UserInfo() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{greetUser(userInfo?.fullName ?? "anon")}</CardTitle>
        <CardDescription>
          You can view your email and smart wallet address here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Section */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Email
          </p>
          <p className="font-medium">{userEmail}</p>
        </div>

        {/* Username Section */}
        {loading ? (
          <Spinner />
        ) : (
          <UsernameSection userName={userInfo?.userName} />
        )}

        {/* Wallet Address Section */}
        <WalletAddressSection
          address={walletAddress}
          blockExplorerUrl={blockExplorerUrl}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <EditProfileDialog
            userEmail={userEmail}
            fullName={userInfo?.fullName}
            physicalAddress={userInfo?.physicalAddress}
            userName={userInfo?.userName}
            identityNumber={userInfo?.identityNumber}
            identityFile={userInfo?.identityFile}
          />

          {/* Bank Accounts Dialog */}
          <BankAccountsDialog
            userId={userInfo?.userId ?? ""}
            bankAccounts={bankAccounts}
            loading={bankAccountsLoading}
            onRefresh={fetchBankAccounts}
          />
        </div>
      </CardContent>
    </Card>
  );
}
