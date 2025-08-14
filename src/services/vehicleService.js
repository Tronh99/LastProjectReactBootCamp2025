// Simulación de base de datos local
let vehicles = [
  {
    id: '1',
    vin: 'WBA3A5C50CF370001',
    brand: 'BMW',
    model: 'X3',
    year: 2020,
    status: 'Available',
    city: 'Madrid'
  },
  {
    id: '2',
    vin: 'WAUAF78E67A123456',
    brand: 'Audi',
    model: 'A4',
    year: 2019,
    status: 'Sold',
    city: 'Barcelona'
  },
  {
    id: '3',
    vin: 'JH4KA8260PC123456',
    brand: 'Mercedes',
    model: 'C-Class',
    year: 2021,
    status: 'Available',
    city: 'Valencia'
  }
];

// Función para generar IDs únicos
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vehicleService = {
  // Obtener todos los vehículos
  async getAllVehicles() {
    await delay(300); // Simular latencia de red
    return [...vehicles];
  },

  // Obtener vehículo por ID
  async getVehicleById(id) {
    await delay(200);
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    return { ...vehicle };
  },

  // Crear nuevo vehículo
  async createVehicle(vehicleData) {
    await delay(300);
    
    // Validación básica
    if (!vehicleData.vin || !vehicleData.brand || !vehicleData.model) {
      throw new Error('VIN, Brand, and Model are required fields');
    }

    // Verificar que el VIN no esté duplicado
    const existingVehicle = vehicles.find(v => v.vin === vehicleData.vin);
    if (existingVehicle) {
      throw new Error('A vehicle with this VIN already exists');
    }

    const newVehicle = {
      id: generateId(),
      vin: vehicleData.vin,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year || new Date().getFullYear(),
      status: vehicleData.status || 'Available',
      city: vehicleData.city || ''
    };

    vehicles.push(newVehicle);
    return { ...newVehicle };
  },

  // Actualizar vehículo existente
  async updateVehicle(id, vehicleData) {
    await delay(300);
    
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }

    // Validación básica
    if (!vehicleData.vin || !vehicleData.brand || !vehicleData.model) {
      throw new Error('VIN, Brand, and Model are required fields');
    }

    // Verificar que el VIN no esté duplicado (excepto en el mismo vehículo)
    const existingVehicle = vehicles.find(v => v.vin === vehicleData.vin && v.id !== id);
    if (existingVehicle) {
      throw new Error('A vehicle with this VIN already exists');
    }

    const updatedVehicle = {
      ...vehicles[index],
      vin: vehicleData.vin,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year || vehicles[index].year,
      status: vehicleData.status || vehicles[index].status,
      city: vehicleData.city || vehicles[index].city
    };

    vehicles[index] = updatedVehicle;
    return { ...updatedVehicle };
  },

  // Eliminar vehículo
  async deleteVehicle(id) {
    await delay(200);
    
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }

    const deletedVehicle = vehicles[index];
    vehicles.splice(index, 1);
    return { ...deletedVehicle };
  },

  // Opciones para estados de vehículos
  getStatusOptions() {
    return ['Available', 'Sold', 'Under Maintenance', 'Reserved'];
  }
};
