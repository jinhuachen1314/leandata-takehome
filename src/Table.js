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
        {columns.map((col, idx)=> <div style={{ width: colWidth }} key={idx}>{col}</div>)}
        {!readOnly && <div style={{ width: colWidth }}/>}
        {!readOnly && <div style={{ width: colWidth }}/>}
      </div>
      {Object.keys(data).map(eleId => 
        <Row
          key={eleId}
          data={data[eleId]}
          columns={columns}
          columnsTypes={columnsTypes}
          saveEntry={saveEntry}
          updateEntry={updateEntry}
          deleteEntry={deleteEntry}
          readOnly={readOnly}
          columnWidth={colWidth}
        />
      )}
      {!readOnly && <button onClick={addEntry}>{`Add ${type}`}</button>}
    </div>
  );
}

export default Table;