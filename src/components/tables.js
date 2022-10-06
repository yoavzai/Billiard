import { useDispatch, useSelector } from "react-redux";
import TableComp from "./table";
import { addTable } from "./utils";

export default function TablesComp() {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.tables);

  function numOfTakenTables() {
    return tables.filter(t => t.data.isTaken).length
  }

  return (
    <div className="tables_container container">
      <h2>שולחנות</h2>
      <div className="active_games_container">
        <span>משחקים פעילים: </span>  
        <span>{numOfTakenTables()}</span>
      </div>
      <div className="buttons_container">
        <button className="button" onClick={() => addTable(tables, dispatch)}>
          הוסף שולחן
        </button>
      </div>
      <div className="tabels_grid">
        {[...tables]
          .sort((a, b) => a.data.number - b.data.number)
          .map((table) => {
            return <TableComp key={table.id} table={table}></TableComp>;
          })}
      </div>
    </div>
  );
}
