import "./App.css";
import { Main } from "./pages/main";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer newestOnTop={true}/>
      <Main />
    </>
  );
}

export default App;
