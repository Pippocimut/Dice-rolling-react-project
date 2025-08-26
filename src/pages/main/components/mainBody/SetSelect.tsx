import {setSelectedSet} from "@/store/selected/selectedSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";

export function SetSelect() {
    const dispatch = useDispatch()
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedButtonSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const handleSetChange = (e: string) => {
        dispatch(setSelectedSet(parseInt(e)))
    }

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">Change current set</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Current set</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuRadioGroup value={selectedButtonSetId + ""} onValueChange={handleSetChange}>
                {buttonSets.map((buttonSet, index) => {
                    return <DropdownMenuRadioItem key={index}
                                                  value={buttonSet.id + ""}>{buttonSet.name}</DropdownMenuRadioItem>
                })}
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
}
