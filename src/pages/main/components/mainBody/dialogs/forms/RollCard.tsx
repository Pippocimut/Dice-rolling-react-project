import { EditTriggerDialog } from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EditRollDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import type { PropsWithChildren } from "react";

type Props = {
    index: number;
    trigger: Trigger;
    handleDeleteRoll: () => void;
    handleUpdateRoll: (roll: Trigger) => void;
}

export function TriggerCard({ index, trigger: roll, handleDeleteRoll, handleUpdateRoll }: Props) {
    if (roll.type === "roll") {
        return <RollTriggerCard index={index} trigger={roll} handleDeleteRoll={handleDeleteRoll} handleUpdateRoll={handleUpdateRoll} />
    }

    if (roll.type === "text") {
        return <TextTriggerCard index={index} trigger={roll} handleDeleteRoll={handleDeleteRoll} handleUpdateRoll={handleUpdateRoll} />
    }

    return null;

}

function BaseTriggerCard({ index, trigger, handleDeleteRoll, handleUpdateRoll, children }: PropsWithChildren<Props>) {
    return (<div
        key={index}
        className={
            "flex flex-col w-full justify-start items-center p-2 border-1 border-neutral-200 rounded-lg shadow-sm"
        }>

        <div
            className={
                "flex flex-row gap-2 w-full justify-between items-center"
            }>
            <div className={"flex flex-row gap-4 justify-start items-center "}>
                <EditTriggerDialog trigger={trigger} updateTrigger={handleUpdateRoll} />
                {children}
            </div>
            <Button className={"text-danger w-1 h-2 ml-auto"} variant={"empty"}
                onClick={() => {
                    handleDeleteRoll();
                }}>
                ✕
            </Button>
        </div>
    </div>)
}

function RollTriggerCard({ index, trigger, handleDeleteRoll, handleUpdateRoll }: Props) {
    if (trigger.type !== "roll") return null;
    const equation: string = Object.values(trigger.equations).reduce((acc, q) => acc + q.formula + "+", "").slice(0, -1);
    return <BaseTriggerCard index={index} trigger={trigger} handleDeleteRoll={handleDeleteRoll} handleUpdateRoll={handleUpdateRoll}>
        {equation.length > 20
            ? equation.substring(0, 20) + "..."
            : equation}{" "}
    </BaseTriggerCard>
}

function TextTriggerCard({ index, trigger, handleDeleteRoll, handleUpdateRoll }: Props) {
    if (trigger.type !== "text") return null;

    const text = trigger.text

    return <BaseTriggerCard index={index} trigger={trigger} handleDeleteRoll={handleDeleteRoll} handleUpdateRoll={handleUpdateRoll}>
        {text.length > 20
            ? text.substring(0, 20) + "..."
            : text}{" "}
    </BaseTriggerCard>
}

