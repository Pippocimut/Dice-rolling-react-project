import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSideEffects } from "@/components/trigger-registry/rollTrigger/trigger-editor/equations/side-effects/hooks/useSideEffects";
import type { RootState } from "@/store";
import { makePath, resolveEntity, selectCurrentButton, selectCurrentTrigger, type Equation, type Trigger } from "@/store/button-sets/buttonSetSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type SideEffectTriggerSelectionProps = {
  equation: Equation,
  sideEffectId: number,
}

export const SideEffectTriggerSelection = ({ equation, sideEffectId }: SideEffectTriggerSelectionProps) => {
  const currentSideEffect = useMemo(
    () => equation?.sideEffects ? equation.sideEffects[sideEffectId] : undefined,
    [equation, sideEffectId]
  );

  const button = useSelector(selectCurrentButton)!
  const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)
  const currentTrigger = useSelector((state: RootState) => {
    if (!currentSideEffect || !currentSideEffect.target) return undefined;

    return resolveEntity(state, currentSideEffect.target) as Trigger | undefined
  })

  const { handleTriggerChange } = useSideEffects()

  const handleSelect = (value: string) => {
    if (value === "none") {
      handleTriggerChange(equation.id)(sideEffectId)(null);
      return;
    }
    const triggerId = parseInt(value);
    if (Number.isNaN(triggerId)) return;
    const path = makePath.trigger(selectedSetId, button.id, triggerId);
    handleTriggerChange(equation.id)(sideEffectId)(path);
  };

  if (currentSideEffect === undefined) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="Select trigger">
        <Button variant="outline" className="w-fit">
          {currentTrigger?.name ?? "None"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Trigger</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentSideEffect.target ? String(currentSideEffect.target[2].id) : "none"}
          onValueChange={handleSelect}
        >
          <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
          <TriggerList triggers={Object.values(button.triggers)} />
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TriggerList = ({ triggers }: { triggers: Trigger[] }) => {
  const trigger = useSelector(selectCurrentTrigger)
  return <>
    {triggers.map((t) => {
      if (t.id === 0 || t.name === "" || t.id === trigger.id) return null;
      return (
        <DropdownMenuRadioItem key={t.id} value={String(t.id)}>
          {t.name}
        </DropdownMenuRadioItem>
      );
    })}
  </>
}
