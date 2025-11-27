import type {Roll} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";

export const useRolls = () => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({...roll, name: e.target.value});
    };

    const handleTriggerChange = (trigger: string) => updateRoll({...roll, trigger: parseInt(trigger)});
    const button = useSelector((state: RootState) => state.buttonManage.button)
    const triggers = button?.triggers ?? {};

    const roll = useSelector((state: RootState) => state.buttonManage.roll)
    const dispatch = useDispatch()
    const updateRoll = (roll: Roll) => {
        dispatch(setRoll(roll))
    }

    return {
        triggers,
        button,
        handleNameChange,
        handleTriggerChange
    }
}