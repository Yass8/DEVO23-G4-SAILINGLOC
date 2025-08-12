import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Step2Equipments({ data, setData, input, setInput }) {
  const addEquip = () => {
    if (input.trim()) {
      setData({
        ...data,
        equipment: [...data.equipment, input.trim()]
      });
      setInput("");
    }
  };

  const removeEquip = (idx) => {
    setData({
      ...data,
      equipment: data.equipment.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Équipements</h2>
      
      <div className="flex gap-2">
        <input
          className="border border-gray-300 flex-1 p-2 rounded"
          placeholder="Ajouter un équipement"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEquip()}
        />
        <button
          type="button"
          onClick={addEquip}
          className="bg-mocha text-sand px-3 py-1 rounded"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      
      <ul className="space-y-2">
        {data.equipment.map((eq, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
          >
            <span>{eq}</span>
            <button
              type="button"
              onClick={() => removeEquip(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}