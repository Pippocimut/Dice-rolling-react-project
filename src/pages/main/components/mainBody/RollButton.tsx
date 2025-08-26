import type {Roll} from "../../types";
import {evaluate} from "mathjs";
import {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addRoll, type ButtonPressRecord,
    type RollResult
} from "@/store/history-sidebar/historySidebarSlice.ts";
import type {RootState} from "@/store";
import {SocketContext} from "@/context/SocketContext.ts";
import {SortableItemContext} from "./dnd/SortableItem.tsx";
import {toast} from "react-toastify";
import {FaDiceD20} from "react-icons/fa";

type Props = {
    rolls: Roll[];
    name: string;
    deleteButton: () => void;
    editButton: () => void;
    color: string;
    tag?: number;
    editMode: boolean;
};

const calculateRolls = (rolls: Roll[]) => {
    const results: RollResult[] = [];

    for (const roll of rolls) {
        const {name, equation} = roll;

        let total = 0;
        let result = "";
        let totalAdv = 0;
        let resultAdv = "";
        let totalDis = 0;
        let resultDis = "";

        let normaledEquation = "";
        let advantageEquation = "";
        let disadvantageEquation = "";

        const equationComponents = equation
            .split(/(\s*[+\-*/()^]\s*)/g)
            .filter(Boolean)
            .map((component) => component.trim());

        for (const component of equationComponents) {
            if (component === " ") {
                result += component;
                resultAdv += component;
                resultDis += component;
                continue;
            }
            if (component.includes("d")) {
                result += component + "(";
                resultAdv += component + "(";
                resultDis += component + "(";
                const [numberOfRolls, sides] = component.split("d").map(Number);
                normaledEquation += "( ";
                advantageEquation += "( ";
                disadvantageEquation += "( ";

                for (let i = 0; i < numberOfRolls; i++) {
                    const result1 = Math.floor(Math.random() * sides) + 1;
                    const result2 = Math.floor(Math.random() * sides) + 1;

                    if (i !== 0) {
                        normaledEquation += " + ";
                        advantageEquation += " + ";
                        disadvantageEquation += " + ";
                    }
                    result += i === 0 ? result1 : "," + result1;
                    resultAdv += i === 0 ? Math.max(result1, result2) : "," + Math.max(result1, result2);
                    resultDis += i === 0 ? Math.min(result1, result2) : "," + Math.min(result1, result2);
                    normaledEquation += result1;
                    advantageEquation += Math.max(result1, result2);
                    disadvantageEquation += Math.min(result1, result2);
                }

                result += ")";
                resultAdv += ")";
                resultDis += ")";
                normaledEquation += " )";
                advantageEquation += " )";
                disadvantageEquation += " )";
            } else {
                result += " " + component + " ";
                resultAdv += " " + component + " ";
                resultDis += " " + component + " ";
                normaledEquation += " " + component;
                advantageEquation += " " + component;
                disadvantageEquation += " " + component;
            }
        }

        total += evaluate(normaledEquation);
        totalAdv += evaluate(advantageEquation);
        totalDis += evaluate(disadvantageEquation);


        results.push({name, total, result, resultDis, resultAdv, totalAdv, totalDis});
    }

    return results;
};


const RollButton = ({rolls, name, editButton, color, tag, editMode}: Props) => {
    const userName = useSelector((state: RootState) => state.socket.userName)
    const {emitRoll} = useContext(SocketContext)
    const dispatch = useDispatch()

    const handleOnClick = () => {
        const results: RollResult[] = calculateRolls(rolls);
        const date = new Date();

        const roll = {
            id: 0,
            username: "You",
            name: name,
            color: color,
            tag: tag,
            date: date.toLocaleString(),
            rollResult: results,
        }
        const showCustomRollToast = (historyData: ButtonPressRecord) => {
            toast(
                // Your toast content
                () => (
                    <div className="w-full flex flex-col items-start justify-start">
                        {/* Custom icon */}
                        <div className="toast-icon">
                            <FaDiceD20 size={24} className="dice-icon"/>
                        </div>

                        {/* Toast content */}
                        <div className="w-full flex flex-col items-start justify-start">
                            <p className={"ml-auto text-sm w-full text-right"}>{historyData.date}</p>
                            <p>From: {historyData.username}</p>
                            <h3 className={"mr-auto font-bold text-xl"}>
                                {historyData.name}
                            </h3>

                            {historyData.rollResult &&
                                historyData.rollResult.map((rollResult, index) => {
                                    return (
                                        <div key={index} className={"text-left py-4 px-4 "}>
                                            <p className={"font-bold text-lg"}>{rollResult.name}</p>
                                            <div className={"flex flex-col ml-2 my-1"}>
                                                <div className={"flex flex-row gap-1 flex-wrap text-lg font-bold"}>
                                                    <p>Total: </p>
                                                    <p>
                                                        {rollResult.result} = {rollResult.total}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ),
                {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    progressClassName: "progress-bar-toast",
                    className: 'roll-toast-container',
                }
            );
        };

        showCustomRollToast(roll)

        dispatch(addRoll(roll))
        emitRoll({
            ...roll,
            username: userName ?? "Anonymous"
        })

    };

    const {attributes, listeners, ref} = useContext(SortableItemContext);

    console.log("Spliced color", `${color.slice(0, -4)}-400`)

    return (
        <button {...attributes} {...listeners} ref={ref}
                className={`w-30 h-30 p-4 rounded-lg ${color}
                font-bold
                hover:outline-4 ${
                    editMode ? "glowing-border" : ""
                }`}

                onClick={editMode ? editButton : handleOnClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    editButton();
                }}>
            <span className={"text-xl"}>{name} </span>
        </button>
    );
};

export default RollButton;
