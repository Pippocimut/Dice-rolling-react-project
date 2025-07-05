import type {ButtonData, ButtonSet, Tag} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../../../../store";
import {
    clearAll,
    onCheckedSetChange,
    onCheckedTagsChange,
    onCheckedButtonsChange,
    selectAllSets,
} from "../../../../../../../store/export-menu/exportMenuSlice.ts";

function useCheckboxSelection() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const checkedData = useSelector((state: RootState) => state.exportMenu)

    const dispatch = useDispatch()

    return {
        checkedData,
        onCheckedSetChange: (set: ButtonSet) => dispatch(onCheckedSetChange(set)),
        onCheckedTagsChange: (setID: number) => (newTag: Tag) => dispatch(onCheckedTagsChange({
            setID,
            newTag,
            relatedButtons: buttonSets.find(buttonSet => buttonSet.id === setID)?.buttonList.filter(button => button.tag === newTag.id).map(button => button.id) ?? []
        })),
        onCheckedButtonsChange: (setID: number) => (newButton: ButtonData) => dispatch(
            onCheckedButtonsChange({
                setID,
                newButton
            })
        ),
        onSelectAllChange: () => {
            dispatch(selectAllSets({buttonSets}))
        },
        clearAll: () => {
            dispatch(clearAll())
        }
    };
}

export default useCheckboxSelection;