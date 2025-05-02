import { createSlice } from "@reduxjs/toolkit";
import { Session } from "@/lib/generated/prisma";

export const sessionSlice = createSlice({
    name: "user",
    initialState: {
        session: null as Session | null,
    },
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
        },
        clearSession: (state) => {
            state.session = null;
        },
    },
});

export const { clearSession, setSession } = sessionSlice.actions;
export type UserState = {
    session: Session | null;
};
export default sessionSlice.reducer;
