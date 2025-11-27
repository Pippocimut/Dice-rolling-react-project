import {EditRollDialog} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EditRollDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Roll} from "@/store/button-sets/buttonSetSlice.ts";

type Props = {
    index: number;
    roll: Roll;
    handleDeleteRoll: () => void;
    handleUpdateRoll: (roll: Roll) => void;
}

export function RollCard({index, roll, handleDeleteRoll, handleUpdateRoll}: Props) {

    const equation: string = Object.values(roll.equations).reduce((acc, q) => acc + q.formula+"+", "").slice(0,-1);

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
                <EditRollDialog roll={roll} updateRoll={handleUpdateRoll} />
                {equation.length > 20
                    ? equation.substring(0, 20) + "..."
                    : equation}{" "}

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