import type {Roll} from "../../../../types.ts";
import {useState} from "react";
import RollForm from "./RollForm.tsx";

type Props = {
    index: number;
    roll: Roll;
    updateRoll: (roll: Roll, index: number) => void;
};

const EditRollForm = ({updateRoll,index,roll}: Props) => {

    const [dummyRoll, updateDummyDummyRoll] = useState<Roll>(roll);

    return (<RollForm roll={dummyRoll} updateRoll={updateDummyDummyRoll}>
            <button
                className={"p-4 m-4 border-2 text-white bg-green-500 hover:bg-green-600 rounded-lg"}
                onClick={() => {
                    updateRoll(dummyRoll,index);
                }}
            >
                Update Roll
            </button>
        </RollForm>
    );
};

export default EditRollForm;
