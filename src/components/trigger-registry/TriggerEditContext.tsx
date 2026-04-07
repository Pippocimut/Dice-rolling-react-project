import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { TRIGGER_REGISTRY } from "./triggerRegistry";
import { defaultTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice";

type TriggerEditCtx = {
    trigger: Trigger;
    setTrigger: (t: Trigger) => void;
};

const TriggerEditContext = createContext<TriggerEditCtx | null>(null);

export function TriggerEditProvider({ initial, children }: PropsWithChildren<{ initial?: Trigger }>) {
    const [trigger, setTrigger] = useState<Trigger>(initial ?? { ...defaultTrigger });
    return (
        <TriggerEditContext.Provider value={{ trigger, setTrigger }}>
            {children}
        </TriggerEditContext.Provider>
    );
}

export function useTriggerEdit() {
    const ctx = useContext(TriggerEditContext);
    if (!ctx) throw new Error("useTriggerEdit must be used inside TriggerEditProvider");
    return ctx;
}

export function useTriggerEditors() {
    const { trigger, setTrigger } = useTriggerEdit();

    return {
        trigger,
        handleNameChange: (name: string) => setTrigger({ ...trigger, name }),
        handleOnRollToggle: () => setTrigger({ ...trigger, onRoll: !trigger.onRoll }),
        handleTriggerTypeChange: (type: Trigger["type"]) => {
            const base = { id: trigger.id, name: trigger.name, onRoll: trigger.onRoll };
            setTrigger(TRIGGER_REGISTRY[type].defaultData(base, trigger));
        },
    };
}
