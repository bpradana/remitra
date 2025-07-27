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
import { Dropzone, DropzoneContent } from "@/components/ui/dropzone";

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
    identityFile
}: EditProfileDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<string | null>(identityFile || null);

    const { updateProfile } = useUserData();

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
    }, [userEmail, fullName, physicalAddress, userName, identityNumber, identityFile, reset]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateProfile({
                email: data.email,
                fullName: data.fullName || undefined,
                physicalAddress: data.physicalAddress || undefined,
                userName: data.userName || undefined,
                identityNumber: data.identityNumber || undefined,
                identityFile: uploadedFile || undefined,
            });
            setIsSuccess(true);
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

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setError(null);
            setIsSuccess(false);
            reset();
            setUploadedFile(identityFile || null);
        }
    };

    const handleDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            try {
                const base64 = await fileToBase64(file);
                setUploadedFile(base64);
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
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleError = (error: Error) => {
        console.error("Dropzone error:", error);
        setError("Failed to upload file");
    };

    return (
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
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">{errors.email.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            {...register("fullName")}
                        />
                        {errors.fullName && (
                            <span className="text-sm text-red-500">{errors.fullName.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="physicalAddress">Physical Address</Label>
                        <Input
                            id="physicalAddress"
                            placeholder="Enter your physical address"
                            {...register("physicalAddress")}
                        />
                        {errors.physicalAddress && (
                            <span className="text-sm text-red-500">{errors.physicalAddress.message}</span>
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
                            <span className="text-sm text-red-500">{errors.userName.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="identityNumber">Identity Number</Label>
                        <Input
                            id="identityNumber"
                            placeholder="16 digits"
                            {...register("identityNumber", {
                                pattern: {
                                    value: /^\d{16}$/,
                                    message: "Identity number must be exactly 16 digits"
                                }
                            })}
                        />
                        {errors.identityNumber && (
                            <span className="text-sm text-red-500">{errors.identityNumber.message}</span>
                        )}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="ktp">Identity File</Label>
                        <Dropzone
                            onDrop={handleDrop}
                            onError={handleError}
                            disabled={isLoading}
                            maxFiles={1}
                            maxSize={5 * 1024 * 1024} // 5MB
                        >
                            <DropzoneContent>
                                <p>Drag and drop your identity file here or click to upload</p>
                                {uploadedFile && (
                                    <p className="text-sm text-green-600 mt-2">✓ File uploaded successfully</p>
                                )}
                            </DropzoneContent>
                        </Dropzone>
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
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 