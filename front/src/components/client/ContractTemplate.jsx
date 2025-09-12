
import { format } from 'date-fns';

export default function ContractTemplate({ reservation, referenceContract }) {
  // données à plat
  const startDateFr = format(new Date(reservation.start_date), 'dd/MM/yyyy');
  const endDateFr   = format(new Date(reservation.end_date), 'dd/MM/yyyy');
  const todayFr     = format(new Date(), 'dd/MM/yyyy');
  const locataire   = `${reservation.User.firstname} ${reservation.User.lastname}`;
  const proprio     = `${reservation.Boat.User.firstname} ${reservation.Boat.User.lastname}`;
  const boat        = reservation.Boat.name;
  const type        = `${reservation.Boat.brand} ${reservation.Boat.model}`;
  const capacite    = reservation.Boat.max_passengers;
  const matricule   = reservation.Boat.registration_number;
  const port        = reservation.Boat.Port.name; 
  const montant     = reservation.total_price;
  const contractRef = referenceContract;
  const resaRef     = reservation.reference;

  return (
    <div id="contract-template" style={{ fontFamily: 'Arial', fontSize: 12, lineHeight: 1.5, color: '#333', maxWidth: 800, padding: 30 }}>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
        <img
          src="/images/logo.png"
          alt="SailingLoc"
          style={{ height: 40 }}
        />
      </div>
      <h1 style={{ textAlign: 'center', color: '#4B6A88', fontSize: 18 }}>CONTRAT DE LOCATION DE BATEAU</h1>

      <p><strong>Numéro de contrat :</strong> {contractRef}</p>
      <p><strong>Référence de la réservation :</strong> {resaRef}</p>
      <p>Entre les soussignés :</p>
      <p><strong>Propriétaire :</strong> {proprio}</p>
      <p><strong>Locataire :</strong> {locataire} – {reservation.User.email} – {reservation.User.phone}</p>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>1. Objet du contrat</div>
      <ul>
        <li><strong>Nom du bateau :</strong> {boat}</li>
        <li><strong>Type :</strong> {type}</li>
        <li><strong>Capacité :</strong> {capacite} personnes</li>
        <li><strong>Immatriculation :</strong> {matricule}</li>
        <li><strong>Port d'attache :</strong> {port}</li>
      </ul>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>2. Durée de la location</div>
      <ul>
        <li><strong>Du :</strong> {startDateFr}</li>
        <li><strong>Au :</strong> {endDateFr}</li>
      </ul>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>3. Conditions financières</div>
      <p>Montant total : <strong>{montant} € TTC</strong></p>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>4. Obligations du locataire</div>
      <ul>
        <ol>Restituer le bateau dans son état initial.</ol>
        <ol>Respecter les règles de navigation.</ol>
        <ol>Utiliser le bateau de manière responsable.</ol>
      </ul>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>5. Assurance et responsabilité</div>
      <p>Le bateau est assuré tous risques. Les dommages causés par négligence du locataire seront à sa charge.</p>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>6. Résiliation</div>
      <p>Annulation à moins de 48h : aucun remboursement sauf cas de force majeure.</p>

      <div style={{ fontWeight: 'bold', color: '#4B6A88', marginTop: 12 }}>7. Confidentialité</div>
      <p>Les données personnelles échangées dans le cadre de ce contrat sont confidentielles et protégées selon le RGPD.</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <div>
          <p>Fait à Paris, le {todayFr}</p>
          <p><strong>Le Locataire</strong></p>
          <p>Signature électronique : {locataire}</p>
        </div>
        <div>
          <p>&nbsp;</p>
          <p><strong>Le Propriétaire</strong></p>
          <p>Signature électronique : {proprio}</p>
        </div>
      </div>

      <div style={{ fontSize: 10, textAlign: 'center', color: '#777', marginTop: 20 }}>
        SailingLoc – 123 Quai des Navigateurs, 75000 Paris<br />
        www.sailingloc.fr – info@sailingloc.com
      </div>
    </div>
  );
}