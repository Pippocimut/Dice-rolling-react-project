import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";
import {useState} from "react";
import {CreateTagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/CreateTagForm.tsx";
import {TagList} from "@/pages/main/components/mainBody/TagList.tsx";

export function ManageTags() {
    const [isManageTagOpen, setIsManageTagOpen] = useState(false);
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

    return <div>
        <Button onClick={() => setIsManageTagOpen(true)}>Manage Tags</Button>
        <DefaultDialog isOpen={isManageTagOpen} onClose={() => setIsManageTagOpen(false)}>
            <div className={"m-4 flex flex-col gap-4 justify-center items-center"}>
                <Button className={"text-4xl w-10 h-10 mx-auto bg-blue-600"} onClick={() => setIsCreateTagOpen(true)}>
                    <span className={"mb-1"}>+</span>
                </Button>
                <DefaultDialog isOpen={isCreateTagOpen} onClose={() => setIsCreateTagOpen(false)}>
                    <CreateTagForm close={() => setIsCreateTagOpen(false)}/>
                </DefaultDialog>
                <TagList/>
            </div>
        </DefaultDialog>
    </div>
}