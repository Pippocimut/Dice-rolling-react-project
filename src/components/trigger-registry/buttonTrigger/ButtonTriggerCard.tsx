import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { ButtonTrigger } from "@/store/button-sets/buttonSetSlice";
import { resolveEntity } from "@/store/button-sets/resolveEntity";

export const ButtonTriggerCard: React.FC<{ trigger: ButtonTrigger }> = ({ trigger }) => {
    const targetButton = useSelector((state: RootState) =>
        trigger.target ? resolveEntity(state, trigger.target) : undefined
    );

    return <>→ {targetButton?.name ?? "None"}</>;
};
