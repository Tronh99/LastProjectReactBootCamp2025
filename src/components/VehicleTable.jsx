import { Link } from "react-router-dom";
import { useState } from "react";

const VehicleTable = ({ vehicles, onAdd, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedVehicles = [...vehicles];
  if (sortConfig.key) {
    sortedVehicles.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Disponible: "status-available",
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
            <th onClick={() => handleSort("vin")}>
              VIN{" "}
              {sortConfig.key === "vin"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleSort("brand")}>
              Brand{" "}
              {sortConfig.key === "brand"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleSort("model")}>
              Model{" "}
              {sortConfig.key === "model"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleSort("year")}>
              Year{" "}
              {sortConfig.key === "year"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleSort("status")}>
              Status{" "}
              {sortConfig.key === "status"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleSort("city")}>
              City{" "}
              {sortConfig.key === "city"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedVehicles.map((vehicle) => (
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
