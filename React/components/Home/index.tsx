import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import styles from "./Home.module.css";
import Balance from "../Balance";
type Props = {
  income: number;
  expense: number;
};

interface User {
  name: string;
  lastname: string;
}
const user: User = { name: "Fernando", lastname: "Llancao" };

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home({ income, expense }: Props) {
  // Datos para el gráfico de barras
  const barData = {
    labels: ["Ingresos", "Egresos"],
    datasets: [
      {
        label: "Monto",
        data: [income, expense],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Color para ingresos
          "rgba(255, 99, 132, 0.6)", // Color para egresos
        ],
      },
    ],
  };

  // Opciones para el gráfico de barras
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Gráfico de Balance",
      },
    },
  };
  return (
    <div className={styles.home}>
      <div className={styles.welcome}>
        <h2>¡Bienvenido a MoneyWase {user.name}!</h2>
        <p>
          Organiza tus finanzas, controla tus ingresos, gastos y alcanza tus
          metas con facilidad. Empieza hoy a mejorar tu bienestar financiero.
        </p>
      </div>
      <div className={styles.profile}>
        <h2>Tu perfil</h2>
        <p>Nombre: {user.name}</p>
        <p>Apellido: {user.lastname}</p>
        <p>Ocupacion: Estudiante</p>
        <p>Espectativa de ingresos: $300000</p>
      </div>
      <div className={styles.balance}>
        <Balance income={income} expense={expense} />
      </div>
      <div className={styles.charBar}>
        <Bar data={barData} options={options} />
      </div>
    </div>
  );
}

export default Home;
