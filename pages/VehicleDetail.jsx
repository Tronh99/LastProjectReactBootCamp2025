import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { vehicleService } from "../services/vehicleService";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getVehicleById(id);
      setVehicle(data);
    } catch (error) {
      alert("Error al cargar el vehículo: " + error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar el vehículo ${vehicle.brand} ${vehicle.model}?`
      )
    ) {
      try {
        await vehicleService.deleteVehicle(id);
        alert("Vehículo eliminado exitosamente");
        navigate("/");
      } catch (error) {
        alert("Error al eliminar el vehículo: " + error.message);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Available: "status-available",
      Sold: "status-sold",
      "Under Maintenance": "status-maintenance",
      Reserved: "status-reserved",
    };
    return `status-badge ${statusMap[status] || "status-available"}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card vehicle-detail-container">
          <div className="text-center">
            <h2>Cargando vehículo...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container">
        <div className="card vehicle-detail-container">
          <div className="text-center">
            <h2>Vehículo no encontrado</h2>
            <Link to="/" className="btn btn-primary mt-1">
              Volver a la lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card vehicle-detail-container">
        {/* Header */}
        <div className="vehicle-detail-header">
          <div className="vehicle-detail-info">
            <h1>
              {vehicle.brand} {vehicle.model}
            </h1>
            <p>Año {vehicle.year}</p>
          </div>
          <div className="vehicle-detail-actions">
            <div className="btn-group">
              <Link
                to={`/vehicles/${vehicle.id}/edit`}
                className="btn btn-secondary"
              >
                Editar
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="vehicle-detail-grid">
          <div className="vehicle-detail-section">
            <h3>Información del Vehículo</h3>

            <div className="vehicle-detail-field">
              <label>VIN:</label>
              <span className="vehicle-vin">{vehicle.vin}</span>
            </div>

            <div className="vehicle-detail-field">
              <label>Marca:</label>
              <span>{vehicle.brand}</span>
            </div>

            <div className="vehicle-detail-field">
              <label>Modelo:</label>
              <span>{vehicle.model}</span>
            </div>

            <div className="vehicle-detail-field">
              <label>Año:</label>
              <span>{vehicle.year}</span>
            </div>
          </div>

          <div className="vehicle-detail-section">
            <h3>Estado y Ubicación</h3>

            <div className="vehicle-detail-field">
              <label>Estado:</label>
              <span className={getStatusBadgeClass(vehicle.status)}>
                {vehicle.status}
              </span>
            </div>

            <div className="vehicle-detail-field">
              <label>Ciudad:</label>
              <span>{vehicle.city || "No especificada"}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="vehicle-detail-footer">
          <div className="btn-group">
            <Link to="/" className="btn btn-outline">
              ← Volver a la lista
            </Link>
            <Link
              to={`/vehicles/${vehicle.id}/edit`}
              className="btn btn-primary"
            >
              Editar vehículo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
