import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import VehicleList from "./pages/VehicleList";
import VehicleDetail from "./pages/VehicleDetail";

// Importar todos los estilos
import "./styles/variables.css";
import "./styles/buttons.css";
import "./styles/forms.css";
import "./styles/tables.css";
import "./styles/pages.css";
import "./styles/modals.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
