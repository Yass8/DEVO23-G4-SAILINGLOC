import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({ icon, value, label, color = "text-slate-blue", bgColor = "bg-white" }) {
  return (
    <div className={`p-4 rounded-xl shadow flex items-center space-x-3 ${bgColor}`}>
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}