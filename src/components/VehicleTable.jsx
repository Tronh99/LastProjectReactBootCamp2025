import React from "react"; // Importante añadir React si usas React.useState
import { Link } from "react-router-dom";

const VehicleTable = ({
  vehicles,
  loading,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  onAdd,
}) => {
  // El estado de ordenamiento puede seguir siendo local a la tabla
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });

  // --- LÓGICA DE ORDENAMIENTO ---
  const sortedVehicles = React.useMemo(() => {
    let sortableItems = [...vehicles];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [vehicles, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Resetea a la página 1 al ordenar
  };

  // --- LÓGICA DE PAGINACIÓN (usa props) ---
  const totalRows = sortedVehicles.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Corta solo la porción de vehículos para la página actual
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Usa la función del padre
    }
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge ${
      status === "Disponible" ? "status-available" : "status-sold"
    }`;
  };

  if (loading) {
    return (
      <div className="table-container">
        <h3>Loading vehicles...</h3>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <h3>No vehicles found</h3>
          <p>No vehicles match your current search criteria.</p>
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
                    : "Not Available"}
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

      {/* Controles de paginación */}
      <div
        className="pagination-controls"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          margin: 16,

        }}
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleTable;
