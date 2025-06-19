import { useState } from "react";
import { type Tag } from "../../data/tagsDAO.ts";
import TagsSideBar from "./components/sidebar/TagsSidebar.tsx";
import MainBody from "./components/mainBody/index.tsx";
import HistorySideBar from "./components/sidebar/HistorySidebar.tsx";

export function Main() {
  const [selectedTag, setSelectedTag] = useState<Tag>();

  return (
    <div className={"flex flex-row h-screen w-full justify-start items-start"}>
      <TagsSideBar selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <MainBody selectedTag={selectedTag} />
      <HistorySideBar />
    </div>
  );
}
