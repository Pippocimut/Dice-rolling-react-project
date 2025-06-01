import './App.css'
import {Main} from "./pages/main";
import {ToastContainer} from "react-toastify";
import {CookiesProvider} from "react-cookie";

function App() {
    return (
        <>
            <ToastContainer/>
            <Main/>
        </>
    )
}

export default App
