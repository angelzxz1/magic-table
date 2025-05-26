import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card, Deck } from "@/lib/generated/prisma";

export interface DeckListType extends Deck {
    commander: Card;
}
export const deckSlice = createSlice({
    name: "decks",
    initialState: {
        deckInfo: [] as DeckListType[],
    },
    reducers: {
        add: (state, action: PayloadAction<DeckListType>) => {
            // Check if the deck already exists
            const existingDeck = state.deckInfo.find(
                (deck) => deck.id === action.payload.id
            );
            // If it exists, do not add it again
            if (existingDeck) {
                console.warn(
                    `Deck with ID ${action.payload.id} already exists. Not adding again.`
                );
                return;
            }
            state.deckInfo.push(action.payload);
        },
        remove: (state, action: PayloadAction<string>) => {
            const newList = state.deckInfo.filter(
                (deck) => deck.id !== action.payload
            );
            state.deckInfo = newList;
        },
    },
});

export const { add, remove } = deckSlice.actions;
export type DeckState = {
    deckList: Deck[];
};
export default deckSlice.reducer;
