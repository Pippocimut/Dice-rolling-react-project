import {type PropsWithChildren} from "react";
import {Provider} from "react-redux";
import {store} from "@/store";
import {SocketProvider} from "@/context/SocketContextProvider.tsx";

export function AppProvider({children}: PropsWithChildren) {
    return (
        <Provider store={store}>
            <SocketProvider>
                {children}
            </SocketProvider>
        </Provider>
    )
}