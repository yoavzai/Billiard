import { useDispatch, useSelector } from "react-redux";
import TableComp from "./table";
import { addTable } from "./utils";

export default function TablesComp() {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.tables);

  return (
    <div className="tables_container container">
      <h2>שולחנות</h2>
      <div className="buttons_container">
        <button className="button" onClick={() => addTable(tables, dispatch)}>
          הוסף שולחן
        </button>
      </div>
      <div className="tabels_grid">
        {tables
          .sort((a, b) => b.data.date - a.data.date)
          .map((table) => {
            return <TableComp key={table.id} table={table}></TableComp>;
          })}
      </div>
    </div>
  );
}
