import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {CookiesProvider} from "react-cookie";
import {Provider} from 'react-redux'
import {store} from './store'
import {Slide, ToastContainer} from "react-toastify";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CookiesProvider defaultSetOptions={{path: "/"}}>
            <Provider store={store}>
                <ToastContainer position="bottom-left"
                                newestOnTop={false}
                                transition={Slide}
                                stacked/>
                <App/>
            </Provider>
        </CookiesProvider>
    </StrictMode>
);
