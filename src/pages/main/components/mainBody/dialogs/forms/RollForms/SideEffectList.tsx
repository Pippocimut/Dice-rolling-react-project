import {EquationFields} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EquationFields.tsx";
import type {Equation} from "@/store/button-sets/buttonSetSlice.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const SideEffectList = ({equation}: { equation: Equation }) => {
    const [isOpen, setIsOpen] = useState(false)
    if (!equation) return null
    if(Object.values(equation?.sideEffects ?? []).length == 0) return null
    return <div className={"flex flex-col items-center justify-center  w-full"}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className={"flex flex-col items-start justify-start  w-full"}>
            <CollapsibleTrigger asChild>
                <Button variant="outline" size="icon" className="w-fit flex-shrink-0 p-2 mb-4 mx-auto">
                    <span>Side effects: {Object.values(equation?.sideEffects ?? []).length}</span>
                    <ChevronsUpDown/>
                </Button>
            </CollapsibleTrigger>
            {
                Object.values(equation?.sideEffects ?? []).map((sideEffect) => {
                    return <CollapsibleContent className={"flex flex-col justify-center items-center"}>
                        <EquationFields currentEquation={equation} sideEffect={sideEffect}/>
                    </CollapsibleContent>
                })
            }
        </Collapsible>

    </div>
}
