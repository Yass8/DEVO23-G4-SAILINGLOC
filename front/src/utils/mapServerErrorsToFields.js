export const mapServerErrorsToFields = (serverError = '') => {
  const errors = {};
  const msg = String(serverError).trim();

  // immatriculation
  if (
    msg.includes('immatriculation') ||
    msg.includes('registration_number') ||
    msg.includes('déjà utilisé')
  ) {
    errors.registration_number = msg;
  }

  // nom
  if (
    msg.includes('nom du bateau') ||
    msg.includes('name') ||
    msg.includes('obligatoire')
  ) {
    errors.name = msg;
  }

  // type
  if (
    msg.includes('type') ||
    msg.includes('type_id') ||
    msg.includes('Type')
  ) {
    errors.type_id = msg;
  }

  // prix
  if (
    msg.includes('prix') ||
    msg.includes('daily_price') ||
    msg.includes('prix journalier')
  ) {
    errors.daily_price = msg;
  }

  // passagers
  if (
    msg.includes('passagers') ||
    msg.includes('max_passengers') ||
    msg.includes('passager')
  ) {
    errors.max_passengers = msg;
  }

  // longueur
  if (
    msg.includes('longueur') ||
    msg.includes('length') ||
    msg.includes('mètres')
  ) {
    errors.length = msg;
  }

  // description
  if (
    msg.includes('description') ||
    msg.includes('doit être renseigné')
  ) {
    errors.description = msg;
  }

  // slug
  if (
    msg.includes('slug') ||
    msg.includes('doit être unique')
  ) {
    errors.slug = msg; // on pourra gérer ça plus tard si besoin
  }

  return errors;
};