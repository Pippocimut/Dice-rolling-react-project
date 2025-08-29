import ButtonLists from "./ButtonLists.tsx";
import {MainInfo} from "@/pages/main/components/mainBody/MainInfo";
import {ActionButtons} from "@/pages/main/components/mainBody/ActionButtons";

const MainBody = () => {

    return <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center"}>
            <MainInfo/>
            <ActionButtons/>
            <ButtonLists/>
        </div>

};

export default MainBody;