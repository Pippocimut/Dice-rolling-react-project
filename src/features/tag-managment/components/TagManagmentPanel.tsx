import {TagList} from "@/features/tag-managment/components/TagList.tsx";

export const TagManagmentPanel = () => {
  return <div className={"flex flex-col gap-4 w-fit border-1 rounded-md"}>
      <div>
          <TagList/>
      </div>
  </div>;
};