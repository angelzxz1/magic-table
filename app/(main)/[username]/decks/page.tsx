"use client";
import { AddNewDeck } from "@/components/ui/deck-add/deck-add-dialog";
import { DeckListType } from "@/store/features/decks/decksSlice";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
const ShowDeck = ({ deck }: { deck: DeckListType }) => {
    return (
        <div className="w-72 h-72 relative overflow-hidden rounded-md flex justify-between items-center select-none">
            <div className="cursor-pointer absolute z-20 peer h-full w-full hover:backdrop-blur-sm transition-all duration-200 ease-in-out flex justify-end items-end group bg-neutral-900/40">
                <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out font-black p-2 ">
                    <div className="">
                        Deck name:{" "}
                        {deck.name.charAt(0).toUpperCase() +
                            deck.name.slice(1).toLowerCase()}
                    </div>
                    <div>Commander: {deck.commander.name}</div>
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

const Decks = () => {
    const { deckInfo } = useAppSelector((state) => state.decks);
    return (
        <div className="w-full h-full flex">
            <div className="w-full flex-1 pt-8 gap-8 flex flex-col">
                {deckInfo.length !== 0 ? (
                    <>
                        <div className="w-full">
                            <AddNewDeck />
                        </div>
                        <div>
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
