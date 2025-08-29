import "./App.css";
import {Main} from "./pages/main";
import {store} from "@/store";
import {Slide, ToastContainer} from "react-toastify";
import {StrictMode} from "react";
import "./index.css";
import {CookiesProvider} from "react-cookie";
import {Provider} from 'react-redux'
import {SocketProvider} from "@/context/SocketContextProvider.tsx";

function App() {
    return (
        <StrictMode>
            <CookiesProvider defaultSetOptions={{path: "/"}}>
                <Provider store={store}>
                    <ToastContainer position="bottom-left"
                                    newestOnTop={false}
                                    transition={Slide}
                                    stacked/>
                    <SocketProvider>
                        <Main/>
                    </SocketProvider>
                </Provider>
            </CookiesProvider>
        </StrictMode>
    )
}

export default App;
