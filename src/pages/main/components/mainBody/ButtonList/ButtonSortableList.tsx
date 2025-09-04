import {SortableList} from "@/pages/main/components/mainBody/dnd/SortableList.tsx";
import RollButton from "@/pages/main/components/mainBody/RollButton.tsx";
import {type ButtonData, sendNewButtonList} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useCallback} from "react";
import {getSelectedSet} from "@/pages/main/components/mainBody/utils.ts";

type Props = {
    items: ButtonData[]
};

export function ButtonSortableList({items}: Props) {
    const dispatch = useDispatch();
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector(getSelectedSet)!

    const updateButtons = useCallback((newButtonList: ButtonData[]) => {
        const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.id === button.id) === undefined
        const updatedButtonList = buttonSet.buttonList.filter(filter)

        dispatch(sendNewButtonList({
            setId: selectedSetId,
            buttons: [...updatedButtonList, ...newButtonList]
        }));
    }, [buttonSet, dispatch, selectedSetId])

    return <SortableList
        items={items}
        onChange={updateButtons}

        renderItem={(buttonData: ButtonData) => {
            return <SortableList.Item id={buttonData.id}>
                <RollButton buttonData={buttonData} key={buttonData.id}/>
            </SortableList.Item>
        }}
    />
}
