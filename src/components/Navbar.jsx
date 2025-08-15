import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">S</div>
            <h1 className="navbar-title">Solera Vehicle Manager</h1>
          </Link>

          <ul className="navbar-nav">
            <li>
              <span className="nav-label">
                Gestión de Vehículos
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
