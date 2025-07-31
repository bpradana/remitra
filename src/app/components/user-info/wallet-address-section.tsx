import { useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAddress } from "@/lib/utils";

interface WalletAddressSectionProps {
  address?: string;
  blockExplorerUrl?: string;
}

export default function WalletAddressSection({ address, blockExplorerUrl }: WalletAddressSectionProps) {
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(address ?? "");
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const handleViewOnExplorer = () => {
    if (address && blockExplorerUrl) {
      window.open(`${blockExplorerUrl}/address/${address}`, "_blank");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-muted-foreground">
          Smart wallet address
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs py-1 px-2">
          {formatAddress(address ?? "")}
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
        {blockExplorerUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleViewOnExplorer}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
} 