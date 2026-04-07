import { TagList } from "@/features/tag-managment/components/TagList"

export const TagsPage = () => {
    return <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center justify-center mt-12"}>
        <div className={"flex flex-col gap-4 w-fit border-1 rounded-md"}>
            <TagList />
        </div>;
    </div>
}