import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/features/user/userSlice";
import sessionReducer from "@/store/features/session/sessionSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        session: sessionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
