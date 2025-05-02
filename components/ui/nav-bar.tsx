"use client";

import { Cog, LogOut, MenuIcon, PackageOpen, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearSession } from "@/store/features/session/sessionSlice";
import { clearUser } from "@/store/features/user/userSlice";

const Circle = ({
    children,
    show = false,
    top,
    expand = true,
    onClick,
    text,
    href = "#",
    index = 0,
}: {
    children: React.ReactNode;
    show?: boolean;
    index?: number;
    top?: string;
    expand?: boolean;
    onClick?: () => void;
    text?: string;
    href?: string;
}) => {
    if (expand) {
        return (
            <div
                className={`absolute flex ${
                    show ? `right-12 ${top}` : "right-0 top-0"
                }  ease-in-out`}
                style={{
                    transitionDelay: `${index * 50}ms`,
                    transitionDuration: "200ms",
                }}
                onClick={onClick}
            >
                <Link
                    className="border-1 border-white rounded-full p-2 cursor-pointer bg-black flex items-center justify-evenly hover:w-28 group"
                    href={`${href}`}
                >
                    {children}
                    <div className="group-hover:flex hidden">{text}</div>
                </Link>
            </div>
        );
    }
    return (
        <div
            className="absolute right-0 top-0 flex items-center justify-center"
            onClick={onClick}
        >
            <div className="border-1 border-white rounded-full p-2 cursor-pointer bg-black flex items-center justify-evenly">
                {children}
            </div>
        </div>
    );
};

export const NavBar = () => {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.user);
    const [show, setShow] = useState(false);
    const dispatch = useAppDispatch();

    const navRef = useRef<HTMLDivElement>(null);

    const toggleExpand = () => {
        setShow(!show);
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/user/logout", {});
            dispatch(clearSession());
            dispatch(clearUser());
            router.refresh();
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node)
            ) {
                setShow(false); // Cierra el menú
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-5 right-5 z-50 rounded-full">
            <nav className="relative w-10 h-10 " ref={navRef}>
                <Circle
                    show={show}
                    top="top-0"
                    text="Profile"
                    href={`/${user?.username}`}
                >
                    <User />
                </Circle>
                <Circle
                    show={show}
                    top="top-12"
                    index={1}
                    text="Decks"
                    href="/decks"
                >
                    <PackageOpen />
                </Circle>
                <Circle
                    show={show}
                    top="top-24"
                    index={2}
                    text="Settings"
                    href="/settings"
                >
                    <Cog />
                </Circle>
                <Circle
                    show={show}
                    top="top-36"
                    index={3}
                    text="Log Out"
                    onClick={handleLogout}
                >
                    <LogOut />
                </Circle>

                <Circle expand={false} onClick={toggleExpand}>
                    <MenuIcon className="z-50" />
                </Circle>
            </nav>
        </div>
    );
};
