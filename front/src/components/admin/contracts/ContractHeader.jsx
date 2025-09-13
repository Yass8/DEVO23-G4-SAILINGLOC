import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';

const ContractHeader = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-[#4B6A88] mb-2">
            Gestion des Contrats
          </h1>
          <p className="text-gray-600">
            Gérez tous les contrats de location de bateaux
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader; 