import {useCallback} from "react";
import {RollCard} from "@/pages/main/components/mainBody/dialogs/forms/RollCard.tsx";
import type {
    Equation,
    EquationRecord,
    Roll,
    RollMap,
    SideEffect, SideEffectsMap,
} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setButtonRolls} from "@/store/button-change-handle/buttonManageSlice.ts";
import { GeneralTriggersV12 } from "@/store/button-sets/ButtonSetV1.2";

const RollsList = () => {
    const rolls = useSelector((state: RootState) => state.buttonManage.button.rolls);

    const dispatch = useDispatch();
    const updateRolls = (rolls: RollMap) => dispatch(setButtonRolls(rolls))

    const handleDeleteRoll = useCallback(
        (rollId: number) => {
            const newRolls = {...rolls};

            const newRollsFiltered = Object.values(newRolls).reduce((acc1: RollMap, roll: Roll) => {
                acc1[roll.id] = {
                    ...roll,
                    equations: Object.values(roll.equations ?? []).reduce((acc2: EquationRecord, equation: Equation) => {
                        acc2[equation.id] = {
                            ...equation,
                            sideEffects: Object.values(equation.sideEffects ?? {}).reduce((acc3: SideEffectsMap, sideEffect: SideEffect) => {
                                if (sideEffect.triggerId === rollId) {
                                    acc3[sideEffect.id] = {
                                        ...sideEffect,
                                        triggerId: GeneralTriggersV12.None
                                    }
                                } else acc3[sideEffect.id] = sideEffect;
                                return acc3;
                            }, {})
                        }
                        return acc2
                    }, {}),
                    trigger: roll.trigger === rollId ? GeneralTriggersV12.None : roll.trigger
                }

                return acc1;
            }, {})

            delete newRollsFiltered[rollId];
            return () => {
                updateRolls(newRollsFiltered);
            }
        },
        [rolls, updateRolls]
    );

    const handleUpdateRoll = useCallback(
        (rollId: number) => {
            return (newRoll: Roll) => {
                updateRolls({
                    ...rolls,
                    [rollId]: newRoll
                });
            }
        }, [rolls])

    return (<div className={"flex flex-row flex-wrap justify-start items-start w-full gap-2"}>
        {Object.values(rolls).map((roll: Roll) => {
            return <RollCard
                key={roll.id}
                index={roll.id}
                roll={roll}
                handleDeleteRoll={handleDeleteRoll(roll.id)}
                handleUpdateRoll={handleUpdateRoll(roll.id)}
            />
        })
        }</div>)

};

export default RollsList;
