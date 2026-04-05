import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { makePath } from "@/store/button-sets/paths";
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
import { selectCurrentButton, selectCurrentTrigger, setTrigger } from "@/store/button-sets/buttonSetSlice";

export const ButtonTriggerEditor: React.FC = () => {
    const dispatch = useDispatch();
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId);
    const buttons = useSelector((state: RootState) =>
        Object.values(state.buttonSet.sets[selectedSetId].buttons)
    );

    const trigger = useSelector(selectCurrentTrigger)!;
    const selectedButton = useSelector(selectCurrentButton)!

    if (trigger.type !== "button") return null;

    const targetButtonId = trigger.target?.[1]?.id ?? null;
    const targetButton = buttons.find((b) => b.id === targetButtonId);
    const selectableButtons = buttons.filter((b) => b.id !== selectedButton.id);

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
                            onClick={() => dispatch(
                                setTrigger({
                                    trigger: {
                                        ...trigger,
                                        target: makePath.button(selectedSetId, button.id)
                                    },
                                    triggerPath: makePath.trigger(selectedSetId, button.id, trigger.id)
                                })
                            )}
                        >
                            {button.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
