import {useEffect, useRef, useState} from "react";

type Props = {
    direction: "left" | "right";
    defaulExpanded?: boolean;
    children: React.ReactNode;
};

export default function Sidebar({children, direction = "left", defaulExpanded = false}: Props) {
    const [expanded, setExpanded] = useState(defaulExpanded || false);

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [children, expanded]);

    return (
        <aside
            className={
                "min-h-screen max-h-screen h-screen " +
                ` transition-all ${expanded ? "w-120" : "w-15"}`
            }
        >
            <nav
                className={
                    "h-full flex flex-col bg-neutral-700 " +
                    (direction === "right" ? "border-l" : "border-r") +
                    " shadow-sm"
                }>
                <div
                    className={
                        "p-4 pb-2 flex " +
                        (direction === "left" ? "justify-end" : "justify-start")
                    }
                >
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
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
                            className={
                                "icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
                            }
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 6l16 0"/>
                            <path d="M4 12l16 0"/>
                            <path d="M4 18l16 0"/>
                        </svg>
                    </button>
                </div>
                <div className={"flex-1 px-3 w-full h-full "+ (expanded ? "block" : "hidden")}>
                    {children}
                </div>
            </nav>
        </aside>
    );
}
