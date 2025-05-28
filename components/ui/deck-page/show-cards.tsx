import { Card, DeckCard } from "@/lib/generated/prisma";
import { CardComp } from "./card";
interface deckListType extends DeckCard {
    card: Card;
}
export const ShowCards = ({ deckList }: { deckList: deckListType[] }) => {
    const cardList = deckList.map((card) => {
        return { card: card.card, count: card.count };
    });
    const typeLines = extractUniqueTypeLines(cardList.map((card) => card.card));
    const typeLists = generateTypeLists(cardList, typeLines);
    console.log("Type lists:", typeLists);
    return (
        <div className="flex flex-col w-full ">
            <div className="flex w-full justify-between items-start mt-4 pt-4 gap-2 bg-neutral-800 px-4 rounded-md border border-neutral-700 pb-64">
                {Object.entries(typeLists).map(([typeLine, cards]) => {
                    return (
                        <div
                            key={typeLine}
                            className="flex flex-col gap-2 h-full w-full "
                        >
                            <h2 className="font-bold w-full ml-2">
                                {`${
                                    typeLine.charAt(0).toUpperCase() +
                                    typeLine.slice(1).toLowerCase()
                                }: ${cards.length}`}
                            </h2>
                            <div className="h-full w-full">
                                {cards.map((cardData) => {
                                    const { card, count } = cardData;

                                    return (
                                        <CardComp
                                            key={card.id}
                                            url={card.imgUrl}
                                            secondURL={card.secondUrl}
                                            amount={count}
                                            name={card.name}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function extractUniqueTypeLines(cards: Card[]): string[] {
    const typeLineSet = new Set<string>();

    for (const card of cards) {
        if (card.typeLine) {
            typeLineSet.add(card.typeLine);
        }
    }

    return Array.from(typeLineSet);
}

function generateTypeLists(
    cards: { card: Card; count: number }[],
    typeLines: string[]
): { [key: string]: { card: Card; count: number }[] } {
    const typeLists: { [key: string]: { card: Card; count: number }[] } = {};

    for (const typeLine of typeLines) {
        typeLists[typeLine] = cards.filter(
            (card) => card.card.typeLine === typeLine
        );
    }

    return typeLists;
}
