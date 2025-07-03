import {configureStore} from "@reduxjs/toolkit";
import buttonSetReducer from "./buttonSets/buttonSetSlice.ts"

export const store = configureStore({
    reducer: {
        buttonSet: buttonSetReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch