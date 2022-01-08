import { isEmpty } from 'lodash';
import React, { createContext, useState } from 'react';
import './App.css';
import Table from './Table';

export const StateContext = createContext();

const CATEGORY = { 1: "FOOD", 2: "TRAVEL", 3: "SUPPLIES" };

function App() {
  const [users, setUsers] = useState({});
  const [expenses, setExpenses] = useState({});
  const [categories, setCategories] = useState({});
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
    
    userExpensesCopy[id].forEach((value) => {
      const categoryId = expensesCopy[value].CATEGORY;
      const cost = expensesCopy[value].COST;

      categoriesCopy[categoryId].TOTALEXPENSES -= cost;
      delete expensesCopy[value];
    });

    delete usersCopy[id];
    delete userExpensesCopy[id];

    setUsers(usersCopy);
    setUserExpenses(userExpensesCopy);
    setExpenses(expensesCopy);
    setCategories(categories);
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
    if (isEmpty(expense.USERID) || isEmpty(expense.CATEGORY) || expense.COST <= 0) {
      alert("User or Category is unselected or cost must be greater than 0");
      return;
    }

    // Update user's expense number
    const userCopy = { ...users[expense.USERID] };
    const oldCost = expenses[expense.ID].COST;
    userCopy.TOTALEXPENSE = userCopy.TOTALEXPENSE - oldCost + parseFloat(expense.COST);

    // Update company's expense
    const categoryCopy = categories[expense.CATEGORY] === undefined 
                        ? { ID: expense.CATEGORY, TOTALEXPENSES: 0, CATEGORY: "" } 
                        : { ...categories[expense.CATEGORY] };
    
    categoryCopy.CATEGORY = CATEGORY[expense.CATEGORY];
    categoryCopy.TOTALEXPENSES = categoryCopy.TOTALEXPENSES - oldCost + parseFloat(expense.COST);
    
    // Update user's expenses items
    const userExpensesCopy = { ...userExpenses };
    userExpensesCopy[expense.USERID].add(expense.ID);

    setUsers({
      ...users,
      [userCopy.ID]: userCopy, 
    });

    setExpenses({
      ...expenses,
      [expense.ID]: expense,
    });

    setCategories({
      ...categories,
      [categoryCopy.ID]: categoryCopy,
    });

    setUserExpenses({
      ...userExpensesCopy,
    });
  }

  const deleteExpense = (id) => {
    const expensesCopy = { ...expenses };

    const userID = expensesCopy[id].USERID;
    const categoryID = expensesCopy[id].CATEGORY;
    
    const user = { ...users[userID] };
    const category = { ...categories[categoryID] };
    const userExpensesCopy = { ...userExpenses };
    
    user.TOTALEXPENSE -= expenses[id].COST;
    category.TOTALEXPENSES -= expenses[id].COST;
    userExpensesCopy[userID].delete(id);

    delete expensesCopy[id];

    setExpenses(expensesCopy);
    setUsers({ ...users, [userID]: user });
    setCategories({ ...categories, [categoryID]: category });
    setUserExpenses({ ...userExpensesCopy });
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
          type="users" 
          columns={["ID", "FIRSTNAME", "LASTNAME", "TOTALEXPENSE"]} 
          addEntry={addUser}
          deleteEntry={deleteUser}
          saveEntry={saveUser}
          columnsTypes={["div", "input", "input", "div"]}
        />
        <Table 
          type="expenses" 
          columns={["ID", "FULLNAME", "CATEGORY", "DESCRIPTION", "COST"]} 
          addEntry={addExpense}
          deleteEntry={deleteExpense}
          saveEntry={saveExpense}
          columnsTypes={["div", "dropdown", "dropdown", "input", "input"]}
        />
        <Table 
          type="categories" 
          columns={["CATEGORY", "TOTALEXPENSES"]}
          columnsTypes={["div", "div"]}
          readOnly={true}
        />
        Click Save to commit changes
      </StateContext.Provider>
    </div>
  );
}

export default App;
