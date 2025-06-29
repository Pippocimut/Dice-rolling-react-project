import {
    useButtonPressedHistory,
    type ButtonPressRecord,
} from "../../../../data/rollHistoryDAO";
import Sidebar from "./Sidebar.tsx";
import {useEffect, useRef} from "react";

const HistorySideBar = () => {
    const [buttonHistory, updateButtonHistory] = useButtonPressedHistory();

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [buttonHistory]);

    return (
        <Sidebar direction={"right"} defaulExpanded={true}>
            <div className="flex flex-col h-full w-full">
                <button className={"w-full p-4"} onClick={() => {
                    updateButtonHistory([])
                }}>
                    Clear History
                </button>
                <ul
                    className={`flex-1 px-3 flex-col gap-2 w-full h-full max-h-[calc(100vh-120px)] transition-all overflow-y-auto`}
                    ref={listRef}
                >
                    {buttonHistory &&
                        buttonHistory.map((historyData: ButtonPressRecord, index: number) => {
                            return (
                                <li
                                    key={index}
                                    className={
                                        "p-4 my-2 w-full text-white " +
                                        historyData.color +
                                        " h-fit max-w-80 text-left"
                                    }
                                >
                                    <h3 className={"mr-auto font-bold text-xl"}>
                                        {historyData.name}
                                    </h3>
                                    <p>{historyData.tag}</p>

                                    {historyData.rollResult &&
                                        historyData.rollResult.map((rollResult, index) => {
                                            return (
                                                <div key={index} className={"text-left py-4 px-4"}>
                                                    <p>Roll for: {rollResult.name}</p>
                                                    <p>Total: {rollResult.total}</p>
                                                    <p>With Advantage: {rollResult.totalAdv}</p>
                                                    <p>With Disadvantage: {rollResult.totalDis}</p>
                                                </div>
                                            );
                                        })}
                                </li>
                            );
                        })}
                </ul>
            </div>
        </Sidebar>
    );
};

export default HistorySideBar;
