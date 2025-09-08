import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({ icon, value, label, color = "text-slate-blue" }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3">
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}