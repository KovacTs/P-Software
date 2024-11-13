import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Budget from "./components/Budget";
import Transactions from "./components/Transactions";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Learn from "./components/Learn";
import Logout from "./components/Logout";
import "./App.css";

interface Transaction {
  amount: number;
  date: string;
  type: "income" | "expense";
  concept: string;
}

interface BudgetItem {
  concept: string;
  amount: number;
}
function App() {
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    calculateBalance(updatedTransactions);
  };

  const handleSetBudget = (newBudget: BudgetItem[]) => {
    setBudget(newBudget);
    localStorage.setItem("budget", JSON.stringify(newBudget));
  };
  const calculateBalance = (transactions: Transaction[]) => {
    const newIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const newExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    setIncome(newIncome);
    setExpense(newExpense);
  };
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions);
      setTransactions(parsedTransactions);
      calculateBalance(parsedTransactions);
    }
    const storedBudget = localStorage.getItem("budget");
    if (storedBudget) {
      setBudget(JSON.parse(storedBudget));
    }
  }, []);

  function renderComponent() {
    switch (activeComponent) {
      case "home":
        return <Home income={income} expense={expense} />;
      case "profile":
        return <Profile />;
      case "budget":
        return <Budget transactions={transactions} />;
      case "transactions":
        return (
          <Transactions
            setBalance={handleSetBalance}
            income={income}
            expense={expense}
          />
        );
      case "analytics":
        return <Analytics transactions={transactions} budget={budget} />;
      case "settings":
        return <Settings />;
      case "learn":
        return <Learn />;
      case "logout":
        return <Logout />;
      // Agrega más casos según tus componentes
      default:
        return <Home income={income} expense={expense} />;
    }
  }

  const handleSetBalance = (newIncome: number, newExpense: number) => {
    setIncome(newIncome);
    setExpense(newExpense);
  };

  return (
    <div className="app">
      <Sidebar setActiveComponent={setActiveComponent} />
      <Content>{renderComponent()}</Content>
    </div>
  );
}

export default App;
