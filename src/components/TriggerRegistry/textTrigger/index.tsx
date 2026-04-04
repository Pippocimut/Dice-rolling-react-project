import type { TextTrigger } from "@/store/button-sets/buttonSetSlice";
import type { TriggerHandler } from "../triggerRegistry";
import { TextTriggerEditor } from "./TextTriggerEditor";
import { TextTriggerCard } from "./TextTriggerCard";
import type { TextTriggerResult } from "@/store/historySidebarSlice";

export const textTriggerHandler: TriggerHandler<TextTrigger> = {
  label: "Text",

  defaultData: (base, previous) => ({
    ...base,
    type: "text",
    text: previous?.type === "text" ? previous.text : "Triggered!",
  } satisfies TextTrigger),

  EditorComponent: TextTriggerEditor,
  CardComponent: TextTriggerCard,

  execute: (trigger) => (_dispatch, _getState): TextTriggerResult => ({
    type: "text",
    name: trigger.name,
    text: trigger.text ?? "",
  }),
}