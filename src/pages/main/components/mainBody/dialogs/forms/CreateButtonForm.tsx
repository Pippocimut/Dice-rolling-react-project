import {addButtonToSet, type Tag} from "../../../../../../store/button-sets/buttonSetSlice.ts";
import ButtonForm from "./ButtonForm.tsx";
import {colors} from "./TagSelection.tsx";
import {useDispatch} from "react-redux";

type Props = {
    close: () => void;
    selectedTag?: Tag;
    selectedSetName: string;
}

const CreateButtonForm = ({
                              close,
                              selectedTag,
                              selectedSetName
                          }: Props) => {
    const dispatch = useDispatch();
    const defaultButton = {
        id: -1,
        name: "New Button",
        rolls: [],
        tag: selectedTag?.id,
        color: selectedTag?.color ?? colors[Math.floor(Math.random() * colors.length)]
    }

    return <ButtonForm selectedButton={defaultButton}
                       selectedSetName={selectedSetName}
                       title={"Create Button"} close={close}
                       submit={(data) => {
                           dispatch(addButtonToSet(data))
                           close()
                       }}
    />
}

export default CreateButtonForm;
