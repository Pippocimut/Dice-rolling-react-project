import type { Roll } from "../../../../types.ts";
import { useState } from "react";

const RollInput = ({ createRoll }: { createRoll: (roll: Roll) => void }) => {
  const labelClassName = "text-left";
  const dieInputClassname =
    "p-4 w-50 border-2 border-gray-500 rounded-lg text-right";

  const [roll, updateRoll] = useState<Roll>({
    name: "New roll",
    equation: `${1}d${20}+0`,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRoll({ ...roll, name: e.target.value });
  };

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRoll({ ...roll, equation: e.target.value });
  };

  return (
    <div className={"flex flex-col gap-2 w-full justify-center items-center"}>
      <label className={labelClassName}>Roll name: </label>
      <input
        type={"text"}
        placeholder={"Roll Name"}
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
      <button
        className={"p-4 m-4"}
        onClick={() => {
          createRoll(roll);
        }}
      >
        Add Roll
      </button>
    </div>
  );
};

export default RollInput;
