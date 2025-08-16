import { useCallback } from "react";
import type { Roll } from "../../../../types";

const RollsList = ({
  rolls,
  setRolls,
}: {
  rolls: Roll[];
  setRolls: React.Dispatch<React.SetStateAction<Roll[]>>;
}) => {
  const handleDeleteRoll = useCallback(
    (index: number) => {
      setRolls((prevRolls) => prevRolls.filter((_, i) => i !== index));
    },
    [setRolls]
  );

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
      ))}
    </div>
  );
};

export default RollsList;
