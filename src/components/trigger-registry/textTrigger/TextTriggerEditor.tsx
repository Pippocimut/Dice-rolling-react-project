import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectCurrentTrigger, setTrigger } from "@/store/button-sets/buttonSetSlice";
import { useDispatch, useSelector } from "react-redux";

export const TextTriggerEditor: React.FC = () => {

  const trigger = useSelector(selectCurrentTrigger)!;
  const dispatch = useDispatch();

  if (trigger?.type !== "text") return null;

  return (
    <div className="flex flex-col bg-background text-text gap-2 h-fit w-full justify-start items-start">
      <Label htmlFor="rollText">Text:</Label>
      <Input
        id="rollText"
        placeholder="Text to display on roll"
        value={trigger.text}
        onChange={(e) => dispatch(setTrigger({
          trigger: {
            ...trigger, text: e.target.value
          }
        }))}
      />
    </div>
  );
};