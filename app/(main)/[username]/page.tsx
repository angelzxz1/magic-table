"use client";
import { UserUpdate } from "@/components/ui/update-data";
import { UserAvatar } from "@/components/ui/user-avatar";
import { User } from "@/lib/generated/prisma";
import { useAppSelector } from "@/store/hooks";
export default function Page() {
    const user: User | null = useAppSelector((state) => state.user.user);
    if (!user) {
        return <></>;
    }
    const { firstName, lastName, thumbnailUrl, username, email } = user;
    return (
        <div className="w-full h-full flex flex-col items-start">
            <div className="w-full flex justify-end border-b bg-neutral-900 p-8 ">
                <UserAvatar />
            </div>
            <div className="w-full flex bg-neutral-800 items-start p-8 ">
                <UserUpdate user={user} />
            </div>
        </div>
    );
}
