import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/features/user/userSlice";
import sessionReducer from "@/store/features/session/sessionSlice";
import decksReducer from "@/store/features/decks/decksSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        session: sessionReducer,
        decks: decksReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
