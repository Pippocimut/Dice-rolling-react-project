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
import { useTriggers } from "../hooks/useTriggers.tsx";
import { useSelector } from "react-redux";
import { TRIGGER_REGISTRY } from "@/components/trigger-registry/triggerRegistry.tsx";
import { selectCurrentTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";

// Renders the type-specific editor for whichever trigger type is active.
// Adding a new trigger type requires no changes here — the registry handles it.
function TriggerSpecificEditor() {
    const trigger = useSelector(selectCurrentTrigger)!;
    const { EditorComponent } = TRIGGER_REGISTRY[trigger.type];
    return <EditorComponent />;
}

function OnRollTriggerSelection() {
    const roll = useSelector(selectCurrentTrigger)!
    const { handleOnRollToggle } = useTriggers()

    if (!roll) return null

    const isOnRoll = Boolean(roll.onRoll)
    const buttonText = isOnRoll ? "On-Roll: Active" : "On-Roll: Inactive"
    const buttonColorClass = isOnRoll
        ? "bg-emerald-600 text-white hover:bg-emerald-500"
        : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"

    return (
        <div className="flex flex-row justify-center items-center gap-4">
            <Label htmlFor="rollTrigger">Trigger:</Label>
            <Button
                variant="secondary"
                className={`w-fit ${buttonColorClass}`}
                onClick={handleOnRollToggle}
                role="checkbox"
                aria-checked={isOnRoll}
                aria-label="Toggle on-roll behavior"
            >
                {buttonText}
            </Button>
        </div>

    )
}

// Dropdown populated entirely from the registry — no hardcoded type list.
function TriggerTypeSelection() {
    const trigger = useSelector(selectCurrentTrigger)!;
    const { handleTriggerTypeChange } = useTriggers();

    if (!trigger) return null

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

function TriggerNameSelection() {

    const { handleNameChange } = useTriggers();
    const trigger = useSelector(selectCurrentTrigger)!;

    return <div>
        <Label htmlFor="rollName">Roll name:</Label>
        <Input
            placeholder="Roll Name"
            value={trigger.name}
            id="rollName"
            onChange={handleNameChange}
        />
    </div>
}

export function TriggerHandlingDialogContent({ children }: PropsWithChildren) {
    const trigger = useSelector(selectCurrentTrigger)
    console.log(trigger)
    if (!trigger) return null
    return (
        <DialogContent className="flex flex-col gap-4 justify-start items-start">
            <DialogHeader>
                <DialogTitle>Roll handling form</DialogTitle>
                <DialogDescription>
                    Fill in the form to create a new roll or update an existing one.
                </DialogDescription>
            </DialogHeader>

            <TriggerTypeSelection />
            <OnRollTriggerSelection />
            <TriggerNameSelection />
            <TriggerSpecificEditor />

            <DialogFooter className="flex flex-row gap-2 w-full justify-end items-center">
                {children}
            </DialogFooter>
        </DialogContent>
    );
}

export default TriggerHandlingDialogContent;
