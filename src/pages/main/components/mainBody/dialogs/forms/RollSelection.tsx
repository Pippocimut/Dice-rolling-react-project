import {Button} from "@/components/ui/button.tsx";
import CreateRollDialog from "@/pages/main/components/mainBody/dialogs/forms/RollForms/CreateRollDialog.tsx";
import type {Roll} from "@/pages/main/types.ts";
import RollsList from "@/pages/main/components/mainBody/dialogs/forms/RollsList.tsx";

type Props = {
    rolls: Roll[];
    setRolls: (rolls: Roll[]) => void;
}

export function RollSelection({rolls, setRolls}: Props) {
    return <div className={"flex flex-col justify-center items-center p-2"}>
        <div className={"flex flex-row gap-2 justify-center items-center"}>
            {(rolls.length > 0) && (
                <Button variant={"outline"} onClick={() => setRolls([])}>
                    Clear rolls
                </Button>
            )}
            
            <CreateRollDialog createRoll={(roll: Roll) => {
                setRolls([...rolls, roll]);
            }}/>
        </div>

        {(rolls.length > 0) && <RollsList rolls={rolls} setRolls={setRolls}/>}
    </div>
}