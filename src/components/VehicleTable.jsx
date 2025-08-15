import { Link } from "react-router-dom";

const VehicleTable = ({ vehicles, onAdd, loading }) => {
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      "Disponible": "status-available",
      "No Disponible": "status-sold",
      
    };
    return `status-badge ${statusMap[status] || "status-available"}`;
  };
  
  if (loading) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>Loading vehicles...</h3>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>No vehicles registered</h3>
          <p>Start by adding your first vehicle to the system.</p>
          <button onClick={() => onAdd && onAdd()} className="btn btn-primary">
            Add First Vehicle
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
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Status</th>
            <th>City</th>
            <th>Actions</th>
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
                    View Details
                  </Link>
                  {/* Eliminar movido a la página de detalle */}
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
