import RollButton from "./RollButton";
import type {RootState} from "../../../../store";
import {useSelector} from "react-redux";
import type {ButtonData, Tag} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useMemo} from "react";

type Props = {
    buttonSetName: string;
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    editButton: (index: number) => void;
    openCreateDialog: () => void;
};

const ButtonList = ({
                        buttonSetName,
                        selectedTag,
                        removeButton,
                        editButton,
                        openCreateDialog,
                    }: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) => buttonSet.name === buttonSetName) || null;
    }, [buttonSets, buttonSetName]);

    return (
        <ul
            id="buttons"
            className={
                "flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"
            }
        >
            {buttonSet &&
                buttonSet.buttonList.map((buttonData: ButtonData, index: number) => {
                    if (!selectedTag || buttonData.tag === selectedTag.id) {
                        return (
                            <div className={"flex flex-row"} key={index}>
                                <RollButton
                                    rolls={buttonData.rolls}
                                    name={buttonData.name}
                                    deleteButton={() => removeButton(index)}
                                    editButton={() => editButton(index)}
                                    color={buttonData.color}
                                    tag={buttonData.tag}
                                    key={index}
                                />
                            </div>
                        );
                    }
                })
            }
            <button
                className={
                    "w-30 h-30 flex items-center justify-center bg-neutral-700 hover:outline-2 rounded-lg"
                }
                onClick={openCreateDialog}
            >
                <span className={"text-6xl pb-3"}>✚</span>
            </button>
        </ul>
    );
};

export default ButtonList;
