import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {setSelectedSet} from "@/store/button-sets/buttonSetSlice.ts";
import {useState} from "react";
import {CreateSetDialog} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/CreateSetDialog.tsx";
import {useNavigate} from "react-router-dom";

export function SetSelect() {
    const dispatch = useDispatch()
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedButtonSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)
    const navigate = useNavigate()

    const handleSetChange = (e: string) => {
        dispatch(setSelectedSet(parseInt(e)))
        navigate("/")
    }

    const [isOpen, setIsOpen] = useState(false)
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)

    return <>
        <DropdownMenu open={isDropDownMenuOpen} onOpenChange={setIsDropDownMenuOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Current Set: {buttonSets[selectedButtonSetId].name} </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex flex-col justify-center">
                <DropdownMenuLabel>Current set</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={selectedButtonSetId + ""} onValueChange={handleSetChange}>
                    {Object.values(buttonSets).map((buttonSet, index) => {
                        return <DropdownMenuRadioItem key={index}
                                                      value={buttonSet.id + ""}>{buttonSet.name}</DropdownMenuRadioItem>
                    })}
                </DropdownMenuRadioGroup>
                <Button className={"w-full"} variant="outline" onClick={() => setIsOpen(true)}> <span
                    className={"size-5 text-3xl leading-4 font-bold"}>+</span> </Button>
            </DropdownMenuContent>
        </DropdownMenu>
        <CreateSetDialog openSetDialog={isOpen} setOpenSetDialog={setIsOpen} closeMenu={() => setIsDropDownMenuOpen(false)}/>
    </>
}

