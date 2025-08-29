import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {
    type ButtonData,
    type ButtonSet, sendNewButtonList,
} from "@/store/button-sets/buttonSetSlice.ts";
import {useCallback, useMemo} from "react";
import ButtonListSection from "./ButtonListSection.tsx";

const ButtonLists = () => {

    const dispatch = useDispatch();

    const editMode = useSelector((state: RootState) => state.selected.editMode)
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) => {
            console.log("Button set id:", buttonSet.id)
            console.log("Selected set id:", selectedSetId)
            return buttonSet.id === selectedSetId
        });
    }, [buttonSets, selectedSetId]);

    const updateButtons = useCallback((newButtonList: ButtonData[]) => {
            const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.id === selectedSetId)
            const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.id === button.id) === undefined
            const updatedButtonList = buttonSets[indexOfButtonSet].buttonList.filter(filter)
            dispatch(sendNewButtonList({
                setId: selectedSetId,
                buttons: [...updatedButtonList, ...newButtonList]
            }));
        }
        , [])

    const tags = buttonSet?.tags ?? []

    const untaggedButtons = buttonSet?.buttonList.filter(button => button.tag === undefined || button.tag === -1 || button.tag === null)

    return (
        <div className={"flex flex-row w-fit mx-8 flex-wrap gap-8 justify-center items-center"}>
            {tags.length > 0 && <>
                {tags.map((tag) => {
                    const items = buttonSet?.buttonList.filter(button => button.tag === tag.id)

                    if (items) {
                        return <ButtonListSection updateButtons={updateButtons}
                                                  editMode={editMode} items={items} tagId={tag.id}/>

                    }

                })}

            </>}
            {untaggedButtons && untaggedButtons.length > 0 &&
                <ButtonListSection updateButtons={updateButtons}
                                   editMode={editMode}
                                   items={untaggedButtons}
                                   tagId={-1}/>

            }
        </div>
    );
};

export default ButtonLists;
