import { type MouseEventHandler, useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { SocketContext } from "@/context/SocketContext.ts";
import { SortableItemContext } from "@/components/dnd/SortableItem.tsx";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button.tsx";
import { makePath, setSelectedButtonId, type ButtonData } from "@/store/button-sets/buttonSetSlice.ts";
import { CustomRollToast } from "@/pages/main/components/mainBody/ButtonList/CustomRollToast.tsx";
import { pressButton } from "@/pages/main/components/mainBody/pressButton.ts";
import { FaDice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store";

type Props = { buttonId: number };

const RollButton = ({ buttonId }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const userName = useSelector((state: RootState) => state.socket.userName);
    const editMode = useSelector((state: RootState) => state.selected.editMode);
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId);
    const buttonData: ButtonData = useSelector(
        (state: RootState) =>
            state.buttonSet.sets[selectedSetId].buttons[buttonId]
    );
    const audioOn: boolean = useSelector((state: RootState) => state.settings.audioOn);

    const { attributes, listeners, ref } = useContext(SortableItemContext);
    const { emitRoll } = useContext(SocketContext);

    const audio = new Audio("/sounds/roll-sound.mp3");
    const navigate = useNavigate();

    const [rollingAnimationOn, setRollingAnimationOn] = useState(false);
    let rollingTimeout = setTimeout(function () { });

    const onClick = useCallback(() => {
        if (editMode) {
            dispatch(setSelectedButtonId(buttonId))
            navigate("/button/edit");
        } else {
            setRollingAnimationOn(true);
            clearTimeout(rollingTimeout);
            if (audioOn) audio.play();

            rollingTimeout = setTimeout(function () {
                setRollingAnimationOn(false);
            }.bind(this), 1000);

            const roll = dispatch(pressButton(buttonData, "You", selectedSetId));

            toast(<CustomRollToast historyData={roll} />, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                progressClassName: "progress-bar-toast",
                className: "roll-toast-container",
            });

            emitRoll({ ...roll, username: userName ?? "Anonymous" });
        }
    }, [editMode, buttonData, dispatch, emitRoll, userName, audioOn]);

    const onContextMenu: MouseEventHandler<HTMLButtonElement> = useCallback(
        (e) => {
            e.preventDefault();
            dispatch(setSelectedButtonId(buttonId))
            navigate("/button/edit");
        },
        [editMode, buttonData]
    );

    const longestButtonWord = buttonData.name
        .split(" ")
        .reduce((a, b) => (a.length > b.length ? a : b));
    const buttonNameLengthClass = longestButtonWord.length >= 12 ? "text-base" : "text-xl";

    const buttonContent = rollingAnimationOn ? (
        <FaDice className="size-12" />
    ) : (
        <span className={`w-25 text-wrap wrap-break-word ${buttonNameLengthClass}`}>
            {buttonData.name}
        </span>
    );

    return (
        <Button
            {...attributes}
            {...listeners}
            ref={ref}
            className={`w-30 h-30 rounded-lg ${buttonData.color} font-bold hover:outline-4 ${editMode ? "glowing-border" : ""
                }`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <div className="transition-all duration-300">{buttonContent}</div>
        </Button>
    );
};

export default RollButton;
