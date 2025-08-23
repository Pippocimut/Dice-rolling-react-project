import type {Roll} from "../../../../types.ts";
import {useState} from "react";
import RollForm from "./RollForm.tsx";

type Props = {
    createRoll: (roll: Roll) => void;
};

const CreateRollForm = ({createRoll}: Props) => {
    const [roll, updateRoll] = useState<Roll>({
        name: "New roll",
        equation: `${1}d${20}+0`,
    });

    return (<RollForm roll={roll} updateRoll={updateRoll}>
            <button
                className={"p-4 m-4 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"}
                onClick={() => {
                    createRoll(roll);
                }}
            >
                Add Roll
            </button>
        </RollForm>
    );
};

export default CreateRollForm;