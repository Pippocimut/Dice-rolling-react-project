import "./App.css";
import {Main} from "./pages/main";
import {SocketProvider} from "./context/SocketContextProvider.tsx";

function App() {
    return (
        <>
            <SocketProvider>
                <Main/>
            </SocketProvider>
        </>
    );
}

export default App;
