import type {ButtonPressRecord} from "@/store/history-sidebar/historySidebarSlice.ts";

type Props = {
    historyData: ButtonPressRecord
}

export function CustomRollToast({historyData}: Props) {
    return (<div className="w-full flex flex-col items-start justify-start p-2">
        <div className={"w-full flex flex-row justify-between"}>
            <p>From: {historyData.username}</p>
            <p className={"text-sm w-fit"}>{historyData.date}</p>
        </div>
        <h3 className={"mr-auto font-bold text-xl"}>
            {historyData.name}
        </h3>
        {historyData.rollResult &&
            historyData.rollResult.map((rollResult, index) => {
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