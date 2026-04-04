import { useCallback } from "react";
import { TriggerCard } from "@/pages/main/components/mainBody/dialogs/forms/RollCard.tsx";
import {
    selectCurrentButton,
    upsertButtonOfSet,
    type Equation,
    type EquationRecord,
    type SideEffect, type SideEffectsMap,
    type Trigger,
    type TriggersMap,
} from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

const TriggerList = () => {
    const button = useSelector(selectCurrentButton)!
    const triggers = button.triggers
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const dispatch = useDispatch();

    const updateTriggers = (triggers: TriggersMap) => dispatch(upsertButtonOfSet({
        button: {
            ...button,
            triggers: triggers
        },
        setId: selectedSetId
    }))

    const handleDeleteTrigger = useCallback(
        (rollId: number) => {
            const newRolls = { ...triggers };

            const newRollsFiltered = Object.values(newRolls).reduce((acc1: TriggersMap, trigger: Trigger) => {
                if (trigger.type !== "roll") {
                    acc1[trigger.id] = trigger;
                    return acc1;
                }

                acc1[trigger.id] = {
                    ...trigger,
                    equations: Object.values(trigger.equations ?? []).reduce((acc2: EquationRecord, equation: Equation) => {
                        acc2[equation.id] = {
                            ...equation,
                            sideEffects: Object.values(equation.sideEffects ?? {}).reduce((acc3: SideEffectsMap, sideEffect: SideEffect) => {
                                // If this side effect targeted the deleted trigger, clear its target.
                                const targetsTrigger = sideEffect.target?.[2]?.id === rollId;
                                acc3[sideEffect.id] = targetsTrigger
                                    ? { ...sideEffect, target: null }
                                    : sideEffect;
                                return acc3;
                            }, {})
                        }
                        return acc2
                    }, {} as EquationRecord),
                }

                return acc1;
            }, {})

            delete newRollsFiltered[rollId];
            return () => {
                updateTriggers(newRollsFiltered);
            }
        },
        [triggers, updateTriggers]
    );

    const handleUpdateTrigger = useCallback(
        (rollId: number) => {
            return (newRoll: Trigger) => {
                updateTriggers({
                    ...triggers,
                    [rollId]: newRoll
                });
            }
        }, [triggers])

    console.log("Rendering trigger list with rolls", triggers)

    return (<div className={"flex flex-row flex-wrap justify-start items-start w-full gap-2"}>
        {Object.values(triggers).map((trigger: Trigger) => {
            return <TriggerCard
                key={trigger.id}
                index={trigger.id}
                trigger={trigger}
                handleDeleteRoll={handleDeleteTrigger(trigger.id)}
                handleUpdateRoll={handleUpdateTrigger(trigger.id)}
            />
        })
        }</div>)

};

export default TriggerList;
