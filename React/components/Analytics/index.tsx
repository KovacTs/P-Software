import { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import styles from "./Analytics.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Transaction {
  amount: number;
  date: string; // Formato de fecha: "YYYY-MM-DD"
  type: "income" | "expense";
  concept: string;
}

interface BudgetItem {
  concept: string;
  amount: number;
}

interface AnalyticsProps {
  transactions: Transaction[];
  budget: BudgetItem[];
}

function Analytics({ transactions, budget }: AnalyticsProps) {
  const [period, setPeriod] = useState("monthly"); // Estado para el período seleccionado

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(event.target.value);
  };

  // Función para filtrar transacciones según el período
  const filterTransactionsByPeriod = (transactions: Transaction[]) => {
    const now = new Date();
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      switch (period) {
        case "monthly":
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        case "quarterly":
          const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
          return (
            transactionDate.getMonth() >= quarterStartMonth &&
            transactionDate.getMonth() < quarterStartMonth + 3 &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        case "semiannually":
          return (
            transactionDate.getMonth() < 6 &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        case "annually":
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    return filteredTransactions;
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions);
  const concepts = Array.from(
    new Set(filteredTransactions.map((t) => t.concept))
  );

  const getRealAmountBar = (concept: string) => {
    return filteredTransactions
      .filter((t) => t.concept === concept)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getRealAmount = (concept: string) => {
    return filteredTransactions
      .filter((t) => t.concept === concept && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getBudgetAmount = (concept: string) => {
    const item = budget.find((b) => b.concept === concept);
    return item ? item.amount : 0;
  };

  const barData = {
    labels: concepts,
    datasets: [
      {
        label: "Presupuesto",
        data: concepts.map(getBudgetAmount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Real",
        data: concepts.map(getRealAmountBar),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const doughnutData = {
    labels: concepts,
    datasets: [
      {
        data: concepts.map(getRealAmount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Gráficos de Análisis</h2>
      <label htmlFor="period">Selecciona el período:</label>
      <select id="period" value={period} onChange={handlePeriodChange}>
        <option value="monthly">Mensual</option>
        <option value="quarterly">Trimestral</option>
        <option value="semiannually">Semestral</option>
        <option value="annually">Anual</option>
      </select>

      <div className={styles.analytics}>
        <div className={styles.chartBar}>
          <Bar data={barData} />
        </div>
        <div className={styles.chartDoughnut}>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
