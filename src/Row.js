import React, { useContext } from "react";
import { StateContext } from "./App";

const Input = ({id, col, value, updateEntry}) => {
  const onChange = (e) => {
    updateEntry(id, col, e.target.value);
  }

  return <input value={value} onChange={onChange} />; 
}

const DropDown = ({id, col, selectedId, updateEntry}) => {
  const state = useContext(StateContext);
  const options = state[col]; // col is FULLNAME or CATEGORY

  const onChange = (e) => {
    updateEntry(id, col, e.target.value);
  }

  return (
    <select onChange={onChange} value={options[selectedId]}>
      {Object.keys(options).map((optionId) => {
        return (
          <option            
            key={optionId}
            value={optionId}
          >
            {options[optionId]}
          </option>
        );   
      })}
    </select>
  );
}

// Take event listener, and props
const Component = (id, col, type, props, updateEntry) => {
  console.log(id, col, type, props)
  if (type === "div") {
    return <div>{props}</div>
  } else if (type === "input") {
    // Another component
    return ( 
      <Input
        id={id}
        col={col}
        value={props}
        updateEntry={updateEntry} 
      />
    );
  } else if (type === "dropdown") {
    // Another component
    return ( 
      <DropDown
        id={id}
        col={col}
        selected={props}
        updateEntry={updateEntry} 
      />
    );
  }
}

const Row = ({ data, columnsTypes, columns, saveEntry, updateEntry, deleteEntry }) => {
  const onClickSave = () => {
    saveEntry(data.ID);
  }
  
  const onClickDelete = () => {
    deleteEntry(data.ID);
  }
  
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {columns.map((col, idx) => {
        return Component(data.ID, col, columnsTypes[idx], data[col], updateEntry);
      })}
      <button onClick={onClickSave}>save</button>
      <button onClick={onClickDelete}>delete</button>
    </div>
  );
}

export default Row;