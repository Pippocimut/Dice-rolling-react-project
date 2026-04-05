import { useSelector } from "react-redux";
import { useEquations } from "./equations/hooks/useEquations";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { selectCurrentTrigger } from "@/store/button-sets/buttonSetSlice";
import { EquationList } from "./equations/EquationList";

export const RollTriggerEditor: React.FC = () => {
    const trigger = useSelector(selectCurrentTrigger);
    const { addEquation } = useEquations();

    if (trigger?.type !== "roll") return null;

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

