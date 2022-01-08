import { clone, cloneDeep, isEmpty } from 'lodash';
import React, { useState } from 'react';
import './App.css';
import Table from './Table';

const Users = {
  1: { ID: 1, FIRSTNAME: "JINHUA", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
  2: { ID: 2, FIRSTNAME: "JIN", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
  3: { ID: 3, FIRSTNAME: "JINNIE", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
}

function App() {
  const [users, setUsers] = useState(Users);
  const [expenses, setExpenses] = useState({});
  const [categories, setCategories] = useState({});
  const [collections, setCollections] = useState({});

  const addUser = () => {
    const id = Math.floor(Math.random() * 100);
    const newUser = { ID: id, FIRSTNAME: "", LASTNAME: "", TOTALEXPENSE: 0 };
    setUsers({
      ...users,
      [id]: newUser,
    });
  }

  const updateUser = (id, key, value) => {
    const user = cloneDeep(users[id]);
    user[key] = value;

    setUsers({
      ...users,
      [id]: user,
    });
  }

  const saveUser = (id) => {
    if (isEmpty(users[id].FIRSTNAME) || isEmpty(users[id].LASTNAME)) {
      alert("FIRST NAME or LAST NAME is empty");
    }
  }

  const deleteUser = (id) => {
    const usersCopy = cloneDeep(users);
    delete usersCopy[id];

    setUsers(usersCopy);
  }

  const addExpense = () => {

  }

  const deleteExpense = () => {

  }

  return (
    <div className="App">
      <Table 
        data={users} 
        columns={["ID", "FIRSTNAME", "LASTNAME", "TOTALEXPENSE"]} 
        addEntry={addUser}
        updateEntry={updateUser}
        deleteEntry={deleteUser}
        saveEntry={saveUser}
        columnsTypes={["div", "input", "input", "div"]}
      />
      {/* <Table 
        data={expenses} 
        columns={["FULL NAME", "CATEGORY", "DESCRIPTION", "COST"]} 
        addEntry={addExpense}
      />
      <Table 
        data={categories} 
        columns={["CATEGORY", "TOTAL EXPENSES"]}
      /> */}
    </div>
  );
}

export default App;
