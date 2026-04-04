import { Input } from "@/components/ui/input.tsx";
import { type PropsWithChildren } from "react";
import { Label } from "@radix-ui/react-label";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { RollTriggerSelection } from "./RollTriggerSelection.tsx";
import { useRolls } from "./hooks/useRolls.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { TRIGGER_REGISTRY } from "@/pages/main/components/mainBody/triggerRegistry.tsx";
import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";

// Renders the type-specific editor for whichever trigger type is active.
// Adding a new trigger type requires no changes here — the registry handles it.
function TriggerSpecificEditor() {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const { EditorComponent } = TRIGGER_REGISTRY[trigger.type];
    return <EditorComponent />;
}

// Dropdown populated entirely from the registry — no hardcoded type list.
function TriggerTypeSelection() {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const { handleTriggerTypeChange } = useRolls();

    return (
        <div className="flex flex-row justify-center items-center gap-4">
            <Label htmlFor="triggerType">Trigger Type:</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild id="trigger-type-dropdown-menu-trigger">
                    <Button variant="outline" className="w-fit">
                        {TRIGGER_REGISTRY[trigger.type].label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Trigger Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={trigger.type}
                        onValueChange={(value) =>
                            handleTriggerTypeChange(value as Trigger["type"])
                        }
                    >
                        {(Object.entries(TRIGGER_REGISTRY) as [Trigger["type"], typeof TRIGGER_REGISTRY[Trigger["type"]]][]).map(
                            ([type, handler]) => (
                                <DropdownMenuRadioItem key={type} value={type}>
                                    {handler.label}
                                </DropdownMenuRadioItem>
                            )
                        )}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function TriggerHandlingDialogContent({ children }: PropsWithChildren) {
    const { handleNameChange } = useRolls();
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);

    return (
        <DialogContent className="flex flex-col gap-4 justify-start items-start">
            <DialogHeader>
                <DialogTitle>Roll handling form</DialogTitle>
                <DialogDescription>
                    Fill in the form to create a new roll or update an existing one.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 px-16" />
            <TriggerTypeSelection />
            <div className="flex flex-row justify-center items-center gap-4">
                <Label htmlFor="rollTrigger">Trigger:</Label>
                <RollTriggerSelection />
            </div>
            <div>
                <Label htmlFor="rollName">Roll name:</Label>
                <Input
                    placeholder="Roll Name"
                    value={trigger.name}
                    id="rollName"
                    onChange={handleNameChange}
                />
            </div>
            <TriggerSpecificEditor />
            <DialogFooter className="flex flex-row gap-2 w-full justify-end items-center">
                {children}
            </DialogFooter>
        </DialogContent>
    );
}

// Keep the named re-export so existing callers don't break
export { TriggerHandlingDialogContent as TriggerSpecificAttributes };
export default TriggerHandlingDialogContent;
