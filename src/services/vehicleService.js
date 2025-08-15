import axios from 'axios';

// Configuración base de axios para conectar con el backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/vehicles';

// Configurar axios con interceptores para manejo de errores
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // El servidor respondió con un código de estado de error
      let message = error.response.data?.message || error.response.data || error.message;
      
      // Asegurar que message sea un string
      if (typeof message !== 'string') {
        message = JSON.stringify(message) || 'Error desconocido';
      }
      
      // Detectar error de VIN duplicado
      if (message.includes('ya está registrado') || (message.includes('VIN') && message.includes('registrado'))) {
        throw new Error('VIN ya se encuentra registrado');
      }
      
      throw new Error(message);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en el puerto 8080.');
    } else {
      // Algo pasó al configurar la solicitud
      throw new Error(error.message);
    }
  }
);

// Función para mapear datos del frontend al formato del backend
const mapToBackendFormat = (vehicleData) => {
  return {
    make: vehicleData.brand || vehicleData.make,
    model: vehicleData.model,
    modelYear: vehicleData.year?.toString() || vehicleData.modelYear,
    vin: vehicleData.vin,
    location: vehicleData.city || vehicleData.location,
    status: vehicleData.status === 'Disponible' ? true : false
  };
};

// Función para mapear datos del backend al formato del frontend
const mapToFrontendFormat = (backendData) => {
  // Manejar tanto DTOs (de GET) como entidades (de POST/PUT)
  const vehicle = backendData;
  
  return {
    id: vehicle.id?.toString() || vehicle.id,
    vin: vehicle.vin,
    brand: vehicle.make,
    model: vehicle.model,
    year: parseInt(vehicle.modelYear) || vehicle.modelYear,
    status: vehicle.status === true || vehicle.status === 'true' ? 'Disponible' : 'No Disponible',
    city: vehicle.location
  };
};

export const vehicleService = {
  // Obtener todos los vehículos
  async getAllVehicles() {
    try {
      const response = await api.get('');
      return response.data.map(mapToFrontendFormat);
    } catch (error) {
      console.error('Error getting all vehicles:', error);
      throw error;
    }
  },

  // Obtener vehículo por ID
  async getVehicleById(id) {
    try {
      // Validar que el ID sea válido
      if (!id || id === 'undefined' || id === 'null') {
        throw new Error('ID de vehículo no válido');
      }

      const response = await api.get(`/${id}`);
      return mapToFrontendFormat(response.data);
    } catch (error) {
      console.error(`Error getting vehicle ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo vehículo
  async createVehicle(vehicleData) {
    try {
      // Validación básica en el frontend
      if (!vehicleData.vin || !vehicleData.brand || !vehicleData.model) {
        throw new Error('VIN, Brand, and Model are required fields');
      }

      const backendData = mapToBackendFormat(vehicleData);
      const response = await api.post('', backendData);
      return mapToFrontendFormat(response.data);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Actualizar vehículo existente
  async updateVehicle(id, vehicleData) {
    try {
      // Validación básica en el frontend
      if (!vehicleData.vin || !vehicleData.brand || !vehicleData.model) {
        throw new Error('VIN, Brand, and Model are required fields');
      }

      const backendData = mapToBackendFormat(vehicleData);
      const response = await api.put(`/${id}`, backendData);
      return mapToFrontendFormat(response.data);
    } catch (error) {
      console.error(`Error updating vehicle ${id}:`, error);
      throw error;
    }
  },

  // Eliminar vehículo
  async deleteVehicle(id) {
    try {
      await api.delete(`/${id}`);
      return { success: true, message: 'Vehicle deleted successfully' };
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
    }
  },

  // Opciones para estados de vehículos
  getStatusOptions() {
    return ['Available', 'Not Available'];
  },

  // Función utilitaria para verificar si el backend está disponible
  async checkBackendConnection() {
    try {
      await api.get('');
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  }
};
