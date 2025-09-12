import React from 'react';

const PaymentCharts = ({ payments }) => {
  // Calcul des données pour les graphiques
  const chartData = React.useMemo(() => {
    const statusCounts = {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0
    };

    const methodCounts = {
      credit_card: 0,
      paypal: 0,
      bank_transfer: 0
    };

    const monthlyData = {};

    payments.forEach(payment => {
      // Comptage par statut
      statusCounts[payment.status]++;
      
      // Comptage par méthode
      methodCounts[payment.method]++;
      
      // Données mensuelles
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, amount: 0, commissions: 0 };
      }
      monthlyData[monthKey].count++;
      monthlyData[monthKey].amount += parseFloat(payment.amount);
      monthlyData[monthKey].commissions += parseFloat(payment.commission_amount);
    });

    return {
      statusCounts,
      methodCounts,
      monthlyData
    };
  }, [payments]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      completed: 'bg-[#10B981]',
      failed: 'bg-red-500',
      refunded: 'bg-[#3B82F6]'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getMethodColor = (method) => {
    const colors = {
      credit_card: 'bg-[#AD7C59]',
      paypal: 'bg-[#4B6A88]',
      bank_transfer: 'bg-[#88B0A1]'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getMethodLabel = (method) => {
    const labels = {
      credit_card: 'Carte de crédit',
      paypal: 'PayPal',
      bank_transfer: 'Virement bancaire'
    };
    return labels[method] || method;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Graphique des statuts */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#AD7C59] mb-4">
          Répartition par Statut
        </h3>
        <div className="space-y-4">
          {Object.entries(chartData.statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${getStatusColor(status)} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {status === 'pending' ? 'En attente' : 
                   status === 'completed' ? 'Complété' :
                   status === 'failed' ? 'Échoué' : 'Remboursé'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">
                  ({payments.length > 0 ? Math.round((count / payments.length) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique des méthodes de paiement */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#AD7C59] mb-4">
          Répartition par Méthode
        </h3>
        <div className="space-y-4">
          {Object.entries(chartData.methodCounts).map(([method, count]) => (
            <div key={method} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${getMethodColor(method)} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {getMethodLabel(method)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">
                  ({payments.length > 0 ? Math.round((count / payments.length) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Évolution mensuelle */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-[#AD7C59] mb-4">
          Évolution Mensuelle
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de Paiements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Propriétaire
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(chartData.monthlyData)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 6)
                .map(([month, data]) => (
                  <tr key={month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(month + '-01').toLocaleDateString('fr-FR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#AD7C59]">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#4B6A88]">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.commissions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#88B0A1]">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.amount - data.commissions)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentCharts; 