interface BalanceProps {
  income: number;
  expense: number;
}

function Balance({ income, expense }: BalanceProps) {
  // Calcular el total
  const total = income - expense;

  return (
    <div>
      <h2>Balance</h2>
      {income === 0 && expense === 0 ? (
        <p className="no-data-message">Datos insuficientes</p>
      ) : (
        <>
          <p>Ingresos: {income}</p>
          <p>Egresos: {expense}</p>
          <p>Total: {total}</p>
        </>
      )}
    </div>
  );
}

export default Balance;
