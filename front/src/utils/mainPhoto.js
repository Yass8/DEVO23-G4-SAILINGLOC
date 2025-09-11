
export const getMainPhotoUrl = (boat) => {
  if (!boat.BoatPhotos || !boat.BoatPhotos.length) return '/images/default-boat.jpg';
  const main = boat.BoatPhotos.find(p => p.is_main);
  return main ? main.photo_url : boat.BoatPhotos[0].photo_url;
};

