"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
const DecksData = () => {
    return <></>;
};
const Decks = () => {
    const { deckList } = useAppSelector((state) => state.decks);
    return (
        <div className="w-full">
            <div className="w-full h-52 bg-blue-900">
                <DecksData />
            </div>
            <div className="w-full ">
                {deckList.length !== 0 ? <div>si</div> : <div>no</div>}
            </div>
        </div>
    );
};

export default Decks;
