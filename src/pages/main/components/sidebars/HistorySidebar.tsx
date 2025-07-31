
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {type ButtonPressRecord, toggleExtended} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import { clearHistory} from "../../../../store/history-sidebar/historySidebarSlice.ts";

const HistorySideBar = () => {

    const buttonHistory = useSelector((state: RootState) => state.historySidebar.rollHistory)
    const sidebarExtended = useSelector((state: RootState) => state.historySidebar.extended)

    const dispatch = useDispatch()

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [buttonHistory]);


    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [sidebarExtended, buttonHistory]);

    return (
        <aside
            className={
                "min-h-screen transition bg-blue-700" +
                ` transition-all ${sidebarExtended ? "w-150" : "w-15"}`
            }
        >
            <nav
                className={
                    "min-h-screen h-full flex flex-col bg-blue-700 border-l"
                }>
                <div
                    className={
                        "p-4 pb-2 flex justify-start"
                    }
                >
                    <button
                        onClick={() => dispatch(toggleExtended())}
                        className={"focus:outline-none p-0"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-clock"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="12" cy="12" r="9"/>
                            <polyline points="12 7 12 13 15 15"/>
                        </svg>

                    </button>
                </div>
                <div className={"flex-1  w-full h-full " + (sidebarExtended ? "block" : "hidden")}>
                    <div className="flex flex-col h-full w-full">
                        <button className={"w-full p-4 m-4 border-2 border-white"} onClick={() => {
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
                                    const isLast = index === buttonHistory.length - 1;
                                    const lastItemBorder = "border-4 border-white"
                                    const border = isLast ? lastItemBorder : "";

                                    return (
                                        <li
                                            key={index}
                                            className={
                                                "p-4 my-2 w-full text-white m-4 rounded-lg " +
                                                historyData.color +
                                                " h-fit max-w-80 text-left " + border
                                            }
                                        >

                                            <p className={"ml-auto text-sm w-fit"}>{historyData.date}</p>
                                            <p>From: {historyData.username}</p>
                                            <h3 className={"mr-auto font-bold text-xl"}>
                                                {historyData.name}
                                            </h3>

                                            {historyData.rollResult &&
                                                historyData.rollResult.map((rollResult, index) => {


                                                    return (
                                                        <div key={index} className={"text-left py-4 px-4 "}>
                                                            <p className={"font-bold"}>{rollResult.name}</p>
                                                            <div className={"flex flex-col ml-2 "}>
                                                                <p className={"text-lg font-bold"}>Total: {rollResult.total}</p>
                                                                <p>With Advantage: {rollResult.totalAdv}</p>
                                                                <p>With Disadvantage: {rollResult.totalDis}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </li>
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
