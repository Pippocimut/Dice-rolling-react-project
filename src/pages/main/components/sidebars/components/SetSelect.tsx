import {setSelectedSet} from "../../../../../store/selected/selectedSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../../store";

export function SetSelect() {
    const dispatch = useDispatch()
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedButtonSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    console.log("Selected set from dialog:",selectedButtonSetId)

    return (<div className={"flex flex-row w-full"}>
        <label className={"p-4 m-4"}>You are currently on: </label>
        <select className={"w-40 px-4 h-10 my-auto rounded-2xl border-2 border-gray-300"} onChange={(e) => {
            console.log(e.target.value)
            dispatch(setSelectedSet(parseInt(e.target.value)))
        }}
        value={selectedButtonSetId}>
            {buttonSets.map((buttonSet, index) => {
                return <option
                    className={"w-full text-black rounded-lg"}
                    value={buttonSet.id}
                    key={index}>{buttonSet.name}</option>
            })}

        </select>
    </div>)
}
