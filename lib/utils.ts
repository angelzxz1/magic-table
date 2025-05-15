import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { db } from "./db";

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
    set: string;
};
export const parseDeckList = (input: string): Card[] => {
    return input
        .split("\n") // separa por líneas
        .map((line) => line.trim()) // elimina espacios innecesarios
        .filter((line) => line.length > 0) // omite líneas vacías
        .map((line) => {
            const match = line.match(/^(\d+)\s+(.+)\s+\((\w+)\)$/);
            if (!match) {
                throw new Error(`Línea inválida: "${line}"`);
            }
            const [, quantity, name, set] = match;
            return {
                quantity: parseInt(quantity),
                name,
                set,
            };
        });
};

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCardData(cards: Card[]) {
    const results = [];

    for (const card of cards) {
        const cardInDB = await findCard(card.name);
        console.log("La carta es: ", cardInDB);
        if (!cardInDB) {
            const encodedName = replaceSpacesWithPlus(card.name);
            const url = `https://api.scryfall.com/cards/named?fuzzy=${encodedName}&set=${card.set}`;

            try {
                const response = await axios.get(url);
                const { mana_cost, image_uris, name, id } =
                    response.data as DataNeded;
                const { large } = image_uris;
                const addedCardRes = await axios.post("/api/cards", {
                    imgUrl: large,
                    name,
                    scryfallId: id,
                    manaCost: mana_cost,
                });
                console.log(addedCardRes.data);
                results.push(addedCardRes.data);
            } catch (error) {
                console.error(
                    `Error al obtener ${card.name} (${card.set})`,
                    error
                );
                results.push({
                    ...card,
                    error: true,
                    data: null,
                });
            }

            // Esperar 100 ms antes de continuar
            await sleep(100);
        } else {
            console.log("entra al true");
            results.push(cardInDB);
        }
    }

    return results;
}

const findCard = async (name: string) => {
    try {
        const card = await axios.get("/api/cards", {
            params: {
                name,
            },
        });

        return card;
    } catch (e) {
        console.log("Error finding card in DB");
        return null;
    }
};
