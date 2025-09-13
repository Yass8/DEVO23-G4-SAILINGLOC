import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faMoneyBillWave, 
  faCalendarAlt,
  faReceipt,
  faPercentage
} from '@fortawesome/free-solid-svg-icons';

import Preloader from '../../../components/common/Preloader';

// Données mockées pour la démonstration
const mockData = {
  boat: {
    id: 1,
    name: "Sea Ray 240",
    daily_price: 180
  },
  reservations: [
    {
      id: 1,
      reference: "RES-2023-001",
      start_date: "2023-06-01",
      end_date: "2023-06-07",
      total_price: 1260,
      status: "completed",
      payment: {
        amount: 1260,
        commission_amount: 126,
        method: "credit_card",
        status: "completed"
      }
    },
    {
      id: 2,
      reference: "RES-2023-002",
      start_date: "2023-06-15",
      end_date: "2023-06-20",
      total_price: 900,
      status: "completed",
      payment: {
        amount: 900,
        commission_amount: 90,
        method: "paypal",
        status: "completed"
      }
    },
    {
      id: 3,
      reference: "RES-2023-003",
      start_date: "2023-07-01",
      end_date: "2023-07-10",
      total_price: 1620,
      status: "confirmed",
      payment: {
        amount: 1620,
        commission_amount: 162,
        method: "bank_transfer",
        status: "completed"
      }
    }
  ]
};

export default function RevenusStats() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'month', 'year', 'all'
  const [currentTab, setCurrentTab] = useState('overview'); // 'overview', 'reservations'

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, [id]);

  // Calcul des statistiques
  const calculateStats = () => {
    if (!data) return null;

    const completedPayments = data.reservations
      .filter(res => res.status === 'completed' && res.payment?.status === 'completed');

    const totalRevenue = completedPayments.reduce((sum, res) => sum + res.payment.amount, 0);
    const totalCommission = completedPayments.reduce((sum, res) => sum + res.payment.commission_amount, 0);
    const totalEarnings = totalRevenue - totalCommission;
    const reservationCount = completedPayments.length;
    const averageRevenue = reservationCount > 0 ? totalRevenue / reservationCount : 0;

    return {
      totalRevenue,
      totalCommission,
      totalEarnings,
      reservationCount,
      averageRevenue,
      completedReservations: completedPayments
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Preloader />
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-slate-blue">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-sand min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} />
          Revenus & Statistiques
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded p-2 text-slate-blue focus:outline-none focus:ring-2 focus:ring-mocha focus:border-transparent"
          >
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
            <option value="all">Toutes périodes</option>
          </select>
        </div>
      </div>

      <div className="flex border-b border-sage-green">
        <button
          className={`px-4 py-2 font-medium ${currentTab === 'overview' ? 'border-b-2 border-mocha text-mocha' : 'text-slate-blue'}`}
          onClick={() => setCurrentTab('overview')}
        >
          Aperçu
        </button>
        <button
          className={`px-4 py-2 font-medium ${currentTab === 'reservations' ? 'border-b-2 border-mocha text-mocha' : 'text-slate-blue'}`}
          onClick={() => setCurrentTab('reservations')}
        >
          Réservations
        </button>
      </div>

      {currentTab === 'overview' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Carte: Revenu total */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green">
            <div className="flex items-center gap-3">
              <div className="bg-mocha p-3 rounded-full">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-blue">Revenu total</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          {/* Carte: Commission */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green">
            <div className="flex items-center gap-3">
              <div className="bg-slate-blue p-3 px-4 rounded-full">
                <FontAwesomeIcon icon={faPercentage} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-blue">Commission (10%)</p>
                <p className="text-2xl font-bold">{stats.totalCommission.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          {/* Carte: Gains nets */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green">
            <div className="flex items-center gap-3">
              <div className="bg-sage-green p-3 px-4 rounded-full">
                <FontAwesomeIcon icon={faReceipt} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-blue">Gains nets</p>
                <p className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          {/* Carte: Nombre de réservations */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green">
            <div className="flex items-center gap-3">
              <div className="bg-pale-blue p-3 px-4 rounded-full">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-slate-blue">Réservations</p>
                <p className="text-2xl font-bold">{stats.reservationCount}</p>
              </div>
            </div>
          </div>

          {/* Graphique (simplifié) */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green sm:col-span-2">
            <h3 className="font-medium mb-4">Revenus par mois</h3>
            <div className="bg-sand h-64 flex items-center justify-center rounded text-slate-blue">
              <p>Graphique des revenus</p>
            </div>
          </div>

          {/* Statistiques supplémentaires */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-sage-green sm:col-span-2">
            <h3 className="font-medium mb-4">Statistiques clés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-blue">Revenu moyen</p>
                <p className="text-xl font-bold">{stats.averageRevenue.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-slate-blue">Prix journalier</p>
                <p className="text-xl font-bold">{data.boat.daily_price.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-slate-blue">Taux d'occupation</p>
                <p className="text-xl font-bold">65%</p>
              </div>
              <div>
                <p className="text-sm text-slate-blue">Annulations</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-sage-green">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sage-green">
              <thead className="bg-sand">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Gains
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-blue uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sage-green">
                {stats.completedReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-sand/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {reservation.reference}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')} au {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {reservation.payment.amount.toFixed(2)} €
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      -{reservation.payment.commission_amount.toFixed(2)} €
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-mocha">
                      {(reservation.payment.amount - reservation.payment.commission_amount).toFixed(2)} €
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status === 'completed' ? 'Complété' :
                         reservation.status === 'confirmed' ? 'Confirmé' :
                         'Inconnu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}