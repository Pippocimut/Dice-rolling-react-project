import MainBody from "./components/mainBody/index.tsx";
import {NavHeader} from "@/pages/main/components/NavHeader";

export function Main() {
    return (
        <div className={"flex flex-col items-stretch h-screen bg-background justify-start"}>
            <NavHeader/>
            <MainBody/>
        </div>
    );
}