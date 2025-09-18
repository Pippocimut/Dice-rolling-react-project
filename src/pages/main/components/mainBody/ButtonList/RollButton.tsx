import {type MouseEventHandler, useCallback, useContext, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addRoll, type ButtonPressRecord,
    type RollResult
} from "@/store/history-sidebar/historySidebarSlice.ts";
import type {RootState} from "@/store";
import {SocketContext} from "@/context/SocketContext.ts";
import {SortableItemContext} from "@/components/dnd/SortableItem.tsx";
import {toast} from "react-toastify";
import EditButtonDialog from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/EditButtonDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {ButtonData} from "@/store/button-sets/buttonSetSlice.ts";
import {CustomRollToast} from "@/pages/main/components/mainBody/ButtonList/CustomRollToast.tsx";
import {calculateButtonRoll} from "@/pages/main/components/mainBody/utils.ts";

type Props = { buttonId: number };

const RollButton = ({buttonId}: Props) => {
    const dispatch = useDispatch();
    const userName = useSelector((state: RootState) => state.socket.userName);
    const editMode = useSelector((state: RootState) => state.selected.editMode)
    const buttonData: ButtonData = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId].buttonList[buttonId])

    const {attributes, listeners, ref} = useContext(SortableItemContext);
    const {emitRoll} = useContext(SocketContext);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    console.log(buttonData)

    const showCustomRollToast = (historyData: ButtonPressRecord) => {
        toast(<CustomRollToast historyData={historyData}/>,
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

    const onClick = useCallback(() => {
        if (editMode) {
            setEditDialogOpen(true);
        } else {
            const results: RollResult[] = calculateButtonRoll(buttonData.rolls);

            const roll = {
                id: 0,
                username: "You",
                name: buttonData.name,
                color: buttonData.color,
                tag: buttonData.tag,
                date: new Date().toLocaleString(),
                rollResult: results,
            };

            showCustomRollToast(roll);
            dispatch(addRoll(roll));
            emitRoll({...roll, username: userName ?? "Anonymous"});
        }
    }, [editMode, buttonData, dispatch, emitRoll, userName]);

    const onContextMenu: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        setEditDialogOpen(true)
    }, [editMode])

    const longestButtonWord = buttonData.name.split(" ").reduce((a, b) => a.length > b.length ? a : b);
    const buttonNameLengthClass = longestButtonWord.length >= 12 ? "text-base" : "text-xl";

    return (<>
        <Button
            {...attributes}
            {...listeners}
            ref={ref}
            className={`w-30 h-30 rounded-lg ${buttonData.color} font-bold hover:outline-4 ${editMode ? 'glowing-border' : ''}`}
            onClick={onClick}
            onContextMenu={onContextMenu}>
            <span className={" w-25 text-wrap wrap-break-word " + buttonNameLengthClass}>{buttonData.name}</span>
        </Button>
        <EditButtonDialog
            selectedButtonId={buttonData.id}
            setOpen={setEditDialogOpen}
            open={editDialogOpen}
        />
    </>)
};

export default RollButton;
