
const equipments = async () => {
  return [
    { value: "wifi", label: "Wi-Fi" },
    { value: "kayak", label: "Kayak" },
    { value: "paddle", label: "Paddle" },
    { value: "snorkeling", label: "Snorkeling" },
    { value: "fishing", label: "Pêche" },
    { value: "skipper", label: "Skipper" },
    { value: "cooking", label: "Cuisine" },
  ];
};

export const getEquipments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(equipments());
    }, 1000);
  });
};