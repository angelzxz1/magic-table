"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { add } from "@/store/features/decks/decksSlice";
export const DeckProvider = ({ children }: { children: React.ReactNode }) => {
    // const [isSession, setIsSession] = useState<boolean>(false);
    const [deckFetched, setDeckFetched] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { deckList } = useAppSelector((state) => state.decks);
    const { user } = useAppSelector((state) => state.user);
    useEffect(() => {
        async function getDeckList() {
            try {
                const res = await fetch("/api/decks");
                const data = await res.json();
                console.log(data);
                setDeckFetched(true);
            } catch (e) {
                console.log("Error pai: ", e);
            }

            // if (res.status !== 200) {
            //     // console.log("Access denied, redirecting to login");
            //     redirect("/login");|
            // } else {
            //     const data = await res.json();
            //     dispatch(setSession(data.session));
            //     dispatch(setUser(data.user));
            //     // setIsSession(true);
            // }
        }
        getDeckList();
    }, []);

    if (!deckFetched) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }
    return <>{children}</>;
};
