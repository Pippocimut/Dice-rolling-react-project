import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {
    type ButtonPressRecord,
    setSelectedResult,
    toggleExtended
} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import {clearHistory} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import {FaDiceD20} from "react-icons/fa";

const HistorySideBar = () => {

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


    return (
        <aside
            className={
                `min-h-screen transition-all overflow-hidden transform duration-300 ease-in-out py-4 border-l bg-[var(--secondary-background-color)]` +
                ` ${sidebarExtended
                    ? "w-1/4 px-4 max-w-100"
                    : "w-1/12 max-w-15"
                }
`}
        >
            <nav
                className={
                    "min-h-screen flex flex-col "
                }>
                <div
                    className={
                        "p-4 pb-2 flex justify-start"
                    }
                >
                    <button
                        onClick={() => dispatch(toggleExtended())}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="9"/>
                            <polyline points="12 7 12 13 15 15"/>
                        </svg>

                    </button>
                </div>
                <div className={"flex-1 w-full h-full " + (sidebarExtended ? "block" : "hidden")}>
                    <div className="flex flex-col h-full w-full">
                        <button className={"w-full mx-auto rounded-lg p-4 m-4 border-2 border-white hover:bg-blue-500"}
                                onClick={() => {
                                    dispatch(clearHistory())
                                }}>
                            Clear History
                        </button>
                        <ul
                            className={`flex-1 px-3 flex-col gap-2 w-full h-full max-h-[calc(100vh-150px)] transition-all overflow-y-auto`}
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
                                                </div>
                                            </div>


                                        </button>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default HistorySideBar;
