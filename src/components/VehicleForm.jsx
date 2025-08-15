import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleService } from "../services/vehicleService";

const VehicleForm = ({ vehicleId, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    vin: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    status: "Available",
    city: "",
  });

  const statusOptions = vehicleService.getStatusOptions();

  useEffect(() => {
    if (isEdit && vehicleId) {
      loadVehicle();
    }
  }, [vehicleId, isEdit]);

  const loadVehicle = async () => {
    setLoading(true);
    try {
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      setFormData(vehicle);
    } catch (error) {
      alert("Error al cargar el vehículo: " + error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || "" : value,
    }));

    // Limpiar error del campo al empezar a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vin.trim()) {
      newErrors.vin = "El VIN es requerido";
    } else if (formData.vin.length < 10) {
      newErrors.vin = "El VIN debe tener al menos 10 caracteres";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida";
    }

    if (!formData.model.trim()) {
      newErrors.model = "El modelo es requerido";
    }

    if (!formData.year) {
      newErrors.year = "El año es requerido";
    } else if (
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year =
        "El año debe estar entre 1900 y " + (new Date().getFullYear() + 1);
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await vehicleService.updateVehicle(vehicleId, formData);
        alert("Vehículo actualizado exitosamente");
      } else {
        await vehicleService.createVehicle(formData);
        alert("Vehículo creado exitosamente");
      }
      navigate("/");
    } catch (error) {
      alert("Error al guardar el vehículo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading && isEdit) {
    return (
      <div className="container">
        <div className="form-container">
          <div className="text-center">
            <h2>Loading vehicle...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-center mb-2">
          {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required" htmlFor="vin">
              VIN (Número de Identificación del Vehículo)
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className={`form-input ${errors.vin ? "error" : ""}`}
              placeholder="Ingrese el VIN del vehículo"
              maxLength="17"
            />
            {errors.vin && <span className="form-error">{errors.vin}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required" htmlFor="brand">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`form-input ${errors.brand ? "error" : ""}`}
                placeholder="Ej: Toyota, BMW, Honda"
              />
              {errors.brand && (
                <span className="form-error">{errors.brand}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="model">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`form-input ${errors.model ? "error" : ""}`}
                placeholder="Ej: Corolla, X3, Civic"
              />
              {errors.model && (
                <span className="form-error">{errors.model}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required" htmlFor="year">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`form-input ${errors.year ? "error" : ""}`}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <span className="form-error">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`form-select ${errors.status ? "error" : ""}`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <span className="form-error">{errors.status}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: New York, Los Angeles, Chicago"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}{" "}
              Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
