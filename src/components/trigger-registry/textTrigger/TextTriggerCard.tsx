import type { TextTrigger } from "@/store/button-sets/buttonSetSlice";

export const TextTriggerCard: React.FC<{ trigger: TextTrigger }> = ({ trigger }) => {
    const { text } = trigger;

    return <>{text.length > 20 ? text.substring(0, 20) + "..." : text}</>;
};
