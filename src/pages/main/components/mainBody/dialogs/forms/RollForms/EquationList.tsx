import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEquations} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useEquations.tsx";
import {useSideEffects} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useSideEffects.tsx";
import {SideEffectList} from "./SideEffectList";
import type {Roll} from "@/store/button-sets/buttonSetSlice.ts";

export const EquationList = ({roll}: { roll: Roll }) => {
    const {
        handleEquationChange,
        deleteEquation
    } = useEquations()

    const {
        addSideEffect
    } = useSideEffects()

    return <div className={"flex flex-col gap-2 justify-start items-center max-h-100 overflow-auto"}>
        {Object.values(roll.equations).map((currentEquation, index) => {
            if (currentEquation.id === -1) return
            return <>
                {index!=0 && <p className={"text-4xl pb-2 font-black"}>
                    +
                </p>}
                <div className={"flex flex-col items-start border-1 rounded-md py-3"}>
                    <div className={"flex flex-row gap-4 p-3 items-center"}>
                        <Input id={currentEquation.id + ""} placeholder={"Equation"} value={currentEquation.formula}
                               onChange={handleEquationChange(currentEquation.id)}/>

                        <Button id={"add-side-effect"} variant={"outline"}
                                onClick={addSideEffect(currentEquation.id)}>Add Side Effect</Button>
                        <Button className={"text-danger w-1 h-2 ml-auto"} variant={"empty"}
                                onClick={deleteEquation(currentEquation.id)}>X</Button>

                    </div>
                    <SideEffectList equation={currentEquation}/>
                </div>

            </>
        })}
    </div>
}

