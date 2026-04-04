import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { ButtonTrigger } from "@/store/button-sets/buttonSetSlice";

export const ButtonTriggerCard: React.FC<{ trigger: ButtonTrigger }> = ({ trigger }) => {
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId);
    const targetButton = useSelector(
        (state: RootState) => state.buttonSet.sets[selectedSetId].buttonList[trigger.targetButtonId]
    );

    return <>→ {targetButton?.name ?? "Unknown"}</>;
};
