import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import VehicleForm from "../components/VehicleFormModal";
import { vehicleService } from "../services/vehicleService";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchVin, setSearchVin] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

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
      setConnectionError(error.message);
      // Si es un error de conexión, mostrar mensaje específico
      if (error.message.includes("No se pudo conectar")) {
        setConnectionError(
          "No se pudo conectar con el backend. Asegúrate de que esté ejecutándose en http://localhost:8080"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      // Actualizar la lista después de eliminar
      await loadVehicles();
    } catch (error) {
      throw error; // Re-lanzar el error para que el detalle pueda manejarlo
    }
  };

  const handleCreateSuccess = (newVehicle) => {
    setShowCreateModal(false);
    loadVehicles();
    alert(
      `Vehicle ${newVehicle.brand} ${newVehicle.model} created successfully`
    );
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
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
                vehicles.length > 0 &&
                `Total: ${vehicles.length} vehicle${
                  vehicles.length !== 1 ? "s" : ""
                }`}
            </p>
          </div>
          <div
            className="page-header-actions"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
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

      {/* Search bar with icon between title and table */}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "1rem 0",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            margin: 0,
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <svg
              style={{
                width: 18,
                height: 18,
                color: "#a259e6",
                marginRight: 4,
              }}
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
            onChange={(e) => setSearchVin(e.target.value)}
            className="form-input"
            style={{ minWidth: 180 }}
          />
        </label>
      </form>

      {/* Mostrar error de conexión si existe */}
      {connectionError && (
        <div className="error-banner">
          <div className="error-content">
            <h3>⚠️ Connection Error</h3>
            <p>{connectionError}</p>
            <button onClick={loadVehicles} className="btn btn-secondary">
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <VehicleTable
        vehicles={
          searchVin.trim()
            ? vehicles.filter((v) =>
                v.vin.toLowerCase().includes(searchVin.trim().toLowerCase())
              )
            : vehicles
        }
        onAdd={() => setShowCreateModal(true)}
        loading={loading}
      />

      {/* Modal para crear vehículo */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        title="Add New Vehicle"
        size="medium"
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
