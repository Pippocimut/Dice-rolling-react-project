import type {ButtonPressRecord} from "@/store/history-sidebar/historySidebarSlice.ts";

type Props = {
    historyData: ButtonPressRecord
}

export function CustomRollToast({historyData}: Props) {

    const rollResultPresent = historyData.rollResult && historyData.rollResult.length > 0;
    const onlyOneRoll = rollResultPresent && historyData.rollResult.length === 1;
    const moreThanOneRoll = rollResultPresent && historyData.rollResult.length > 1;

    return (<div className="w-fit flex flex-col items-start justify-start p-2">
        <h3 className={"font-bold text-xl"}>
            {historyData.name}
        </h3>
        {onlyOneRoll && <div className={"text-left py-2 pl-2"}>
            <div className={"flex flex-col"}>
                <div className={"flex flex-row gap-1 flex-wrap text-lg font-bold"}>
                    <p>Total: </p>
                    <p>
                        {historyData.rollResult[0].result} = {historyData.rollResult[0].total}
                    </p>
                </div>
            </div>
        </div>}
        {moreThanOneRoll && historyData.rollResult.map((rollResult, index) => {
                return (
                    <div key={index} className={"text-left py-2 pl-2"}>
                        <p className={"font-bold text-lg"}>{rollResult.name}</p>
                        <div className={"flex flex-col ml-2 my-1"}>
                            <div className={"flex flex-row gap-1 flex-wrap text-lg font-bold"}>
                                <p>Total: </p>
                                <p>
                                    {rollResult.result} = {rollResult.total}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
    </div>)
}