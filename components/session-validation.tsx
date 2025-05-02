"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/features/session/sessionSlice";
import { setUser } from "@/store/features/user/userSlice";
export const CheckSession = ({ children }: { children: React.ReactNode }) => {
    // const [isSession, setIsSession] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const session = useAppSelector((state) => state.session.session);
    useEffect(() => {
        async function fetchCookie() {
            const res = await fetch("/api/cookie");
            if (res.status !== 200) {
                // console.log("Access denied, redirecting to login");
                redirect("/login");
            } else {
                const data = await res.json();
                dispatch(setSession(data.session));
                dispatch(setUser(data.user));
                // setIsSession(true);
            }
        }
        if (!session) {
            fetchCookie();
        } else {
            // console.log("Session already exists, no need to fetch cookie");
            // setIsSession(true);
        }
    }, []);

    if (!session) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }
    return <>{children}</>;
};
