import { isEmpty } from 'lodash';
import React, { createContext, useState } from 'react';
import './App.css';
import Table from './Table';

export const StateContext = createContext();

const CATEGORY = { 1: "FOOD", 2: "TRAVEL", 3: "SUPPLIES" };

function App() {
  const [users, setUsers] = useState({});
  const [expenses, setExpenses] = useState({});
  const [categories, setCategories] = useState({
    1: { ID: 1, CATEGORY: "FOOD", TOTALEXPENSES: 0 },
    2: { ID: 2, CATEGORY: "TRAVEL", TOTALEXPENSES: 0 },
    3: { ID: 3, CATEGORY: "SUPPLIES", TOTALEXPENSES: 0 },
  });
  const [userExpenses, setUserExpenses] = useState({});

  const addUser = () => {
    const id = Date.now();
    const newUser = { ID: id, FIRSTNAME: "", LASTNAME: "", TOTALEXPENSE: 0 };

    setUsers({
      ...users,
      [id]: newUser,
    });

    setUserExpenses({
      ...userExpenses,
      [id]: new Set(),
    });
  }

  const saveUser = (user) => {
    if (isEmpty(user.FIRSTNAME) || isEmpty(user.LASTNAME)) {
      alert("FIRST NAME or LAST NAME is empty");
      return;
    }

    setUsers({
      ...users,
      [user.ID]: user,
    });
  }

  const deleteUser = (id) => {
    const usersCopy = { ...users };
    const userExpensesCopy = { ...userExpenses };
    const expensesCopy = { ...expenses };
    const categoriesCopy = { ...categories };
    
    // Delete each user's expense
    userExpensesCopy[id].forEach((expenseId) => {
      debugger
      const categoryId = expensesCopy[expenseId].CATEGORY;
      const cost = expensesCopy[expenseId].COST;

      // Decrement company's category expenses
      categoriesCopy[categoryId].TOTALEXPENSES -= cost;

      delete expensesCopy[expenseId];
    });

    delete usersCopy[id];
    delete userExpensesCopy[id];

    setUsers(usersCopy);
    setUserExpenses(userExpensesCopy);
    setExpenses(expensesCopy);
    setCategories(categoriesCopy);
  }

  const addExpense = () => {
    const expenseId = Date.now();
    const newExpense = {
      ID: expenseId, 
      USERID: "",
      CATEGORY: "",
      DESCRIPTION: "",
      COST: 0,
    }

    setExpenses({
      ...expenses,
      [expenseId]: newExpense,
    });
  }

  const saveExpense = (expense) => {
    if (isEmpty(expense.USERID) || isEmpty(expense.CATEGORY) || expense.COST <= 0 || isNaN(expense.COST)) {
      alert("User or Category is unselected or cost must be a number that is greater than 0");
      return;
    }

    const userId = expense.USERID, categoryId = expense.CATEGORY;
    const currUserId = expenses[expense.ID].USERID;

    // Update user's expense number
    const usersCopy = { ...users };
    const oldCost = expenses[expense.ID].COST; // Update user's expense when updating an existing expense

    if (currUserId === "") {
      // Add a new expense to a user
      usersCopy[userId].TOTALEXPENSE += parseFloat(expense.COST);
    } else if (userId === currUserId) {
      // Update to the same user
      usersCopy[userId].TOTALEXPENSE = usersCopy[userId].TOTALEXPENSE - oldCost + parseFloat(expense.COST);
    } else if (userId !== currUserId) {
      // Change user
      usersCopy[currUserId].TOTALEXPENSE -= expenses[expense.ID].COST; // Revert old user's total expense
      usersCopy[userId].TOTALEXPENSE += parseFloat(expense.COST); // Add expense to new user
    }
    
    // Update company's expense
    const categoriesCopy = { ...categories };
    categoriesCopy[categoryId].TOTALEXPENSES = categoriesCopy[categoryId].TOTALEXPENSES - oldCost + parseFloat(expense.COST);
    
    // Update user's expenses items
    const userExpensesCopy = { ...userExpenses };
    userExpensesCopy[userId].add(expense.ID);

    if (currUserId !== "" && userId !== currUserId) {
      userExpensesCopy[currUserId].delete(expense.ID);
    }

    // Update expense
    const expensesCopy = { ...expenses };
    expensesCopy[expense.ID] = expense;

    setUsers(usersCopy);
    setExpenses(expensesCopy);
    setCategories(categoriesCopy);
    setUserExpenses(userExpensesCopy);
  }

  const deleteExpense = (id) => {
    const expensesCopy = { ...expenses };

    const userId = expensesCopy[id].USERID, categoryId = expensesCopy[id].CATEGORY;
    
    const usersCopy = { ...users };
    const categoriesCopy = { ...categories };
    const userExpensesCopy = { ...userExpenses };
    
    usersCopy[userId].TOTALEXPENSE -= expenses[id].COST;
    categoriesCopy[categoryId].TOTALEXPENSES -= expenses[id].COST;
    userExpensesCopy[userId].delete(id);

    delete expensesCopy[id];

    setExpenses(expensesCopy);
    setUsers(usersCopy);
    setCategories(categoriesCopy);
    setUserExpenses(userExpensesCopy);
  }

  const validUsers = {};
  for (const key in users) {
    if (!isEmpty(users[key].FIRSTNAME) && !isEmpty(users[key].LASTNAME)) {
      validUsers[users[key].ID] = `ID[${users[key].ID}] ${users[key].FIRSTNAME} ${users[key].LASTNAME}`;
    }
  }

  return (
    <div className="App">
      <StateContext.Provider value={{ FULLNAME: validUsers, CATEGORY, categories, users, expenses }}>
        <Table 
          addEntry={addUser} 
          columns={["ID", "FIRSTNAME", "LASTNAME", "TOTALEXPENSE"]} 
          columnsTypes={["div", "input", "input", "div"]}
          deleteEntry={deleteUser}
          saveEntry={saveUser}
          type="users"
        />
        <Table 
          addEntry={addExpense} 
          columns={["ID", "FULLNAME", "CATEGORY", "DESCRIPTION", "COST"]} 
          columnsTypes={["div", "dropdown", "dropdown", "input", "input"]}
          deleteEntry={deleteExpense}
          saveEntry={saveExpense}
          type="expenses"
        />
        <Table 
          columns={["CATEGORY", "TOTALEXPENSES"]} 
          columnsTypes={["div", "div"]}
          readOnly={true}
          type="categories"
        />
        Click Save to commit changes!
      </StateContext.Provider>
    </div>
  );
}

export default App;
