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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
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
  // Pagination logic
  const totalRows = sortedVehicles.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
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
          {paginatedVehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.vin}</td>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>
                <span className={getStatusBadgeClass(vehicle.status)}>
                  {vehicle.status === "Disponible"
                    ? "Available"
                    : vehicle.status === "No Disponible"
                    ? "Not Available"
                    : vehicle.status}
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
      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
        }}
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary btn-small"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`btn btn-small${
              currentPage === i + 1 ? " btn-primary" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary btn-small"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleTable;
