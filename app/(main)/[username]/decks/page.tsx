"use client";
import { DecksResponse } from "@/components/deck-provider";
import { Button } from "@/components/ui/button";
import { AddNewDeck } from "@/components/ui/deck-add/deck-add-dialog";
import { add, remove, DeckListType } from "@/store/features/decks/decksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
const ShowDeck = ({ deck }: { deck: DeckListType }) => {
    const router = useRouter();
    return (
        <div
            className="w-72 h-72 relative overflow-hidden rounded-md flex justify-between items-center select-none
            border border-neutral-600
        "
        >
            <div
                className="cursor-pointer absolute z-20 peer h-full w-full hover:backdrop-blur-sm transition-all duration-200 ease-in-out flex justify-end items-end group bg-transparent hover:bg-neutral-900/40"
                onClick={() => router.push(`decks/${deck.id}`)}
            >
                <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out font-black w-full py-2">
                    <div className="w-full flex justify-end bg-neutral-900/60 px-2">
                        {deck.name.charAt(0).toUpperCase() +
                            deck.name.slice(1).toLowerCase()}
                    </div>
                </div>
            </div>
            <Image
                alt={deck.name}
                src={deck.commander.artCropUrl}
                width={288}
                height={288}
                className="object-cover w-full h-full peer-hover:scale-125 peer-active:scale-105 transition-all duration-200 ease-in-out z-10"
            />
        </div>
    );
};

const Refresh = () => {
    const { deckInfo } = useAppSelector((state) => state.decks);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    return (
        <Button
            variant="outline"
            className="cursor-pointer"
            disabled={loading}
            onClick={async () => {
                try {
                    setLoading(true);
                    toast.info("Refreshing decks...");
                    const res = await fetch("/api/decks");
                    if (!res.ok) {
                        throw new Error("Failed to fetch decks");
                    }
                    const data: DecksResponse = await res.json();
                    const { decks } = data;
                    if (decks.length === 0) {
                        toast.info("No decks found.");
                        setLoading(false);
                        return;
                    }
                    // Clear existing decks in the state
                    if (deckInfo.length === decks.length) {
                        toast.info("No new decks to add.");
                        setLoading(false);
                        return;
                    }
                    // Remove decks that are not in the fetched data
                    deckInfo.forEach((deck) => {
                        const exists = decks.some((d) => d.id === deck.id);
                        if (!exists) {
                            dispatch(remove(deck.id));
                            toast.success(
                                `Deck "${deck.name}" removed successfully!`
                            );
                        }
                    });
                    // Add new decks from the fetched data
                    data.decks.forEach((deck) => {
                        // Check if the deck already exists in the state
                        const exists = deckInfo.some((d) => d.id === deck.id);
                        if (!exists) {
                            dispatch(add(deck));
                            toast.success(
                                `Deck "${deck.name}" added successfully!`
                            );
                        }
                    });
                } catch (error) {
                    console.error("Error fetching decks:", error);
                    // Optionally, you can dispatch an action to handle the error state
                    toast.error("Failed to refresh decks. Please try again.");
                } finally {
                    // Reset loading state after fetching
                    setLoading(false);
                }
            }}
        >
            Refresh <RefreshCw className={loading ? "animate-spin" : ""} />
        </Button>
    );
};

const Decks = () => {
    const { deckInfo } = useAppSelector((state) => state.decks);
    return (
        <div className="w-full h-full flex ">
            <div className="w-full flex-1 pt-8 gap-8 flex flex-col">
                {deckInfo.length !== 0 ? (
                    <>
                        <div className="w-full flex gap-4 items-center px-4">
                            <AddNewDeck />
                            <Refresh />
                        </div>
                        <div className="flex gap-4 bg-neutral-800 p-4 rounded-md flex-wrap min-h-4/5">
                            {deckInfo.map((item) => {
                                const { id } = item;
                                return <ShowDeck key={id} deck={item} />;
                            })}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        <AddNewDeck />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Decks;
