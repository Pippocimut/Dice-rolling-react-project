import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {colors} from "@/store/button-sets/buttonSetSlice.ts";

type Props = {
    buttonColor: string,
    setButtonColor: (value: string) => void,
}

export function TagColorSelection({buttonColor, setButtonColor}: Props) {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className={"w-20 " + buttonColor}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-20">
            <DropdownMenuRadioGroup value={buttonColor} onValueChange={(e) => setButtonColor(e)}>
                {colors.map((tagColor, index) => {
                    return <DropdownMenuRadioItem key={index}
                                                  value={tagColor}
                                                  className={tagColor + " h-8 rounded-none cursor-pointer"}/>
                })}
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>

}