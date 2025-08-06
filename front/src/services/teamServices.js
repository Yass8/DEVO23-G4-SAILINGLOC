
const teams = [
  { 
    id: 1,
    name: "Paul Voisin",
    role: "Fondateur et Directeur Général de SailingLoc",
    image: "images/profil/1.jpg",
  },
  {
    id: 2,
    name: "Sophie Martel",
    role: "Responsable Marketing et Communication",
    image: "images/profil/2.jpg",
  },
  {
    id: 3,
    name: "Julien Morel",
    role: "Responsable Commercial",
    image: "images/profil/3.jpg",
  }
];

export const getTeams = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(teams);
    }, 1000);
  });
};