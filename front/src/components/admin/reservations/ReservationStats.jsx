import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faClock, 
  faCheck, 
  faEuroSign 
} from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex items-center">
      <div className={`p-3 ${bgColor} rounded-lg`}>
        <FontAwesomeIcon icon={icon} className={`text-2xl ${iconColor}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ReservationStats = ({ stats }) => {
  const statCards = [
    {
      icon: faCalendarCheck,
      label: 'Total',
      value: stats.total,
      bgColor: 'bg-[var(--color-pale-blue)]',
      iconColor: 'text-[var(--color-slate-blue)]'
    },
    {
      icon: faClock,
      label: 'En attente',
      value: stats.pending,
      bgColor: 'bg-[var(--color-sage-green)]',
      iconColor: 'text-[var(--color-slate-blue)]'
    },
    {
      icon: faCheck,
      label: 'Confirmées',
      value: stats.confirmed,
      bgColor: 'bg-[var(--color-sage-green)]',
      iconColor: 'text-[var(--color-slate-blue)]'
    },
    {
      icon: faEuroSign,
      label: 'Revenus',
      value: `${stats.revenue.toLocaleString()} €`,
      bgColor: 'bg-[var(--color-pale-blue)]',
      iconColor: 'text-[var(--color-slate-blue)]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default ReservationStats; 