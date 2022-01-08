import { clone, cloneDeep, isEmpty } from 'lodash';
import React, { createContext, useState } from 'react';
import './App.css';
import Table from './Table';

export const StateContext = createContext();

const Users = {
  1: { ID: 1, FIRSTNAME: "JINHUA", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
  2: { ID: 2, FIRSTNAME: "JIN", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
  3: { ID: 3, FIRSTNAME: "JINNIE", LASTNAME: "CHEN", TOTALEXPENSE: 100 },
}

const CATEGORY = { 1: "FOOD", 2: "TRAVEL", 3: "SUPPLIES" };

function App() {
  const [users, setUsers] = useState(Users);
  const [expenses, setExpenses] = useState({});
  const [categories, setCategories] = useState({});

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
    const expenseId = Math.floor(Math.random() * 100);
    const userId = -1;
    const newExpense = {
      ID: expenseId, 
      USERID: userId,
      CATEGORY: "",
      DESCRIPTION: "",
      COST: 0,
    }

    setExpenses({
      ...expenses,
      [expenseId]: newExpense,
    });
  }

  const updateExpense = (id, key, value) => {
    if (key === "FULLNAME") {
      key = "USERID";
    }

    const expense = cloneDeep(expenses[id]);
    expense[key] = value;

    setExpenses({
      ...expenses,
      [id]: expense,
    });
  }

  const saveExpense = (id) => {
    if (expenses[id].USERID === -1 || isEmpty(expenses[id].CATEGORY) || expenses[id].COST <= 0) {
      alert("User or Category is unselected or cost must be greater than 0");
    }

    const user = cloneDeep(users[expenses[id].USERID]);
    user.TOTALEXPENSE += expenses[id].COST;

    setUsers({
      ...users,
      [user.ID]: user,
    });

    const categoryID = CATEGORY[expenses[id].CATEGORY];
    let totalExpense = categories[categoryID] === undefined ? 0 : categories[categoryID]; 
    totalExpense += expenses[id].COST;
    
    debugger
    setCategories({
      ...categories,
      [expenses[id].CATEGORY]: { CATEGORY: categoryID, TOTALEXPENSES: totalExpense}, 
    });
  }

  const deleteExpense = (id) => {
    const expensesCopy = cloneDeep(expenses);
    delete expensesCopy[id];

    setExpenses(expensesCopy);
  }

  const validUsers = {};
  for (const key in users) {
    if (!isEmpty(users[key].FIRSTNAME) && !isEmpty(users[key].LASTNAME)) {
      validUsers[users[key].ID] = `ID[${users[key].ID}] ${users[key].FIRSTNAME} ${users[key].LASTNAME}`;
    }
  }

  return (
    <div className="App">
      <StateContext.Provider value={{ FULLNAME: validUsers, CATEGORY }}>
        <Table 
          data={users} 
          columns={["ID", "FIRSTNAME", "LASTNAME", "TOTALEXPENSE"]} 
          addEntry={addUser}
          updateEntry={updateUser}
          deleteEntry={deleteUser}
          saveEntry={saveUser}
          columnsTypes={["div", "input", "input", "div"]}
        />
        <Table 
          data={expenses} 
          columns={["ID", "FULLNAME", "CATEGORY", "DESCRIPTION", "COST"]} 
          addEntry={addExpense}
          updateEntry={updateExpense}
          deleteEntry={deleteExpense}
          saveEntry={saveExpense}
          columnsTypes={["div", "dropdown", "dropdown", "input", "input"]}
        />
        <Table 
          data={categories} 
          columns={["CATEGORY", "TOTALEXPENSES"]}
          columnsTypes={["div", "div"]}
        />
      </StateContext.Provider>
    </div>
  );
}

export default App;
