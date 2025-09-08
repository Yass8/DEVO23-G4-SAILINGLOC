export const validateBoatForm = (formData) => {
  const errors = {};
  
  // Validation des champs obligatoires
  if (!formData.name?.trim()) {
    errors.name = 'Le nom du bateau est requis';
  }
  
  if (!formData.type) {
    errors.type = 'Le type de bateau est requis';
  }
  
  if (!formData.country) {
    errors.country = 'Le pays est requis';
  }
  
  if (!formData.city?.trim()) {
    errors.city = 'La ville est requise';
  }
  
  if (!formData.port?.trim()) {
    errors.port = 'Le port est requis';
  }
  
  if (!formData.price || formData.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0';
  }
  
  if (!formData.description?.trim()) {
    errors.description = 'La description est requise';
  }
  
  if (!formData.capacity || formData.capacity <= 0) {
    errors.capacity = 'La capacité doit être supérieure à 0';
  }
  
  if (!formData.length || formData.length <= 0) {
    errors.length = 'La longueur doit être supérieure à 0';
  }
  
  if (!formData.width || formData.width <= 0) {
    errors.width = 'La largeur doit être supérieure à 0';
  }
  
  if (!formData.year || formData.year <= 0) {
    errors.year = "L'année doit être supérieure à 0";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getInitialBoatFormData = () => ({
  name: '',
  type: '',
  country: '',
  city: '',
  port: '',
  price: '',
  description: '',
  capacity: '',
  length: '',
  width: '',
  year: '',
  engine: '',
  fuelType: '',
  equipment: [],
  photos: []
});

export const getBoatTypes = () => [
  'Voilier',
  'Catamaran', 
  'Moteur',
  'Yacht',
  'Bateau à voile',
  'Bateau de pêche',
  'Bateau de croisière',
  'Bateau de sport'
];

export const getCountries = () => [
  'Albanie', 'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Biélorussie',
  'Bosnie-Herzégovine', 'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 'Espagne',
  'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 'Islande',
  'Italie', 'Kazakhstan', 'Kosovo', 'Lettonie', 'Liechtenstein', 'Lituanie',
  'Luxembourg', 'Macédoine du Nord', 'Malte', 'Moldavie', 'Monaco', 'Monténégro',
  'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République tchèque', 'Roumanie',
  'Royaume-Uni', 'Russie', 'Saint-Marin', 'Serbie', 'Slovaquie', 'Slovénie',
  'Suède', 'Suisse', 'Ukraine', 'Vatican'
];

export const getFuelTypes = () => [
  'Essence',
  'Diesel',
  'Électrique',
  'Hybride',
  'Solaire',
  'Vent (voile)'
];

export const getEquipmentOptions = () => [
  'GPS',
  'VHF',
  'Sonar',
  'Pilote automatique',
  'Générateur',
  'Climatisation',
  'Cuisine équipée',
  'Cabines',
  'Douche',
  'WC',
  'Équipement de sécurité',
  'Équipement de pêche',
  'Équipement de plongée',
  'Tender',
  'Ancre électrique',
  'Winch électrique'
]; 