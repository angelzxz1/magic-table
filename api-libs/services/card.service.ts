import { db } from "@/lib/db";

export const addCardToDeck = async (
    name: string,
    deckId: string,
    imgUrl: string
) => {
    return db.card.create({
        data: { imgUrl, scryfallId: deckId, name },
    });
};

export const getCardsFromDeck = async (deckId: string) => {
    return db.card.findMany({
        where: { id: deckId },
    });
};
