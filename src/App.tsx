import "./App.css";
import {Main} from "./pages/main";
import {store} from "@/store";
import {Slide, ToastContainer} from "react-toastify";
import {StrictMode} from "react";
import "./index.css";
import {CookiesProvider} from "react-cookie";
import {Provider} from 'react-redux'
import {SocketProvider} from "@/context/SocketContextProvider.tsx";
import {BrowserRouter} from "react-router-dom";

function App() {
    return (
        <StrictMode>
            <BrowserRouter>
                <CookiesProvider defaultSetOptions={{path: "/"}}>
                    <Provider store={store}>
                        <ToastContainer position={"bottom-center"}
                                        newestOnTop={false}
                                        transition={Slide}
                                        stacked/>
                        <SocketProvider>
                            <Main/>
                        </SocketProvider>
                    </Provider>
                </CookiesProvider>
            </BrowserRouter>
        </StrictMode>
    )
}

export default App;
