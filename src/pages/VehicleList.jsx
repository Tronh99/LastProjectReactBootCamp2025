import { useState, useEffect } from "react";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import VehicleForm from "../components/VehicleFormModal";
import { vehicleService } from "../services/vehicleService";

const VehicleList = () => {
  // --- ESTADO CENTRALIZADO ---
  const [vehicles, setVehicles] = useState([]); // Lista completa de vehículos
  const [searchVin, setSearchVin] = useState(""); // Término de búsqueda
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const rowsPerPage = 5; // Filas por página

  // Cargar vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    setConnectionError(null);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setConnectionError(
        "No se pudo conectar con el backend. Asegúrate de que esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newVehicle) => {
    setShowCreateModal(false);
    loadVehicles(); // Recargar la lista
    alert(
      `Vehicle ${newVehicle.brand} ${newVehicle.model} created successfully`
    );
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
  };

  // --- LÓGICA DE BÚSQUEDA Y FILTRADO ---
  // 1. Filtra los vehículos basado en el searchVin
  const filteredVehicles = searchVin.trim()
    ? vehicles.filter((v) =>
        v.vin.toLowerCase().includes(searchVin.trim().toLowerCase())
      )
    : vehicles;

  // 2. Handler para el input de búsqueda: actualiza el término y resetea a la página 1
  const handleSearchChange = (e) => {
    setSearchVin(e.target.value);
    setCurrentPage(1); // ¡IMPORTANTE! Resetea la paginación en cada búsqueda
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-header-info">
            <h1>Vehicle Management</h1>
            <p className="page-subtitle">
              {!loading &&
                !connectionError &&
                `Total: ${filteredVehicles.length} vehicle${
                  filteredVehicles.length !== 1 ? "s" : ""
                }`}
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-large"
              disabled={connectionError}
            >
              <span className="btn-text-full">+ Add Vehicle</span>
              <span className="btn-text-short">+ Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <form onSubmit={(e) => e.preventDefault()} style={{ margin: "1rem 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>
            <svg
              style={{ width: 18, height: 18, color: "#a259e6" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                clipRule="evenodd"
              />
            </svg>
            Search:
          </span>
          <input
            type="text"
            placeholder="VIN"
            value={searchVin}
            onChange={handleSearchChange}
            className="form-input"
            style={{ minWidth: 10 }}
          />
        </label>
      </form>

      {connectionError && (
        <div className="error-banner">
          <h3>⚠️ Connection Error</h3>
          <p>{connectionError}</p>
          <button onClick={loadVehicles} className="btn btn-secondary">
            Retry Connection
          </button>
        </div>
      )}

      {/* Pasa los datos filtrados y el control de paginación a la tabla */}
      <VehicleTable
        vehicles={filteredVehicles}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onAdd={() => setShowCreateModal(true)}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        title="Add New Vehicle"
      >
        <VehicleForm
          isEdit={false}
          onSuccess={handleCreateSuccess}
          onCancel={handleCloseModals}
        />
      </Modal>
    </div>
  );
};

export default VehicleList;
