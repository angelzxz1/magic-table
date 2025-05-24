import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { Card as CardDB, Deck } from "./generated/prisma";

type DataNeded = {
    color_identity: string[];
    colors: string[];
    game_changer: boolean;
    id: string;
    image_uris: {
        art_crop: string;
        border_crop: string;
        large: string;
        normal: string;
        png: string;
        small: string;
    };
    keywords: string[];
    mana_cost: string;
    name: string;
    set: string;
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function replaceSpacesWithPlus(input: string): string {
    return input.replace(/\s+/g, "+");
}
export type Card = {
    quantity: number;
    name: string;
    setCode: string;
};
export const parseDeckList = (input: string): Card[] => {
    return input
        .split("\n")
        .map((line) => line.trim()) // elimina espacios innecesarios
        .filter((line) => line.length > 0) // omite líneas vacías
        .map((line) => {
            const match = line.match(/^(\d+)\s+(.+)\s+\((\w+)\)$/);
            if (!match) {
                throw new Error(`Línea inválida: "${line}"`);
            }
            const [, quantity, name, setCode] = match;
            return {
                quantity: parseInt(quantity),
                name,
                setCode,
            };
        });
};

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

type DecksResponse = {
    message: string;
    card: CardDB;
};
type notFoundType = {
    quantity: number;
    name: string;
    setCode: string;
    error: boolean;
    data: null;
};
type fetchCardDataType = {
    results: CardDB[];
    notFound: notFoundType[];
};
type AddCardToDBType = {
    name: string;
    setCode: string;
    quantity: number;
};
const addCardToDB = async ({
    name,
    setCode,
    quantity,
}: AddCardToDBType): Promise<CardDB | notFoundType> => {
    const encodedName = replaceSpacesWithPlus(name);
    const url = `https://api.scryfall.com/cards/named?fuzzy=${encodedName}&set=${setCode}`;

    try {
        const response = await axios.get(url);
        const {
            mana_cost,
            image_uris,
            name,
            id,
            card_faces,
            set: setCode,
        } = response.data;
        if (!card_faces) {
            const { large } = image_uris;
            const addedCardRes = await axios.post("/api/cards", {
                imgUrl: large,
                name,
                scryfallId: id,
                manaCost: mana_cost,
                setCode,
            });
            const { card }: DecksResponse = addedCardRes.data;
            return card;
        } else {
            const [face1, face2] = card_faces;
            const { image_uris: f1_Uris, manaCost: mc1 } = face1;
            const { image_uris: f2_Uris, manaCost: mc2 } = face2;
            const { large: f1_large } = f1_Uris;
            const { large: f2_large } = f2_Uris;
            const addedCardRes = await axios.post("/api/cards", {
                imgUrl: f1_large,
                secondUrl: f2_large,
                name,
                scryfallId: id,
                manaCost: mc1,
                secondManaCost: mc2,
            });
            const { card }: DecksResponse = addedCardRes.data;
            return card;
        }
    } catch (error) {
        console.error(`Error al obtener ${name} (${setCode})`, error);
        return {
            name,
            setCode,
            quantity,
            error: true,
            data: null,
        };
    }
};
export async function fetchCardData(cards: Card[]): Promise<fetchCardDataType> {
    const results: CardDB[] = [];
    const notFound: notFoundType[] = [];
    for (const cardItem of cards) {
        const { name, quantity, setCode } = cardItem;
        const cardInDB = await findCard({ name, setCode });
        if (!cardInDB) {
            const cardToAdd = await addCardToDB({ name, setCode, quantity });
            if (Object.keys(cardToAdd).includes("error")) {
                notFound.push(cardToAdd as notFoundType);
            } else {
                results.push(cardToAdd as CardDB);
            }
            // Esperar 100 ms antes de continuar
            await sleep(50);
        } else {
            results.push(cardInDB);
        }
    }

    return { results, notFound };
}

export const createDeck = async ({
    DeckList,
    userId,
    commander,
    deckName,
}: {
    DeckList: CardDB[];
    userId: string;
    commander: String;
    deckName: String;
}) => {
    try {
        const deckRes = await axios.post<{ message: string; deck: Deck }>(
            "/api/decks/deck",
            {
                userId,
                commander,
                deckName,
                DeckList,
            }
        );
        const { data } = deckRes;
        console.log(data);
        DeckList.forEach((card) => {});
    } catch (error) {
        console.log("Error Creating Deck: ", error);
    }
};
const findCard = async ({
    name,
    setCode,
}: {
    name: string;
    setCode: string;
}): Promise<CardDB | null> => {
    try {
        const res = await axios.get<{ card: CardDB }>("/api/cards", {
            params: {
                name,
                setCode,
            },
        });
        const { data } = res;
        if (!data) return null;
        const { card } = data;
        if (!card) return null;
        return card;
    } catch (e) {
        console.log("Error finding card in DB");
        return null;
    }
};
