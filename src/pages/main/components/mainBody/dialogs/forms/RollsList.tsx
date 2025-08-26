import {useCallback, useState} from "react";
import type {Roll} from "../../../../types";
import {BsPencilFill} from "react-icons/bs";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";
import EditRollForm from "@/pages/main/components/mainBody/dialogs/forms/EditRollForm.tsx";

type Props = {
    rolls: Roll[];
    setRolls: (rolls:Roll[]) => void;
}

const RollsList = ({
                       rolls,
                       setRolls,
                   }: Props) => {
    const handleDeleteRoll = useCallback(
        (index: number) => {
            setRolls( rolls.filter((_, i) => i !== index));
        },
        [setRolls]
    );

    const [selectedRollIndex, setSelectedRollIndex] = useState<number>(-1);
    const [isOpenEditRollDialog, setIsOpenEditRollDialog] = useState(false);

    const handleEditRoll = useCallback(
        (index: number) => {
            setSelectedRollIndex(index);
            setIsOpenEditRollDialog(true);
        },
        [setRolls]
    )

    return (
        <div className={"flex flex-col gap-2 w-full"}>
            {rolls.map((roll, index) => (
                <div
                    key={index}
                    className={
                        "flex flex-col w-full justify-between items-center border-2 border-gray-500 rounded-lg shadow-lg"
                    }
                >
                    <div
                        className={
                            "flex flex-row p-2 gap-2 w-full justify-between items-center"
                        }
                    >
                        <p className={"m-4"}>
                            {" "}
                            <span className={"font-bold"}>{roll.name}</span>:{" "}
                            {roll.equation.length > 20
                                ? roll.equation.substring(0, 25) + "..."
                                : roll.equation}{" "}
                        </p>
                        <div id={"action-buttons"} className={"flex flex-row gap-2"}>
                            <button
                                onClick={() => {
                                    handleEditRoll(index)
                                }}
                                className={"mt-2 w-10 h-10 bg-green-500 text-center items-center flex flex-row justify-center text-white rounded hover:bg-green-600 p-2"}>
                                <BsPencilFill/>
                            </button>
                            <button
                                className={
                                    "mt-2 w-10 bg-[var(--danger)] text-white rounded hover:bg-red-600 p-2"
                                }
                                onClick={() => {
                                    handleDeleteRoll(index);
                                }}
                            >
                                {" "}
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <DefaultDialog isOpen={isOpenEditRollDialog} onClose={() => setIsOpenEditRollDialog(false)}>
                <EditRollForm index={selectedRollIndex} roll={rolls[selectedRollIndex]}
                              updateRoll={(newRoll, index) => {
                                  setRolls(rolls.map((roll, i) => (i === index ? newRoll : roll)));
                                  setIsOpenEditRollDialog(false);
                                  setSelectedRollIndex(-1);
                              }}>

                </EditRollForm>
            </DefaultDialog>
        </div>
    );
};

export default RollsList;
