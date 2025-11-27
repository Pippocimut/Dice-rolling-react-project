import {type PropsWithChildren} from "react";
import {BrowserRouter} from "react-router-dom";

export function AppRouter({children}: PropsWithChildren) {
    return (
        <BrowserRouter>
                {children}
        </BrowserRouter>
    )
}