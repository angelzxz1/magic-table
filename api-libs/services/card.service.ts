import { db } from "@/lib/db";

export const addCardToDeck = async (deckId: string, cardId: string) => {
    return db.deckCard.create({
        data: { deckId, cardId },
    });
};

export const getCardsFromDeck = async (deckId: string) => {
    return db.card.findMany({
        where: { id: deckId },
    });
};
