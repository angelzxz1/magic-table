"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { add } from "@/store/features/decks/decksSlice";
import { Deck } from "@/lib/generated/prisma";

type DecksResponse = {
    message: string;
    decks: Deck[];
};
export const DeckProvider = ({ children }: { children: React.ReactNode }) => {
    // const [isSession, setIsSession] = useState<boolean>(false);
    const [deckFetched, setDeckFetched] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    // const { refresh } = useRouter();
    // const { deckList } = useAppSelector((state) => state.decks);
    // const { user } = useAppSelector((state) => state.user);
    useEffect(() => {
        async function getDeckList() {
            try {
                const res = await fetch("/api/decks");

                if (!res.ok) {
                    redirect("/login");
                }
                const data: DecksResponse = await res.json();
                console.log(data);
                data.decks.forEach((deck) => dispatch(add(deck)));
                setDeckFetched(true);
            } catch (e) {
                console.log("Error pai: ", e);
            }
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
