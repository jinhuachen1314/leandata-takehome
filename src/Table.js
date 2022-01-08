import React from "react";
import Row from "./Row";

const Table = ({ 
  data, 
  columns, 
  addEntry, 
  updateEntry,
  deleteEntry,
  saveEntry,
  columnsTypes, 
}) => {
  // debugger
  return (
    <div style={{ border: "2px solid black" }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {columns.map((col, idx)=> <div key={idx}>{col}</div>)}
      </div>
      {Object.keys(data).map(ele => 
        <Row
          key={ele}
          data={data[ele]}
          columns={columns}
          columnsTypes={columnsTypes}
          saveEntry={saveEntry}
          updateEntry={updateEntry}
          deleteEntry={deleteEntry}
        />
      )}
      <button onClick={addEntry}>Add Things</button>
    </div>
  );
}

export default Table;