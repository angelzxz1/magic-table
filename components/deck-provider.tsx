"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { add, DeckListType } from "@/store/features/decks/decksSlice";

type DecksResponse = {
    message: string;
    decks: DeckListType[];
};
export const DeckProvider = ({ children }: { children: React.ReactNode }) => {
    let loads = 0;
    // const [isSession, setIsSession] = useState<boolean>(false);
    const [deckFetched, setDeckFetched] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    // const { refresh } = useRouter();
    // const { deckList } = useAppSelector((state) => state.decks);
    // const { user } = useAppSelector((state) => state.user);
    useEffect(() => {
        async function getDeckList() {
            loads++;
            console.log("Decks loads: ", loads);
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
