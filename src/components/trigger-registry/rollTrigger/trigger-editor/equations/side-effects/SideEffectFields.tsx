import { SideEffectConditionSelection } from "@/components/trigger-registry/rollTrigger/trigger-editor/equations/side-effects/SideEffectConditionSelection";
import { SideEffectValueSelection } from "@/components/trigger-registry/rollTrigger/trigger-editor/equations/side-effects/SideEffectValueSelection";
import type { Equation, SideEffect, } from "@/store/button-sets/buttonSetSlice.ts";
import { Button } from "@/components/ui/button.tsx";
import { SideEffectTriggerSelection } from "./SideEffectTriggerSelection";
import { useSideEffects } from "@/components/trigger-registry/rollTrigger/trigger-editor/equations/side-effects/hooks/useSideEffects";

type Props = {
    currentEquation: Equation,
    sideEffect: SideEffect
};

export const SideEffectFields = ({ currentEquation, sideEffect }: Props) => {
    const { handleDeleteSideEffect } = useSideEffects()
    return (
        <div
            className="flex flex-col gap-4 items-center justify-center p-2 m-2 border-t-1 border-b-1 w-full"
            key={sideEffect.id}
        >
            <div className="flex flex-row gap-4 items-center">
                When
                <SideEffectConditionSelection currentEquation={currentEquation} sideEffectId={sideEffect.id} />
                <SideEffectValueSelection currentEquation={currentEquation} sideEffectId={sideEffect.id} />
                <Button
                    className="text-red-700"
                    variant="empty"
                    onClick={handleDeleteSideEffect(currentEquation.id)(sideEffect.id)}
                >X</Button>
            </div>
            <div className="flex flex-row gap-4 items-center justify-start ml-4">
                then
                <SideEffectTriggerSelection equation={currentEquation} sideEffectId={sideEffect.id} />
            </div>
        </div>
    )
}
