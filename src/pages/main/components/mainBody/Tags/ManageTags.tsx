import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {TagList} from "@/pages/main/components/mainBody/Tags/TagList.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

export function ManageTags() {
    const [isManageTagOpen, setIsManageTagOpen] = useState(false);

    return <Dialog open={isManageTagOpen} onOpenChange={setIsManageTagOpen}>
        <DialogTrigger asChild>
            <Button onClick={() => setIsManageTagOpen(true)}>Manage Tags</Button>
        </DialogTrigger>
        <DialogContent className={"w-fit"} onOpenAutoFocus={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Manage tags</DialogTitle>
            </DialogHeader>
            <div className={"m-4 flex flex-col gap-4 justify-center items-center"}>
                <TagList/>
            </div>
        </DialogContent>
    </Dialog>
}