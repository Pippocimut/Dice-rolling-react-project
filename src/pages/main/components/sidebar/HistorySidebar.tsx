import {
  useButtonPressedHistory,
  type ButtonPressRecord,
} from "../../../../data/rollHistoryDAO";
import Sidebar from "./Sidebar";

const HistorySideBar = () => {
  const [buttonHistory] = useButtonPressedHistory();

  return (
    <Sidebar direction={"right"}>
      <ul
        id="history"
        className={
          "flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"
        }
      >
        {buttonHistory &&
          buttonHistory.map((historyData: ButtonPressRecord, index: number) => {
            return (
              <div
                key={index}
                className={
                  "p-4 m-4 text-white " +
                  historyData.color +
                  " h-fit max-w-80 text-left"
                }
              >
                <h3 className={"mr-auto font-bold text-xl"}>
                  {historyData.name}
                </h3>
                <p>{historyData.tag}</p>
              </div>
            );
          })}
      </ul>
    </Sidebar>
  );
};

export default HistorySideBar;
