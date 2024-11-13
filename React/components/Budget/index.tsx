import React, { useState, useEffect } from "react";
import styles from "./budget.module.css";

interface BudgetItem {
  concept: string;
  amount: number;
}

interface Transaction {
  amount: number;
  date: string;
  type: "income" | "expense";
  concept: string;
}

interface BudgetProps {
  transactions: Transaction[];
}

function Budget({ transactions }: BudgetProps) {
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [concept, setConcept] = useState<string>("sueldo");
  const [amount, setAmount] = useState<number>(0);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBudget = budget.map((item) =>
      item.concept === concept ? { ...item, amount } : item
    );
    if (!updatedBudget.some((item) => item.concept === concept)) {
      updatedBudget.push({ concept, amount });
    }
    setBudget(updatedBudget);
    localStorage.setItem("budget", JSON.stringify(updatedBudget));
  };

  useEffect(() => {
    const storedBudget = localStorage.getItem("budget");
    if (storedBudget) {
      setBudget(JSON.parse(storedBudget));
    }
  }, []);

  const calculateRealAmount = (concept: string) => {
    return transactions
      .filter((t) => t.concept === concept)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return (
    <div>
      <form onSubmit={handleAddBudget} className={styles.form}>
        <select
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          required
          className={styles.select}
        >
          <option value="sueldo">Sueldo</option>
          <option value="prestamos">Préstamos</option>
          <option value="otros">Otros</option>
          <option value="ocio">Ocio</option>
          <option value="servicios">Servicios</option>
          <option value="hogar">Hogar</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Monto"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Definir Presupuesto
        </button>
      </form>

      {budget.map((item, index) => (
        <table key={index} className={styles.table}>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Presupuesto</th>
              <th>Monto Real</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.concept}</td>
              <td>{item.amount}</td>
              <td>{calculateRealAmount(item.concept)}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}

export default Budget;
