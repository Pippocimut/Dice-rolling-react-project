import { useCallback, useState } from "react";
import { useButtonList } from "../../../../data/buttonListDAO.ts";
import type { Tag } from "../../../../data/tagsDAO.ts";
import ButtonList from "./ButtonList.tsx";
import CreateButtonForm from "./dialogs/forms/CreateButtonForm.tsx";
import ButtonDialog from "./dialogs/ButtonDialog.tsx";

type Props = {
  selectedTag?: Tag;
};

const MainBody = ({ selectedTag }: Props) => {
  const [buttonList, updateButtonList] = useButtonList();
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
    null
  );

  const removeButton = useCallback(
    (index: number) => {
      updateButtonList(
        buttonList.filter((_: object, i: number) => i !== index)
      );
      setIsOpenEditDialog(false);
      setSelectedButtonIndex(null);
    },
    [buttonList]
  );

  const editButton = useCallback((index: number) => {
    setSelectedButtonIndex(index);
    setIsOpenEditDialog(true);
  }, []);

  return (
    <div className={"flex flex-col h-full gap-20 w-full items-center justify-around"}>
      <ButtonList
        buttonList={buttonList}
        selectedTag={selectedTag}
        removeButton={removeButton}
        editButton={editButton}
        openCreateDialog={() => setIsOpenCreateDialog(true)}
      />

      <ButtonDialog
        isOpen={isOpenCreateDialog}
        onClose={() => {
          setIsOpenCreateDialog(false);
        }}
      >
        <CreateButtonForm
          mode={"create"}
          close={() => setIsOpenCreateDialog(false)}
          selectedTag={selectedTag}
        />
      </ButtonDialog>

      <ButtonDialog
        isOpen={isOpenEditDialog}
        onClose={() => {
          setIsOpenEditDialog(false);
        }}
      >
        {selectedButtonIndex !== null && (
          <CreateButtonForm
            mode={"edit"}
            close={() => setIsOpenEditDialog(false)}
            selectedButton={buttonList[selectedButtonIndex]}
          />
        )}
      </ButtonDialog>
    </div>
  );
};

export default MainBody;
