"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
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
import { SingleImageDropzoneUsage } from "../update-image-dialog/dialog";

export const UserAvatar = () => {
    const user = useAppSelector((state) => state.user.user);
    if (!user) {
        return <></>;
    }
    const { firstName, lastName, thumbnailUrl, username } = user;
    const initials = `${firstName.charAt(0)}${lastName.charAt(
        0
    )}`.toUpperCase();

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-full w-full">
                <Avatar className="w-16 h-16 mb-4">
                    <Dialog>
                        {thumbnailUrl === "" ? (
                            <DialogTrigger asChild>
                                <AvatarFallback className="cursor-pointer hover:border-2 transition-all duration-100 ease-in-out ">
                                    {initials}
                                </AvatarFallback>
                            </DialogTrigger>
                        ) : (
                            <DialogTrigger asChild>
                                <AvatarImage
                                    src={thumbnailUrl}
                                    alt="Avatar"
                                    className="cursor-pointer"
                                />
                            </DialogTrigger>
                        )}

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex justify-center">
                                    Update Picture
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 justify-center">
                                <SingleImageDropzoneUsage userId={user.id} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </Avatar>
                <h1 className="text-2xl font-bold">{username}</h1>
            </div>
        </div>
    );
};
