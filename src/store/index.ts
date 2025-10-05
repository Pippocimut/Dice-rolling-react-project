import {configureStore} from "@reduxjs/toolkit";
import buttonSetReducer from "./button-sets/buttonSetSlice.ts"
import exportMenuReducer from "./export-menu/exportMenuSlice.ts"
import historySidebarReducer from "./history-sidebar/historySidebarSlice.ts";
import selectedReducer from "./selected/selectedSlice.ts";
import socketReducer from "./socket/socketSlice.ts";
import settingsReducer from "./settings/settingsSlice.ts";

export const store = configureStore({
    reducer: {
        buttonSet: buttonSetReducer,
        exportMenu: exportMenuReducer,
        historySidebar: historySidebarReducer,
        selected: selectedReducer,
        socket: socketReducer,
        settings: settingsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch