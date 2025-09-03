import {SortableList} from "@/pages/main/components/mainBody/dnd/SortableList.tsx";
import RollButton from "@/pages/main/components/mainBody/RollButton.tsx";
import {type ButtonData, sendNewButtonList} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useCallback} from "react";

type Props = {
    items: ButtonData[]
};

export function ButtonList({items}: Props) {
    const dispatch = useDispatch();
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(set => set.id === selectedSetId))!

    const updateButtons = useCallback((newButtonList: ButtonData[]) => {
            if (buttonSet === undefined) return
            const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.id === button.id) === undefined
            const updatedButtonList = buttonSet.buttonList.filter(filter)

            dispatch(sendNewButtonList({
                setId: selectedSetId,
                buttons: [...updatedButtonList, ...newButtonList]
            }));
        }
        , [buttonSet, dispatch, selectedSetId])

    return <SortableList
        items={items}
        onChange={updateButtons}
        renderItem={(buttonData: ButtonData) => {
            return (
                <SortableList.Item id={buttonData.id}>
                        <RollButton buttonData={buttonData} key={buttonData.id}/>
                </SortableList.Item>)
        }
        }
    />
}
