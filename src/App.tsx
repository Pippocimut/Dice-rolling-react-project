import "./App.css";
import {Main} from "./pages";
import {Slide, ToastContainer} from "react-toastify";
import {StrictMode} from "react";
import "./index.css";
import {AppProvider} from "@/AppProvider.tsx";
import {AppRouter} from "@/AppRouter.tsx";

function App() {
    return (
        <StrictMode>
            <AppProvider>
                <AppRouter>
                    <ToastContainer position={"bottom-center"}
                                    newestOnTop={false}
                                    transition={Slide}
                                    stacked/>
                    <Main/>
                </AppRouter>
            </AppProvider>
        </StrictMode>
    )
}

export default App;
