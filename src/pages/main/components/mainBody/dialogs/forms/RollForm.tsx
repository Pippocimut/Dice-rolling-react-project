import type {Roll} from "../../../../types.ts";
import {type PropsWithChildren} from "react";

type Props = {
    roll: Roll,
    updateRoll: (roll: Roll) => void;
};

const RollForm = ({roll, updateRoll, children}: PropsWithChildren<Props>) => {
    const labelClassName = "text-left";
    const dieInputClassname = "p-4 w-50 border-2 border-gray-500 rounded-lg text-right";

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({...roll, name: e.target.value});
    };

    const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({...roll, equation: e.target.value});
    };

    return (
        <div className={"flex flex-col gap-2 w-full bg-background text-text justify-center items-center"}>
            <h2 className={"text-3xl font-bold text-center mb-8"}>
                Roll creation form
            </h2>
            <label className={labelClassName}>Roll name: </label>
            <input
                type={"text"}
                placeholder={"Roll Name"}
                value={roll.name}
                className={dieInputClassname}
                onChange={handleNameChange}
            />
            <label className={labelClassName}>Equation: </label>
            <input
                type={"text"}
                placeholder={"Equation"}
                value={roll.equation}
                className={dieInputClassname}
                onChange={handleEquationChange}
            />
            {children}
        </div>
    );
};

export default RollForm;
