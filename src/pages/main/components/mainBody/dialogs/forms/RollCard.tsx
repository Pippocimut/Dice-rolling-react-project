import {EditRollDialog} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EditRollDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Roll} from "@/pages/main/types";

type Props = {
    index: number;
    roll: Roll;
    handleDeleteRoll: () => void;
    handleUpdateRoll: (roll: Roll) => void;
}

export function RollCard({index, roll, handleDeleteRoll, handleUpdateRoll}: Props) {
    return <div
        key={index}
        className={
            "flex flex-col w-full justify-start items-center p-2 border-1 border-neutral-200 rounded-lg shadow-sm"
        }>

        <div
            className={
                "flex flex-row gap-2 w-full justify-between items-center"
            }>
            <div className={"flex flex-row gap-4 justify-start items-center "}>
                <EditRollDialog roll={roll} updateRoll={handleUpdateRoll}/>
                {roll.equation.length > 20
                    ? roll.equation.substring(0, 20) + "..."
                    : roll.equation}{" "}

            </div>
            <Button className={"text-danger w-1 h-2 ml-auto"} variant={"empty"}
                    onClick={() => {
                        handleDeleteRoll();
                    }}>
                ✕
            </Button>
        </div>
    </div>
}