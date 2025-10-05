import {MainInfo} from "@/pages/main/components/mainBody/MainInfo";
import {ActionButtons} from "@/pages/main/components/mainBody/MainActionButtons.tsx";
import ButtonLists from "@/pages/main/components/mainBody/ButtonList/ButtonLists.tsx";
import {AudioToggle} from "@/pages/main/components/NavHeader/AudioToggle.tsx";

export function RollCupPage() {
    return  <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center"}>
        <MainInfo/>
        <ActionButtons/>
        <AudioToggle/>
        <ButtonLists/>
    </div>
}