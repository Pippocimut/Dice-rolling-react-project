import type {Roll} from "../../types";
import {evaluate} from "mathjs";
import {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addRoll,
    type RollResult
} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import type {RootState} from "../../../../store";
import {SocketContext} from "../../../../context/SocketContext.ts";
import {SortableItemContext} from "./dnd/SortableItem.tsx";

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

        dispatch(addRoll(roll))
        emitRoll({
            ...roll,
            username: userName ?? "Anonymous"
        })

    };

    const {attributes, listeners, ref} = useContext(SortableItemContext);


    return (
        <button {...attributes} {...listeners} ref={ref}
                className={`w-30 h-30 rounded-lg ${color} hover:outline-2 ${
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
