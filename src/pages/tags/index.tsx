import {TagManagmentPanel} from "@/features/tag-managment/components/TagManagmentPanel.tsx";

export const TagsPage = () => {
    return <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center justify-center mt-12"}>
        <TagManagmentPanel/>
    </div>
}