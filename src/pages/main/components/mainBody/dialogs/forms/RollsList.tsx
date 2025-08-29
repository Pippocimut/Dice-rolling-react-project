import {useCallback} from "react";
import type {Roll} from "../../../../types";
import {RollCard} from "@/pages/main/components/mainBody/dialogs/forms/RollCard.tsx";

type Props = {
    rolls: Roll[];
    setRolls: (rolls: Roll[]) => void;
}

const RollsList = ({
                       rolls,
                       setRolls,
                   }: Props) => {

    const handleDeleteRoll = useCallback(
        (index: number) => {
            return () => setRolls(rolls.filter((_, i) => i !== index));
        },
        [setRolls, rolls]
    );

    const handleUpdateRoll = useCallback(
        (index: number) => {
            return (newRoll: Roll) => {
                setRolls(rolls.map((roll, i) => (i === index ? newRoll : roll)));
            }
        }, [rolls])

    return (
        <div className={"flex flex-col gap-2 w-fit m-4"}>
            {rolls.map((roll, index) => (
                <RollCard
                    key={index}
                    index={index}
                    roll={roll}
                    handleDeleteRoll={handleDeleteRoll(index)}
                    handleUpdateRoll={handleUpdateRoll(index)}
                />
            ))}
        </div>
    );
};

export default RollsList;
