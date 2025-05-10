import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "@/lib/generated/prisma";

export const deckSlice = createSlice({
    name: "user",
    initialState: {
        deckList: [] as Deck[],
    },
    reducers: {
        add: (state, action: PayloadAction<Deck>) => {
            state.deckList.push(action.payload);
        },
        remove: (state, action: PayloadAction<string>) => {
            const newList = state.deckList.filter(
                (deck) => deck.id !== action.payload
            );
            state.deckList = newList;
        },
    },
});

export const { add, remove } = deckSlice.actions;
export type DeckState = {
    deckList: Deck[];
};
export default deckSlice.reducer;
