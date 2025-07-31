import { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useBanks } from "@/app/hooks/useBanks";

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  createdAt: string;
}

interface BankAccountsDialogProps {
  userId: string;
  bankAccounts: BankAccount[];
  loading: boolean;
  onRefresh: () => void;
}

export default function BankAccountsDialog({
  userId,
  bankAccounts,
  loading,
  onRefresh,
}: BankAccountsDialogProps) {
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({ bankName: "", bankCode: "", accountNumber: "" });
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [bankError, setBankError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch banks from IDRX API when dialog opens
  const { banks, isLoading: banksLoading, error: banksError } = useBanks(isDialogOpen);

  // Handle adding new bank account
  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankAccount.bankName.trim() || !newBankAccount.bankCode.trim() || !newBankAccount.accountNumber.trim()) {
      setBankError("Bank name, bank code, and account number are required");
      return;
    }
    setIsAddingBank(true);
    setBankError("");
    try {
      const res = await fetch(`/api/internal/users/${userId}/bank-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: newBankAccount.bankName.trim(),
          bankCode: newBankAccount.bankCode.trim(),
          accountNumber: newBankAccount.accountNumber.trim(),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add bank account");
      }
      setNewBankAccount({ bankName: "", bankCode: "", accountNumber: "" });
      setShowAddBankForm(false);
      onRefresh();
    } catch (err: any) {
      setBankError(err.message || "Failed to add bank account");
    } finally {
      setIsAddingBank(false);
    }
  };

  // Handle deleting bank account
  const handleDeleteBankAccount = async (accountId: number) => {
    try {
      const res = await fetch(`/api/internal/users/${userId}/bank-accounts/${accountId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to delete bank account");
      }
      onRefresh();
    } catch (err) {
      console.error("Failed to delete bank account:", err);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CreditCard className="h-4 w-4" /> Bank Accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bank Accounts</DialogTitle>
          <DialogDescription>
            Manage your bank accounts. Add new accounts or remove existing ones.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Existing Bank Accounts */}
          <div>
            <h4 className="text-sm font-medium mb-2">Your Bank Accounts</h4>
            {loading ? (
              <Spinner />
            ) : bankAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bank accounts added yet.</p>
            ) : (
              <div className="space-y-2">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.accountNumber}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteBankAccount(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Bank Account */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Add New Bank Account</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddBankForm(!showAddBankForm)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {showAddBankForm ? "Cancel" : "Add"}
              </Button>
            </div>

            {showAddBankForm && (
              <form onSubmit={handleAddBankAccount} className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Select
                    value={newBankAccount.bankName}
                    onValueChange={(value) => {
                      const selectedBank = banks.find(bank => bank.bankName === value);
                      setNewBankAccount({
                        ...newBankAccount,
                        bankName: value,
                        bankCode: selectedBank?.bankCode || ""
                      });
                    }}
                    disabled={banksLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={banksLoading ? "Loading banks..." : "Select a bank"} />
                    </SelectTrigger>
                    <SelectContent>
                      {banksLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Spinner className="h-4 w-4" />
                        </div>
                      ) : banksError ? (
                        <div className="p-4 text-sm text-red-600">
                          Failed to load banks. Please try again.
                        </div>
                      ) : (
                        banks.map((bank) => (
                          <SelectItem key={bank.bankCode} value={bank.bankName}>
                            {bank.bankName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    type="text"
                    placeholder="Enter account number"
                    value={newBankAccount.accountNumber}
                    onChange={(e) =>
                      setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })
                    }
                  />
                </div>
                {bankError && (
                  <p className="text-sm text-red-600">{bankError}</p>
                )}
                {banksError && (
                  <p className="text-sm text-red-600">Error loading banks: {banksError}</p>
                )}
                <Button type="submit" disabled={isAddingBank || banksLoading} className="w-full">
                  {isAddingBank ? "Adding..." : "Add Bank Account"}
                </Button>
              </form>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 