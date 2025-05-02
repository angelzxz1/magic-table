import { db } from "@/lib/db";

export const getDecksByUser = async (userId: string) => {
    return db.deck.findMany({
        where: { userId },
        include: { cards: true },
    });
};

export const createDeck = async (
    userId: string,
    name: string,
    format: string
) => {
    return db.deck.create({
        data: { name, format, userId },
    });
};
