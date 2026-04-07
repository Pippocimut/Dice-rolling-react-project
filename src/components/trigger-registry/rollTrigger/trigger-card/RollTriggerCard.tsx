import type { RollTrigger } from "@/store/button-sets/buttonSetSlice";

export const RollTriggerCard: React.FC<{ trigger: RollTrigger }> = ({ trigger }) => {
    const equation = Object.values(trigger.equations)
        .reduce((acc, eq) => acc + eq.formula + "+", "")
        .slice(0, -1);

    return <>{equation.length > 20 ? equation.substring(0, 20) + "..." : equation}</>;
};
