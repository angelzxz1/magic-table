"use client";

import { AddNewDeck } from "@/components/ui/deck-add/deck-add-dialog";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
const DecksData = () => {
    return <></>;
};
const Decks = () => {
    const { deckList } = useAppSelector((state) => state.decks);
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-52 ">
                <DecksData />
            </div>
            <div className="w-full flex-1">
                {deckList.length !== 0 ? (
                    <div>si</div>
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
