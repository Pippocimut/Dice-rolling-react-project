import { EditTriggerDialog } from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EditRollDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { TRIGGER_REGISTRY, type TriggerHandler } from "@/components/TriggerRegistry/triggerRegistry.tsx";

type Props = {
    index: number;
    trigger: Trigger;
    handleDeleteRoll: () => void;
    handleUpdateRoll: (trigger: Trigger) => void;
}

export function TriggerCard({ index, trigger, handleDeleteRoll, handleUpdateRoll }: Props) {
    const { CardComponent } = TRIGGER_REGISTRY[trigger.type] as TriggerHandler<Trigger>;
    console.log("Rendering card for trigger", trigger)

    return (
        <div
            key={index}
            className="flex flex-col w-full justify-start items-center p-2 border-1 border-neutral-200 rounded-lg shadow-sm"
        >
            <div className="flex flex-row gap-2 w-full justify-between items-center">
                <div className="flex flex-row gap-4 justify-start items-center">
                    <EditTriggerDialog trigger={trigger} updateTrigger={handleUpdateRoll} />
                    <CardComponent trigger={trigger} />
                </div>
                <Button
                    className="text-danger w-1 h-2 ml-auto"
                    variant="empty"
                    onClick={handleDeleteRoll}
                >
                    ✕
                </Button>
            </div>
        </div>
    );
}
