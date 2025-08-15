import { useParams } from "react-router-dom";
import VehicleForm from "../components/VehicleForm";

const VehicleEdit = () => {
  const { id } = useParams();

  return <VehicleForm vehicleId={id} isEdit={true} />;
};

export default VehicleEdit;
