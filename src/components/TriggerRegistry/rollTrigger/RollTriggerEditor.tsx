import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEquations } from "../../../pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useEquations";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import type { RollTrigger } from "@/store/button-sets/buttonSetSlice";
import { useSideEffects } from "../../../pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useSideEffects";
import { Input } from "@/components/ui/input";
import { SideEffectList } from "./SideEffectList";

export const RollTriggerEditor: React.FC = () => {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const { addEquation } = useEquations();

    if (trigger.type !== "roll") return null;

    return (
        <div className="flex flex-col bg-background text-text gap-2 h-fit w-full justify-start items-start">
            <Label htmlFor="rollEquation">Equations:</Label>
            <EquationList roll={trigger} />
            <Button variant="outline" className="w-fit" onClick={addEquation}>
                Add Equation
            </Button>
        </div>
    );
};

const EquationList = ({ roll }: { roll: RollTrigger }) => {
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
            return <div id={"equation-container-" + currentEquation.id} key={currentEquation.id + ""} className={"mx-3"}>
                {index != 0 && <p className={"text-4xl pb-2 font-black mx-auto w-fit"}>
                    +
                </p>}
                <div className={"flex flex-col items-start border-1 rounded-md py-3"}>
                    <div className={"flex flex-row gap-4 p-3 items-center w-fit"}>
                        <Input id={currentEquation.id + ""} placeholder={"Equation"} value={currentEquation.formula}
                            onChange={handleEquationChange(currentEquation.id)} />

                        <Button id={"add-side-effect"} variant={"outline"}
                            onClick={addSideEffect(currentEquation.id)}>Add Side Effect</Button>
                        <Button className={"text-danger w-1 h-2 ml-auto"} variant={"empty"}
                            onClick={deleteEquation(currentEquation.id)}>X</Button>

                    </div>
                    <SideEffectList equation={currentEquation} />
                </div>

            </div>
        })}
    </div>
}