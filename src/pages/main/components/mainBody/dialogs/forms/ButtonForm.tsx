import { useState } from "react";
import { toast } from "react-toastify";
import {
  type ButtonData,
  useButtonList,
} from "../../../../../../data/buttonListDAO.ts";
import { type Tag, useTags } from "../../../../../../data/tagsDAO.ts";
import type { Roll } from "../../../../types.ts";
import RollInput from "./RollInput.tsx";
import CreateDialog from "../RollDialog.tsx";
import TagSelection from "./TagComboBox.tsx";

type Props =
  | {
    function: "create";
    onClose: () => void;
    tag?: Tag;
  }
  | {
    function: "edit";
    button?: ButtonData;
    deleteButton: () => void;
    onClose: () => void;
  };

const ButtonForm = (props: Props) => {
  const [name, setName] = useState(
    props.function === "edit" ? props.button?.name || "" : ""
  );

  const [buttonColor, setButtonColor] = useState<string>(
    props.function === "edit"
      ? props.button?.color || ""
      : props.tag
        ? props.tag.color
        : colors[Math.floor(Math.random() * colors.length)]
  );

  const [rolls, setRolls] = useState<Roll[]>(
    props.function === "edit" ? props.button?.rolls || [] : []
  );

  const [tag, setTag] = useState<string>(
    props.function === "edit"
      ? props.button?.tag || ""
      : props.tag
        ? props.tag.name
        : ""
  );

  const [isOpenDialog, setIsOpenDialog] = useState(false);

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
      color: buttonColor,
      tag: tag !== "" ? tag : undefined,
    };

    if (props.function === "edit") {
      const newButtonList = buttonList.map((button: ButtonData) => {
        if (props.button && button.name === props.button.name) {
          return newButton;
        }
        return button;
      });
      updateButtonList(newButtonList);
    } else {
      updateButtonList([...buttonList, newButton]);
    }

    if (tag !== "" && !tags?.map((tag) => tag.name).includes(tag)) {
      updateTagList([
        ...tags,
        {
          name: tag,
          color: buttonColor,
        },
      ]);
    }

    setRolls([]);
    props.onClose();
  };

  return (
    <div
      className={
        "flex flex-col gap-2 p-4 h-fit w-fit justify-center items-center"
      }
    >
      <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
        <button className={"px-4 text-6xl"} onClick={props.onClose}>
          X
        </button>
      </div>

      <div>
        <h1 className={"text-4xl font-bold"}>
          {" "}
          {props.function === "edit" ? "Edit Button" : "Create Button"}{" "}
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

        <button className={"px-6 m-4"} onClick={() => setIsOpenDialog(true)}>
          Add roll
        </button>
      </div>

      <div className={"flex flex-col gap-2 w-full"}>
        {rolls.map((roll, index) => (
          <div
            key={index}
            className={
              "flex flex-col w-full justify-between items-center border-2 border-gray-500 rounded-lg shadow-lg"
            }
          >
            <div
              className={
                "flex flex-row p-2 gap-2 w-full justify-between items-center"
              }
            >
              <p className={"m-4"}>
                {" "}
                <span className={"font-bold"}>{roll.name}</span>:{" "}
                {roll.equation.length > 20
                  ? roll.equation.substring(0, 25) + "..."
                  : roll.equation}{" "}
              </p>
              <button
                className={
                  "mt-2 w-10 bg-red-500 text-white rounded hover:bg-red-600 p-2"
                }
                onClick={() =>
                  setRolls((prevRolls) =>
                    prevRolls.filter((_, i) => i !== index)
                  )
                }
              >
                {" "}
                X
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 flex flex-row gap-2 w-full justify-center items-center">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={createNewButton}
        >
          {props.function === "edit" ? "Edit" : "Create"} Button
        </button>
        {props.function === "edit" && (
          <button
            id={"delete"}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => props.deleteButton()}
          >
            Delete Button
          </button>
        )}
      </div>
      <CreateDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      >
        <RollInput
          createRoll={(roll: Roll) => {
            setRolls((prev) => [...prev, roll]);
            setIsOpenDialog(false);
          }}
        />
      </CreateDialog>
    </div>
  );
};

export default ButtonForm;
