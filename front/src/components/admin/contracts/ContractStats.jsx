import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faCheckCircle, faTimesCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ title, value, icon, bgColor, iconColor, textColor = "text-white" }) => (
  <div className={`${bgColor} p-6 rounded-xl shadow text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`${iconColor} text-4xl opacity-80`}>
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  </div>
);

const ContractStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Contrats"
        value={stats.total}
        icon={faFileContract}
        bgColor="bg-[var(--color-slate-blue)]"
        iconColor="text-[var(--color-pale-blue)]"
      />
      <StatCard
        title="Contrats Actifs"
        value={stats.active}
        icon={faCheckCircle}
        bgColor="bg-[var(--color-sage-green)]"
        iconColor="text-white"
      />
      <StatCard
        title="Contrats Terminés"
        value={stats.completed}
        icon={faCheckCircle}
        bgColor="bg-[var(--color-mocha)]"
        iconColor="text-white"
      />
      <StatCard
        title="Contrats Annulés/Expirés"
        value={stats.cancelled + stats.expired}
        icon={faTimesCircle}
        bgColor="bg-red-600"
        iconColor="text-red-200"
      />
    </div>
  );
};

export default ContractStats; 