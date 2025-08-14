import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import VehicleForm from "../components/VehicleFormModal";
import { vehicleService } from "../services/vehicleService";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      alert("Error al cargar los vehículos: " + error.message);
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
      `Vehículo ${newVehicle.brand} ${newVehicle.model} creado exitosamente`
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
            <h1>Gestión de Vehículos</h1>
            <p className="page-subtitle">
              {!loading &&
                vehicles.length > 0 &&
                `Total: ${vehicles.length} vehículo${
                  vehicles.length !== 1 ? "s" : ""
                }`}
            </p>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-large"
            >
              <span className="btn-text-full">+ Agregar Vehículo</span>
              <span className="btn-text-short">+ Agregar</span>
            </button>
          </div>
        </div>
      </div>

      <VehicleTable
        vehicles={vehicles}
        onAdd={() => setShowCreateModal(true)}
        loading={loading}
      />

      {/* Modal para crear vehículo */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        title="Agregar Nuevo Vehículo"
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
