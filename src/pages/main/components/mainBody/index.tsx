import ButtonLists from "./ButtonLists.tsx";
import {ActionButtons} from "@/pages/main/components/mainBody/ActionButtons.tsx";
import {Info} from "@/pages/main/components/mainBody/Info.tsx";

const MainBody = () => {

    return <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center"}>
            <Info/>
            <ActionButtons/>
            <ButtonLists/>
        </div>

};

export default MainBody;