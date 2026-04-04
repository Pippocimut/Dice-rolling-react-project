import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setRoll } from "@/store/buttonManageSlice.ts";
import { makePath } from "@/store/paths";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

export const ButtonTriggerEditor: React.FC = () => {
    const dispatch = useDispatch();
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const currentButtonId = useSelector((state: RootState) => state.buttonManage.button.id);
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId);
    const buttons = useSelector((state: RootState) =>
        Object.values(state.buttonSet.sets[selectedSetId].buttonList)
    );

    if (trigger.type !== "button") return null;

    const targetButtonId = trigger.target?.[1]?.id ?? null;
    const targetButton = buttons.find((b) => b.id === targetButtonId);
    const selectableButtons = buttons.filter((b) => b.id !== currentButtonId);

    return (
        <div className="flex flex-row items-center gap-4">
            <Label>Target Button:</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-fit">
                        {targetButton?.name ?? "Select a button"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Button</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {selectableButtons.map((button) => (
                        <DropdownMenuItem
                            key={button.id}
                            onClick={() => dispatch(setRoll({
                                ...trigger,
                                target: makePath.button(selectedSetId, button.id),
                            }))}
                        >
                            {button.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
