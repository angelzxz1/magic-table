import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/lib/generated/prisma";

export type UserWithoutPassword = Omit<User, "password">;

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null as UserWithoutPassword | null,
        isLoggedIn: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = !!action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export type UserState = {
    user: UserWithoutPassword | null;
    isLoggedIn: boolean;
};
export default userSlice.reducer;
