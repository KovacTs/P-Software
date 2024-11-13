interface Props {
  setActiveComponent: (component: string) => void;
}

function Sidebar({ setActiveComponent }: Props) {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => setActiveComponent("home")}>Inicio</li>
        <li onClick={() => setActiveComponent("profile")}>Perfil</li>
        <li onClick={() => setActiveComponent("budget")}>Presupuesto</li>
        <li onClick={() => setActiveComponent("transactions")}>
          Transacciones
        </li>
        <li onClick={() => setActiveComponent("analytics")}>Analiticas</li>
        <li onClick={() => setActiveComponent("settings")}>Ajustes</li>
        <li onClick={() => setActiveComponent("learn")}>Aprende</li>
        <li onClick={() => setActiveComponent("logout")}>Salir</li>

        {/* Agrega más botones según tus necesidades */}
      </ul>
    </div>
  );
}

export default Sidebar;
