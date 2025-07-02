

const portOptions = [
  { value: 2, label: "Marseille" },
  { value: 3, label: "Nice" },
  { value: 4, label: "Bordeaux" },
  { value: 5, label: "Paris" },
  { value: 6, label: "Lyon" },
  { value: 7, label: "Toulouse" },
  { value: 8, label: "Nantes" },
  { value: 9, label: "Strasbourg" },
  { value: 10, label: "Montpellier" },
];

export const getPorts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(portOptions);
    }, 1000); // Simulate a network delay
  });
};