import { Link } from "react-router-dom";

const VehicleTable = ({ vehicles, onDelete, onEdit, onAdd, loading }) => {
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Available: "status-available",
      Sold: "status-sold",
      "Under Maintenance": "status-maintenance",
      Reserved: "status-reserved",
    };
    return `status-badge ${statusMap[status] || "status-available"}`;
  };

  const handleDelete = async (vehicle) => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar el vehículo ${vehicle.brand} ${vehicle.model}?`
      )
    ) {
      try {
        await onDelete(vehicle.id);
      } catch (error) {
        alert("Error al eliminar el vehículo: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>Cargando vehículos...</h3>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>No hay vehículos registrados</h3>
          <p>Comience agregando su primer vehículo al sistema.</p>
          <button onClick={() => onAdd && onAdd()} className="btn btn-primary">
            Agregar Primer Vehículo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>VIN</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Estado</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.vin}</td>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>
                <span className={getStatusBadgeClass(vehicle.status)}>
                  {vehicle.status}
                </span>
              </td>
              <td>{vehicle.city}</td>
              <td>
                <div className="table-actions">
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="btn btn-outline btn-small"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => onEdit && onEdit(vehicle.id)}
                    className="btn btn-secondary btn-small"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle)}
                    className="btn btn-danger btn-small"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
