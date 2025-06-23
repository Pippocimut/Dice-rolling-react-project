import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  type ButtonData,
  useButtonList,
} from "../../../../../../data/buttonListDAO.ts";
import { type Tag, useTags } from "../../../../../../data/tagsDAO.ts";
import type { Roll } from "../../../../types.ts";
import RollInput from "./RollInput.tsx";
import CreateDialog from "../RollDialog.tsx";
import TagSelection, { colors } from "./TagSelection.tsx";
import RollsList from "./RollsList.tsx";

type Props = {
  mode: "create";
  close: () => void;
  selectedTag?: Tag;
  selectedButton?: never
} | {
  mode: "edit";
  close: () => void;
  selectedTag?: never;
  selectedButton: ButtonData;
};

const CreateButtonForm = ({ mode, close, selectedTag, selectedButton }: Props) => {

  const [name, setName] = useState("");
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [tag, setTag] = useState<Tag>(
    selectedTag ? selectedTag : {
      name: "",
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  );

  useEffect(() => {
    if (mode === "edit") {
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
  const [buttonList, updateButtonList] = useButtonList();

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

    updateButtonList([...buttonList, newButton]);

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

  const deleteButton = () => {
    updateButtonList(
      buttonList.filter((button: object) => button !== selectedButton)
    );
    close();
  }

  return (
    <div className={"flex flex-col gap-2 p-4 h-fit w-fit justify-center items-center"}>

      <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
        <button className={"px-4 text-6xl"} onClick={close}>
          X
        </button>
      </div>

      <div>
        <h1 className={"text-4xl font-bold"}>
          {" "}
          {selectedButton ? "Edit" : "Create"} Button
          {" "}
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

        <button className={"px-6 m-4"} onClick={() => setIsOpenNewRollDialog(true)}>
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

      <CreateDialog
        isOpen={isOpenNewRollDialog}
        onClose={() => setIsOpenNewRollDialog(false)}
      >
        <RollInput
          createRoll={(roll: Roll) => {
            setRolls((prev) => [...prev, roll]);
            setIsOpenNewRollDialog(false);
          }}
        />
      </CreateDialog>
    </div>
  );
};

export default CreateButtonForm;
