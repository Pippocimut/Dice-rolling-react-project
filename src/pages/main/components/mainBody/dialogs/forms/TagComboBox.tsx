import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    tag: number;
    setTag: (value: number) => void;
}

const TagComboBox = ({tag, setTag}: Props) => {
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets[state.selected.selectedSetId])
    const tags = buttonSet.tags ?? []

    const currentTag = tags[tag]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={"tag-dropdown-menu-trigger"}>
                <Button variant="outline" className={"w-35"}>{currentTag ? currentTag.name : "Select tag"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Current tag</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={tag + ""} onValueChange={(e) => setTag(parseInt(e))}>
                    {Object.values(tags).map((currentTag, index) => {
                        if (currentTag.id === -1 || currentTag.name === "") return
                        return <DropdownMenuRadioItem key={index}
                                                      value={currentTag.id + ""}>{currentTag.name}</DropdownMenuRadioItem>
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    );
};

export default TagComboBox;
