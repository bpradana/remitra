import { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsernameSectionProps {
  userName?: string;
  isVerified?: boolean;
}

export default function UsernameSection({ userName, isVerified }: UsernameSectionProps) {
  const [isUsernameCopied, setIsUsernameCopied] = useState(false);


  const handleUsernameCopy = () => {
    navigator.clipboard.writeText(userName ?? "");
    setIsUsernameCopied(true);
    setTimeout(() => setIsUsernameCopied(false), 2000);
  };

  if (!userName) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-muted-foreground">Username</p>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-yellow-500 bg-yellow-100 px-2 py-1 rounded-md">
            Please create a username to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-muted-foreground">Username</p>
        {isVerified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Verified Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs py-1 px-2">
          {userName}
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
  );
} 