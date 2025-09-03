import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {useState} from "react";
import {CreateTagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/CreateTagForm.tsx";
import {TagList} from "@/pages/main/components/mainBody/TagList.tsx";
import {Label} from "@/components/ui/label.tsx";

export function ManageTags() {
    const [isManageTagOpen, setIsManageTagOpen] = useState(false);
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

    return <div>
        <Button onClick={() => setIsManageTagOpen(true)}>Manage Tags</Button>
        <DefaultDialog isOpen={isManageTagOpen} onClose={() => setIsManageTagOpen(false)}>
            <div className={"m-4 flex flex-col gap-4 justify-center items-center"}>
                <div className={"flex flex-col gap-2 w-full justify-end items-end"}>
                    <Label htmlFor={"create-tag-button"} className={"text-center w-full"}>Create Tag</Label>
                    <Button id={"create-tag-button"} className={"w-full"} variant={"outline"} onClick={() => setIsCreateTagOpen(true)}>
                        <span className={"mb-1 text-2xl"}>+</span>
                    </Button>
                </div>
                <DefaultDialog isOpen={isCreateTagOpen} onClose={() => setIsCreateTagOpen(false)}>
                    <CreateTagForm close={() => setIsCreateTagOpen(false)}/>
                </DefaultDialog>

                <TagList/>
            </div>
        </DefaultDialog>
    </div>
}