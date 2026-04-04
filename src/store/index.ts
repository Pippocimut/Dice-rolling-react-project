import { configureStore } from "@reduxjs/toolkit";
import buttonSetReducer from "./button-sets/buttonSetSlice.ts"
import historySidebarReducer from "./historySidebarSlice.ts";
import exportMenuReducer from "./exportMenuSlice.ts";
import selectedReducer from "./selectedSlice.ts";
import socketReducer from "./socketSlice.ts";
import settingsReducer from "./settingsSlice.ts";
import buttonManageReducer from "./buttonManageSlice.ts";

export const store = configureStore({
    reducer: {
        buttonSet: buttonSetReducer,
        exportMenu: exportMenuReducer,
        historySidebar: historySidebarReducer,
        selected: selectedReducer,
        socket: socketReducer,
        settings: settingsReducer,
        buttonManage: buttonManageReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = import("@reduxjs/toolkit").ThunkAction<
    ReturnType,
    RootState,
    unknown,
    import("@reduxjs/toolkit").Action
>