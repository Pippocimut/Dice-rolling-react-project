import type { ButtonData } from "../../../../data/buttonListDAO";
import type { Tag } from "../../../../data/tagsDAO";
import RollButton from "./RollButton";

type Props = {
  buttonList: [];
  selectedTag?: Tag;
  removeButton: (index: number) => void;
  editButton: (index: number) => void;
  openCreateDialog: () => void;
};

const ButtonList = ({
  buttonList,
  selectedTag,
  removeButton,
  editButton,
  openCreateDialog,
}: Props) => {
  return (
    <ul
      id="buttons"
      className={
        "flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"
      }
    >
      {buttonList &&
        buttonList.map((buttonData: ButtonData, index: number) => {
          if (!selectedTag || buttonData.tag === selectedTag.name) {
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
        })}
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
