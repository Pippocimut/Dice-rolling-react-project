import {type Tag, useTags} from "../../../../data/tagsDAO.ts";
import Sidebar from "./Sidebar.tsx";

type Props = {
    selectedTag?: Tag
    setSelectedTag: (tag: Tag | undefined) => void
}

export function TagsSideBar(props: Props) {
    const [tags, updateTags] = useTags()
    return <Sidebar direction={"left"}>
        {tags.map(tag => {
            if (tag.name !== "") {
                return (<button
                    className={"w-full rounded-lg my-1 p-4 " + tag.color + " " + (props.selectedTag?.name == tag.name ? " outline-4" : " outline-none")}
                    onClick={() => {
                        if (props.selectedTag && props.selectedTag.name == tag.name) {
                            props.setSelectedTag(undefined)
                        } else {
                            props.setSelectedTag(tag)
                        }
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        if (tags.length <= 1) {
                            props.setSelectedTag(undefined)
                        }
                        updateTags(tags.filter(tagI => tagI.name != tag.name))
                    }}
                >
                    {tag.name}
                </button>)
            }
            return null
        })
        }
    </Sidebar>
}
