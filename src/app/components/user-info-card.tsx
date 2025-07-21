import { useEffect, useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAddress, greetUser } from "@/lib/utils";
import { useUser, useSmartAccountClient } from "@account-kit/react";
import { Spinner } from "@/components/ui/spinner";

export default function UserInfo() {
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isUsernameCopied, setIsUsernameCopied] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const user = useUser();
  const userEmail = user?.email ?? "anon";
  const { client } = useSmartAccountClient({});

  // Fetch user info from API
  const fetchUserInfo = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        setUserInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    // Save user if not in DB (as before)
    if (user?.userId && user?.email && client?.account?.address) {
      fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          email: user.email,
          address: client.account.address,
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, user?.email, client?.account?.address]);

  // Refetch user info after username update
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setUsernameError("Username cannot be empty");
      return;
    }
    setIsSubmitting(true);
    setUsernameError("");
    try {
      const res = await fetch(`/api/users/${user?.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId,
          userName: username.trim(),
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save username");
      }
      setUsername("");
      await fetchUserInfo();
    } catch (err) {
      setUsernameError("Failed to save username");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(client?.account?.address ?? "");
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const handleUsernameCopy = () => {
    navigator.clipboard.writeText(userInfo?.userName ?? "");
    setIsUsernameCopied(true);
    setTimeout(() => setIsUsernameCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{greetUser(userInfo?.userName ?? "anon")}</CardTitle>
        <CardDescription>
          You can view your email and smart wallet address here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Email
          </p>
          <p className="font-medium">{userEmail}</p>
        </div>
        {loading ? <Spinner /> : userInfo && !userInfo.userName ? (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-yellow-500 bg-yellow-100 px-2 py-1 rounded-md">
                Please create a username to continue.
              </p>
            </div>
            <form onSubmit={handleUsernameSubmit} className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
            {usernameError && (
              <div className="text-red-600 text-xs mt-1">{usernameError}</div>
            )}
          </div>
        ) : userInfo && userInfo.userName ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs py-1 px-2">
                {userInfo.userName}
              </Badge>
              <TooltipProvider>
                <Tooltip open={isUsernameCopied}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleUsernameCopy}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : null}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-muted-foreground">
              Smart wallet address
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs py-1 px-2">
              {formatAddress(client?.account?.address ?? "")}
            </Badge>
            <TooltipProvider>
              <Tooltip open={isAddressCopied}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleAddressCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                const address = client?.account?.address;
                if (address && client?.chain?.blockExplorers?.default?.url) {
                  window.open(
                    `${client.chain.blockExplorers.default.url}/address/${address}`,
                    "_blank"
                  );
                }
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
