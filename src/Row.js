import React from "react";

const Input = ({id, col, value, updateEntry}) => {
  const onChange = (e) => {
    updateEntry(id, col, e.target.value);
  }

  return <input value={value} onChange={onChange} />; 
}

// Take event listener, and props
const Component = (id, col, type, props, updateEntry) => {
  if (type === "div") {
    return <div>{props}</div>
  } else if (type === "input") {
    // Another component
    return ( 
      <Input
        id={ id}
        col={col}
        value={props}
        updateEntry={updateEntry} 
      />
    );
  } else if (type === "dropdown") {
    // Another component
    return <div {...props}>DROPDOWN</div>
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