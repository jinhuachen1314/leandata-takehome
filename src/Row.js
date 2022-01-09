import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "./App";

const Input = ({
  col,
  value,
  handleOnChange
}) => {
  const onChange = (e) => {
    handleOnChange(col, e.target.value);
  }

  return <input onChange={onChange} value={value} />; 
}

const DropDown = ({
  col,
  selected,
  onChange
}) => {
  const state = useContext(StateContext);
  const options = state[col];

  const handleOnChange = (e) => {
    onChange(col, e.target.value);
  }

  return (
    <select
      onChange={handleOnChange}
      value={selected || "Choose an option"}
    >
      <option disabled>Choose an option</option>
      {Object.keys(options).map((optionId) => (
        <option            
          key={optionId}
          value={optionId}
        >
          {options[optionId]}
        </option>
      ))}
    </select>
  );
}

const Component = (id, col, type, value, onChange, columnWidth) => {
  if (type === "div") {
    return <div key={col} style={{ width: columnWidth }}>{value}</div>;
  } else if (type === "input") {
    return (
      <div key={col} style={{ width: columnWidth }}>
        <Input
          col={col}
          handleOnChange={onChange}
          id={id}
          value={value}
        />
      </div>
    );
  } else if (type === "dropdown") {
    return ( 
      <div key={col} style={{ width: columnWidth }}>
        <DropDown
          col={col}
          onChange={onChange}
          selected={value}
        />
      </div>
    );
  }
}

const Row = ({
  data,
  columnsTypes,
  columns,
  saveEntry,
  deleteEntry,
  readOnly,
  columnWidth
}) => {
  const [localData, setLocalData] = useState(data);
  
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const onClickSave = () => {
    saveEntry(localData);
  }
  
  const onClickDelete = () => {
    deleteEntry(data.ID);
  }

  const onChange = (col, value) => {
    const dataCopy = { ...localData };

    if (col === "FULLNAME") col = "USERID";
    dataCopy[col] = value;
    setLocalData(dataCopy);
  }
  
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {columns.map((col, idx) => {
        const value = col !== "FULLNAME" ? localData[col] : localData["USERID"];
        return Component(localData.ID, col, columnsTypes[idx], value, onChange, columnWidth);
      })}
      {!readOnly && <button onClick={onClickSave} style={{ width: columnWidth }}>save</button>}
      {!readOnly && <button onClick={onClickDelete} style={{ width: columnWidth }}>delete</button>}
    </div>
  );
}

export default Row;