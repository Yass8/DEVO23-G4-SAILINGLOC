export default function Step4Summary({ data, mainIndex }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Récapitulatif</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-mocha mb-2">Informations générales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nom :</span> {data.name || "Non renseigné"}</p>
              <p><span className="font-medium">Type :</span> {data.type || "Non renseigné"}</p>
              <p><span className="font-medium">Marque :</span> {data.brand || "Non renseigné"}</p>
              <p><span className="font-medium">Modèle :</span> {data.model || "Non renseigné"}</p>
            </div>
            <div>
              <p><span className="font-medium">Type de moteur :</span> {data.engine_type || "Non renseigné"}</p>
              <p><span className="font-medium">Prix/jour :</span> {data.daily_price ? `${data.daily_price} €` : "Non renseigné"}</p>
              <p><span className="font-medium">Passagers max :</span> {data.max_passengers || "Non renseigné"}</p>
              <p><span className="font-medium">Skipper requis :</span> {data.skipper_required ? "Oui" : "Non"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-mocha mb-2">Caractéristiques techniques</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Longueur :</span> {data.length ? `${data.length} m` : "Non renseigné"}</p>
              <p><span className="font-medium">Largeur :</span> {data.width ? `${data.width} m` : "Non renseigné"}</p>
            </div>
            <div>
              <p><span className="font-medium">Tirant d'eau :</span> {data.draft ? `${data.draft} m` : "Non renseigné"}</p>
              <p><span className="font-medium">Année :</span> {data.year || "Non renseigné"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-mocha mb-2">Description</h3>
          <p className="whitespace-pre-line">{data.description || "Aucune description"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-mocha mb-2">Équipements</h3>
          {data.equipment.length > 0 ? (
            <ul className="list-disc list-inside">
              {data.equipment.map((eq, idx) => (
                <li key={idx}>{eq}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun équipement ajouté</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg text-mocha mb-2">Photos</h3>
          <p>{data.photos.length} photo(s) téléchargée(s)</p>
          {data.photos.length > 0 && (
            <p>Photo principale sélectionnée : {mainIndex + 1}</p>
          )}
        </div>
      </div>
    </div>
  );
}