import {addButtonToSet, type Tag} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import ButtonForm from "./ButtonForm.tsx";
import {colors} from "../TagSelection.tsx";
import {useDispatch} from "react-redux";

type Props = {
    close: () => void;
    selectedTag?: Tag;
}

const CreateButtonForm = ({
                              close,
                              selectedTag
                          }: Props) => {
    const dispatch = useDispatch();
    const defaultButton = {
        id: -1,
        name: "New Button",
        rolls: selectedTag?.rollsConfig ?? [],
        tag: selectedTag?.id,
        color: selectedTag?.color ?? colors[Math.floor(Math.random() * colors.length)]
    }

    return <ButtonForm selectedButton={defaultButton}
                       title={"Create dice rolls"} close={close}
                       submit={(data) => {
                           dispatch(addButtonToSet(data))
                           close()
                       }}
    />
}

export default CreateButtonForm;
