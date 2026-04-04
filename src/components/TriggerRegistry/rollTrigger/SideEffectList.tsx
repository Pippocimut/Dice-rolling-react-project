import {EquationFields} from "@/components/TriggerRegistry/rollTrigger/EquationFields";
import type {Equation} from "@/store/button-sets/buttonSetSlice.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {useEffect, useMemo, useState} from "react";
import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const SideEffectList = ({equation}: { equation: Equation }) => {
    //States
    const [isOpen, setIsOpen] = useState(false)

    //Conditional re-renders
    useEffect(() => {
        setIsOpen(true)
    }, [equation]);

    const sideEffectsElements = useMemo(() => {
        if (!equation?.sideEffects) return null;

        return Object.entries(equation.sideEffects).map(([sideEffectId, sideEffect]) => (
            <CollapsibleContent
                className="flex flex-col justify-center items-center w-full"
                key={`equation-${equation.id}-sideEffect-${sideEffectId}`}
            >
                <EquationFields
                    currentEquation={equation}
                    sideEffect={sideEffect}
                />
            </CollapsibleContent>
        ));
    }, [equation]);


    //Dont load component if this:
    if (!equation) return null
    if (Object.values(equation?.sideEffects ?? []).length == 0) return null

    //Component rendering
    return <Collapsible open={isOpen} onOpenChange={setIsOpen}
                        className={"flex flex-col items-start justify-start  w-full"}>

        {/*Trigger*/}
        <CollapsibleTrigger asChild>
            <Button variant="outline" size="icon" className="w-fit flex-shrink-0 p-2 mb-4 mx-auto">
                <span>Side effects: {Object.values(equation?.sideEffects ?? []).length}</span>
                <ChevronsUpDown/>
            </Button>
        </CollapsibleTrigger>

        {/*Content*/}
        {sideEffectsElements}
    </Collapsible>
}
