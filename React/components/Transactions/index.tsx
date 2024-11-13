import React, { useState, useEffect } from "react";
import styles from "./Transactions.module.css";
import Balance from "../Balance";

interface Transaction {
  amount: number;
  date: string;
  type: "income" | "expense";
  concept: string;
}

interface TransactionsProps {
  setBalance: (income: number, expense: number) => void;
  income: number;
  expense: number;
}

function Transactions({ setBalance, income, expense }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [concept, setConcept] = useState<string>("sueldo");

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = { amount, date, type, concept };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    // Guardar las transacciones en el archivo (simulado aquí)
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Actualizar balance
    calculateBalance(updatedTransactions);

    // Limpiar el formulario
    setAmount(0);
    setDate("");
    setType("income");
    setConcept("sueldo");
  };

  const calculateBalance = (transactions: Transaction[]) => {
    const newIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const newExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    setBalance(newIncome, newExpense);
  };

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions);
      setTransactions(parsedTransactions);
      calculateBalance(parsedTransactions);
    }
  }, []);

  return (
    <div>
      <div className={styles.transactions}>
        <form onSubmit={handleAddTransaction} className={styles.form}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Monto"
            required
            className={styles.input}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.input}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            required
            className={styles.select}
          >
            <option value="income">Ingreso</option>
            <option value="expense">Egreso</option>
          </select>
          {type === "income" ? (
            <select
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              required
              className={styles.select}
            >
              <option value="sueldo">Sueldo</option>
              <option value="prestamos">Préstamos</option>
              <option value="otros">Otros</option>
            </select>
          ) : (
            <select
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              required
              className={styles.select}
            >
              <option value="ocio">Ocio</option>
              <option value="servicios">Servicios</option>
              <option value="hogar">Hogar</option>
              <option value="otros">Otros</option>
            </select>
          )}
          <button type="submit" className={styles.button}>
            Agregar Transacción
          </button>
        </form>
        <div className={styles.balance}>
          <Balance income={income} expense={expense} />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Concepto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.type === "income" ? "Ingreso" : "Egreso"}</td>
              <td>{transaction.concept}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
