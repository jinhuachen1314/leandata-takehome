import React, { useContext } from "react";
import { StateContext } from "./App";
import Row from "./Row";

const Table = ({
  type,
  columns, 
  addEntry, 
  updateEntry,
  deleteEntry,
  saveEntry,
  columnsTypes,
  readOnly = false,
}) => {
  const state = useContext(StateContext);
  const data = state[type];
  const colWidth = `${1 / (columns.length + 2) * 100}%`;

  return (
    <div style={{ margin: "auto", border: "2px solid black", width: "90%" }}>
      <div>{`${type.toUpperCase()} TABLE`}</div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {columns.map((col, idx)=> <div key={idx} style={{ width: colWidth }}>{col}</div>)}
        {!readOnly && <div style={{ width: colWidth }}/>}
        {!readOnly && <div style={{ width: colWidth }}/>}
      </div>
      {Object.keys(data).map(eleId => 
        <Row
          columnWidth={colWidth}
          columns={columns}
          columnsTypes={columnsTypes}
          data={data[eleId]}
          deleteEntry={deleteEntry}
          key={eleId}
          readOnly={readOnly}
          saveEntry={saveEntry}
          updateEntry={updateEntry}
        />
      )}
      {!readOnly && <button onClick={addEntry}>{`Add ${type}`}</button>}
    </div>
  );
}

export default Table;