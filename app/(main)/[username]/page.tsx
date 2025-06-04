"use client";
import { ChangePassword } from "@/components/ui/user-edit/change-password";
import { UserUpdate } from "@/components/ui/user-edit/update-data";
import { UserAvatar } from "@/components/ui/user-edit/user-avatar";
import { UserWithoutPassword } from "@/store/features/user/userSlice";
import { useAppSelector } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
    const params = useParams();
    const router = useRouter();
    const [user] = useState<UserWithoutPassword | null>(
        useAppSelector((state) => state.user.user)
    );

    useEffect(() => {
        const checkUser = () => {
            if (!user) {
                router.push("/login");
            }
            if (user && user.username !== params.username) {
                router.push(`/${user.username}`);
            }
        };
        checkUser();
    }, [user, params.username, router]);
    if (!user) {
        return <></>;
    }

    // const { firstName, lastName, thumbnailUrl, username, email } = user;
    return (
        <div className="w-full h-full flex flex-col items-start ">
            <div className="w-full flex justify-end  bg-neutral-900 p-8 ">
                <UserAvatar />
            </div>
            <div className="w-full flex bg-neutral-800 items-start p-8 rounded-2xl ">
                <div className="w-1/2 border-r px-12 h-full">
                    <UserUpdate user={user} />
                </div>
                <div className="w-1/2 border-l px-12 h-full">
                    <ChangePassword />
                </div>
            </div>
        </div>
    );
}
