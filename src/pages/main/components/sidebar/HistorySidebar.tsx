import {
  useButtonPressedHistory,
  type ButtonPressRecord,
} from "../../../../data/rollHistoryDAO";
import Sidebar from "./Sidebar";

const HistorySideBar = () => {
  const [buttonHistory] = useButtonPressedHistory();

  return (
    <Sidebar direction={"right"}>
      {buttonHistory &&
        buttonHistory.map((historyData: ButtonPressRecord, index: number) => {
          return (
            <div
              key={index}
              className={
                "p-4 w-full my-4 text-white " +
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
            </div>
          );
        })}
    </Sidebar>
  );
};

export default HistorySideBar;
