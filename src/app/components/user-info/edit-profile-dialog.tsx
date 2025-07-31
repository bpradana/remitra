import { useState, useEffect } from "react";
import { Settings, Loader2, CheckCircle } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { useUserData } from "@/app/hooks/useUserData";
import ConfirmationDialog from "./confirmation-dialog";

interface EditProfileDialogProps {
  userEmail: string;
  fullName?: string;
  physicalAddress?: string;
  userName?: string;
  identityNumber?: string;
  identityFile?: string;
}

interface FormData {
  email: string;
  fullName: string;
  physicalAddress: string;
  userName: string;
  identityNumber: string;
}

export default function EditProfileDialog({
  userEmail,
  fullName,
  physicalAddress,
  userName,
  identityNumber,
  identityFile,
}: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const { updateProfile } = useUserData();
  const { callOnboarding } = useUserData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: userEmail,
      fullName: fullName || "",
      physicalAddress: physicalAddress || "",
      userName: userName || "",
      identityNumber: identityNumber || "",
    },
  });

  // Reset form when props change (when user data loads)
  useEffect(() => {
    reset({
      email: userEmail,
      fullName: fullName || "",
      physicalAddress: physicalAddress || "",
      userName: userName || "",
      identityNumber: identityNumber || "",
    });
    setUploadedFile(identityFile || null);
    setTempFile(null);
  }, [
    userEmail,
    fullName,
    physicalAddress,
    userName,
    identityNumber,
    identityFile,
    reset,
  ]);

  const onSubmit = async (data: FormData) => {
    // Check if this is the first time setting the required fields
    const isFirstTimeSetting =
      !fullName && !physicalAddress && !identityNumber && !identityFile;
    const hasRequiredFields =
      data.fullName &&
      data.physicalAddress &&
      data.identityNumber &&
      (uploadedFile || tempFile);

    if (isFirstTimeSetting && hasRequiredFields) {
      // Show confirmation dialog before submitting
      setPendingFormData(data);
      setShowConfirmation(true);
      return;
    }

    await submitFormData(data);
  };

  const submitFormData = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateProfile({
        email: data.email,
        fullName: data.fullName || undefined,
        physicalAddress: data.physicalAddress || undefined,
        userName: data.userName || undefined,
        identityNumber: data.identityNumber || undefined,
        identityFile: uploadedFile || tempFile || undefined,
      });

      // Check if this is the first time setting all required fields
      const isFirstTimeSetting =
        !fullName && !physicalAddress && !identityNumber && !identityFile;
      const hasRequiredFields =
        data.fullName &&
        data.physicalAddress &&
        data.identityNumber &&
        (uploadedFile || tempFile);

      // If this is the first time setting all required fields, call onboarding API
      if (isFirstTimeSetting && hasRequiredFields) {
        try {
          await callOnboarding();
        } catch (onboardingError) {
          console.error('Onboarding error:', onboardingError);
          // Don't fail the entire operation if onboarding fails
          // The user can still save their profile data
        }
      }

      setIsSuccess(true);
      // Clear temp file after successful submission
      setTempFile(null);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        reset();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationConfirm = async () => {
    if (pendingFormData) {
      await submitFormData(pendingFormData);
      setShowConfirmation(false);
      setPendingFormData(null);
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      setIsSuccess(false);
      reset();
      setUploadedFile(identityFile || null);
      setTempFile(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const base64 = await fileToBase64(file);
        setTempFile(base64);
      } catch (err) {
        setError("Failed to process file");
        console.error("File processing error:", err);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="h-4 w-4" /> Edit Account
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
              {(!fullName ||
                !physicalAddress ||
                !identityNumber ||
                !identityFile) && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                    ⚠️ <strong>Important:</strong> Once you submit your email,
                    full name, physical address, ID number, and ID file for the
                    first time, these fields cannot be changed. Please ensure all
                    information is accurate before submitting.
                  </div>
                )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="email">
                Email
                <span className="text-red-500 ml-1">*</span>
                <span className="text-gray-500 ml-1 text-xs">
                  (cannot be changed)
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                disabled={true}
                className="bg-gray-100"
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="fullName">
                Full Name
                {!fullName && <span className="text-red-500 ml-1">*</span>}
                {fullName && (
                  <span className="text-gray-500 ml-1 text-xs">
                    (cannot be changed)
                  </span>
                )}
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName")}
                disabled={!!fullName}
                className={fullName ? "bg-gray-100" : ""}
              />
              {errors.fullName && (
                <span className="text-sm text-red-500">
                  {errors.fullName.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="physicalAddress">
                Physical Address
                {!physicalAddress && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {physicalAddress && (
                  <span className="text-gray-500 ml-1 text-xs">
                    (cannot be changed)
                  </span>
                )}
              </Label>
              <Input
                id="physicalAddress"
                placeholder="Enter your physical address"
                {...register("physicalAddress")}
                disabled={!!physicalAddress}
                className={physicalAddress ? "bg-gray-100" : ""}
              />
              {errors.physicalAddress && (
                <span className="text-sm text-red-500">
                  {errors.physicalAddress.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                placeholder="Enter your username"
                {...register("userName")}
              />
              {errors.userName && (
                <span className="text-sm text-red-500">
                  {errors.userName.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="identityNumber">
                Identity Number
                {!identityNumber && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {identityNumber && (
                  <span className="text-gray-500 ml-1 text-xs">
                    (cannot be changed)
                  </span>
                )}
              </Label>
              <Input
                id="identityNumber"
                placeholder="16 digits"
                {...register("identityNumber", {
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Identity number must be exactly 16 digits",
                  },
                })}
                disabled={!!identityNumber}
                className={identityNumber ? "bg-gray-100" : ""}
              />
              {errors.identityNumber && (
                <span className="text-sm text-red-500">
                  {errors.identityNumber.message}
                </span>
              )}
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="ktp">
                Identity File
                {!identityFile && <span className="text-red-500 ml-1">*</span>}
                {identityFile && (
                  <span className="text-gray-500 ml-1 text-xs">
                    (cannot be changed)
                  </span>
                )}
              </Label>
              <div className="relative">
                <label
                  className={`block border-dashed border-2 rounded p-6 text-center cursor-pointer ${isLoading || (!!identityFile && !tempFile)
                    ? "opacity-50 pointer-events-none"
                    : "hover:border-primary"
                    }`}
                >
                  <input
                    type="file"
                    name="identityFile"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isLoading || (!!identityFile && !tempFile)}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <div>
                    <p>
                      Drag and drop your identity file here or click to upload
                    </p>
                    {(uploadedFile || tempFile) && (
                      <div className="text-sm text-green-600 mt-2">
                        ✓ File ready for upload
                        {tempFile && (
                          <button
                            type="button"
                            onClick={() => setTempFile(null)}
                            className="ml-2 text-red-500 hover:text-red-700 underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                    {identityFile && !tempFile && (
                      <p className="text-sm text-gray-500 mt-2">
                        File already uploaded (cannot be changed)
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Profile updated successfully!
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : !fullName ||
                  !physicalAddress ||
                  !identityNumber ||
                  !identityFile ? (
                  "Submit Information"
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationCancel}
        onConfirm={handleConfirmationConfirm}
        title="⚠️ Important: Information Cannot Be Changed"
        description="You are about to submit your personal information (email, full name, physical address, ID number, and ID file) for the first time. Once submitted, these fields cannot be modified or changed. Please ensure all information is accurate and complete before proceeding."
        confirmText="Submit Information"
        cancelText="Review Again"
      />
    </>
  );
}
