import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  type ButtonData,
  useButtonList,
} from "../../../../../../data/buttonListDAO.ts";
import { type Tag, useTags } from "../../../../../../data/tagsDAO.ts";
import type { Roll } from "../../../../types.ts";
import RollForm from "./RollForm.tsx";
import RollDialog from "../RollDialog.tsx";
import TagSelection, { colors } from "./TagSelection.tsx";
import RollsList from "./RollsList.tsx";

type Props =
  | {
      mode: "create";
      close: () => void;
      selectedTag?: Tag;
      selectedButtonIndex?: never;
    }
  | {
      mode: "edit";
      close: () => void;
      selectedTag?: never;
      selectedButtonIndex: number;
    };

const ButtonForm = ({
  mode,
  close,
  selectedTag,
  selectedButtonIndex,
}: Props) => {
  const [name, setName] = useState("");
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [tag, setTag] = useState<Tag>(
    selectedTag
      ? selectedTag
      : {
          name: "",
          color: colors[Math.floor(Math.random() * colors.length)],
        }
  );
  const [deleted, setDeleted] = useState(false);

  const [buttonList, updateButtonList] = useButtonList();
  const selectedButton = useMemo(() => {
    if (mode == "edit") return buttonList[selectedButtonIndex];
  }, [mode, buttonList]);

  useEffect(() => {
    if (mode === "edit" && !deleted) {
      setName(selectedButton.name);
      setRolls(selectedButton.rolls);
      setTag({
        name: selectedButton.tag || "",
        color: selectedButton.color,
      });
    }
  }, [selectedButton]);

  const [isOpenNewRollDialog, setIsOpenNewRollDialog] = useState(false);
  const [tags, updateTagList] = useTags();

  const createNewButton = () => {
    if (name == "") {
      toast.error("Button name cannot be empty");
      return;
    }

    if (rolls.length === 0) {
      toast.error("Button must have at least one roll");
      return;
    }

    const newButton: ButtonData = {
      name: name,
      rolls: rolls,
      color: tag.color,
      tag: tag.name ? tag.name : undefined,
    };

    if (mode === "edit") {
      const newButtonList = buttonList.map((button: ButtonData) => {
        if (selectedButton === undefined) return button;

        if (button.name === selectedButton.name) {
          return newButton;
        }
        return button;
      });
      updateButtonList(newButtonList);
    } else {
      updateButtonList([...buttonList, newButton]);
    }

    if (tag.name !== "" && !tags?.map((tag) => tag.name).includes(tag.name)) {
      updateTagList([
        ...tags,
        {
          name: tag.name,
          color: tag.color,
        },
      ]);
    }

    setRolls([]);
    close();
  };

  const deleteButton = useCallback(() => {
    updateButtonList(
      buttonList.filter((_: object, i: number) => i !== selectedButtonIndex)
    );
    setDeleted(true);
    close();
  }, [buttonList]);

  return (
    <div
      className={
        "flex flex-col gap-2 p-4 h-fit w-fit justify-center items-center"
      }
    >
      <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
        <button className={"px-4 text-6xl"} onClick={close}>
          ✕
        </button>
      </div>

      <div>
        <h1 className={"text-4xl font-bold"}>
          {" "}
          {mode === "edit" ? "Edit" : "Create"} Button{" "}
        </h1>
      </div>

      <div className={"flex flex-row gap-2"}>
        <input
          className={
            "p-4 m-4 w-70 border-2 border-gray-500 rounded-lg text-left"
          }
          type={"text"}
          placeholder={"Button's Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <TagSelection tag={tag} setTag={setTag} />

      <div className={"flex flex-row gap-2"}>
        <button className={"px-6 m-4"} onClick={() => setRolls([])}>
          Clear rolls
        </button>

        <button
          className={"px-6 m-4"}
          onClick={() => setIsOpenNewRollDialog(true)}
        >
          Add roll
        </button>
      </div>

      <RollsList rolls={rolls} setRolls={setRolls} />

      <div className="p-4 flex flex-row gap-2 w-full justify-center items-center">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={createNewButton}
        >
          {mode === "edit" ? "Edit" : "Create"} Button
        </button>
        {mode === "edit" && (
          <button
            id={"delete"}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={deleteButton}
          >
            Delete Button
          </button>
        )}
      </div>

      <RollDialog
        isOpen={isOpenNewRollDialog}
        onClose={() => setIsOpenNewRollDialog(false)}
      >
        <RollForm
          createRoll={(roll: Roll) => {
            setRolls((prev) => [...prev, roll]);
            setIsOpenNewRollDialog(false);
          }}
        />
      </RollDialog>
    </div>
  );
};

export default ButtonForm;
