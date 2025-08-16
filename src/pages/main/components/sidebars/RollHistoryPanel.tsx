import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {
    type ButtonPressRecord,
    setSelectedResult,
} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import {clearHistory} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import {FaDiceD20} from "react-icons/fa";

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

    return (<div className="flex flex-col h-full w-full">
            <button className={"w-full mx-auto rounded-lg p-4 m-4 border-2 border-white hover:bg-blue-500"}
                    onClick={() => {
                        dispatch(clearHistory())
                    }}>
                Clear History
            </button>
            <ul
                className={` px-3 flex-col gap-2 w-full h-90 transition-all overflow-y-auto`}
                ref={listRef}
            >
                {buttonHistory &&
                    buttonHistory.map((historyData: ButtonPressRecord, index: number) => {
                        const isSelected = selectedResult === historyData.id;
                        const lastItemBorder = "outline-4 outline-white text-white"
                        const hoverBehavior = "hover:outline-4 hover:outline-white"
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
                                    "p-4 my-4 w-full rounded-lg h-fit max-w-80 text-left " +
                                    historyData.color + " " + border + " " + hoverBehavior
                                }
                            >
                                <div className="w-full flex flex-col items-start justify-start">
                                    {/* Custom icon */}
                                    <div className="toast-icon">
                                        <FaDiceD20 size={24} className="dice-icon"/>
                                    </div>

                                    {/* Toast content */}
                                    <div className="w-full flex flex-col items-start justify-start">
                                        <p className={"ml-auto text-sm w-full text-right"}>{historyData.date}</p>
                                        <p>From: {historyData.username}</p>
                                        <h3 className={"mr-auto font-bold text-xl"}>
                                            {historyData.name}
                                        </h3>

                                        {historyData.rollResult &&
                                            historyData.rollResult.map((rollResult, index) => {
                                                return (
                                                    <div key={index} className={"text-left py-4 px-4 "}>
                                                        <p className={"font-bold text-lg"}>{rollResult.name}</p>
                                                        <div className={"flex flex-col ml-2 my-1"}>
                                                            <div
                                                                className={"flex flex-row gap-1 flex-wrap text-lg font-bold"}>
                                                                <p>Total: </p>
                                                                <p>
                                                                    {rollResult.result} = {rollResult.total}
                                                                </p>
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
