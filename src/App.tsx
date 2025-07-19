import "./App.css";
import {Main} from "./pages/main";
import {ToastContainer} from "react-toastify";
import {SocketProvider} from "./context/SocketContextProvider.tsx";

function App() {
    return (
        <>
            <SocketProvider>
                <ToastContainer newestOnTop={true}/>
                <Main/>
            </SocketProvider>
        </>
    );
}

export default App;
