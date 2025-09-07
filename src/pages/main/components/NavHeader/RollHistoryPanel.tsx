import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    type ButtonPressRecord,
    setSelectedResult,
} from "@/store/history-sidebar/historySidebarSlice.ts";
import {clearHistory} from "@/store/history-sidebar/historySidebarSlice.ts";
import {Button} from "@/components/ui/button.tsx";

const HistoryPanel = () => {

    const buttonHistory = useSelector((state: RootState) => state.historySidebar.rollHistory)
    const sidebarExtended = useSelector((state: RootState) => state.historySidebar.extended)
    const scrollDown = useSelector((state: RootState) => state.historySidebar.scrollDown)
    const manuallySelectedResult = useSelector((state: RootState) => state.historySidebar.selectedResult)
    const selectedResult = (manuallySelectedResult ?? buttonHistory[buttonHistory.length - 1]?.id) ?? 0

    const dispatch = useDispatch()

    useEffect(() => {
        if (listRef.current && scrollDown) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [buttonHistory, scrollDown, sidebarExtended]);

    const listRef = useRef<HTMLUListElement>(null);

    return (<div className="flex flex-col gap-4 h-[calc(100vh-120px)] w-fit">
            <Button className={"mt-4 w-fit mx-auto"}
                    onClick={() => {
                        dispatch(clearHistory())
                    }}>
                Clear History
            </Button>
            <ul className={` px-3 h-full flex-col w-full transition-all overflow-y-auto border-t-1 border-borders`} ref={listRef}>
                {buttonHistory.length === 0 && <p className={"text-center"}>No history yet</p>}
                {buttonHistory &&
                    buttonHistory.map((historyData: ButtonPressRecord, index: number) => {
                        const isSelected = selectedResult === historyData.id;
                        const lastItemBorder = "outline-4 outline-borders text-white"
                        const hoverBehavior = "hover:outline-4 hover:outline-borders"
                        const border = isSelected ? lastItemBorder : "text-neutral-300 opacity-70";

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (isSelected) {
                                        dispatch(setSelectedResult(null));
                                        return
                                    }
                                    dispatch(setSelectedResult(historyData.id))
                                }}
                                className={
                                    "p-4 my-2 w-full rounded-lg h-fit max-w-80 text-left " +
                                    historyData.color + " " + border + " " + hoverBehavior
                                }
                            >
                                <div className="w-full flex flex-col items-start justify-start">
                                    <div className="w-full flex flex-col items-start justify-start">
                                        <div className={"w-full flex flex-row justify-between"}>
                                            <p>From: {historyData.username}</p>
                                            <p>{historyData.date}</p>
                                        </div>
                                        <h3 className={"mr-auto font-bold text-xl"}>
                                            {historyData.name}
                                        </h3>

                                        {historyData.rollResult &&
                                            historyData.rollResult.map((rollResult, index) => {
                                                return (
                                                    <div key={index} className={"text-left py-2 px-2"}>
                                                        <p className={"font-bold text-lg"}>{rollResult.name}</p>
                                                        <div className={"flex flex-col ml-2 my-1"}>
                                                            <div className={"flex flex-row gap-1 flex-wrap text-lg font-bold"}>
                                                                <p>Total: </p>
                                                                <p>{rollResult.result} = {rollResult.total}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>


                            </button>
                        );
                    })}
            </ul>
        </div>
    );
};

export default HistoryPanel;
