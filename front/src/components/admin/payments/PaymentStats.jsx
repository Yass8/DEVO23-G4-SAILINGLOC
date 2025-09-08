import React from 'react';

const PaymentStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total des Paiements',
      value: `${stats.totalPayments}`,
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      ),
      bgColor: 'bg-[#4B6A88]',
      iconColor: 'text-[#4B6A88]'
    },
    {
      title: 'Montant Total',
      value: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalAmount)}`,
      change: '+8.5%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      bgColor: 'bg-[#88B0A1]',
      iconColor: 'text-[#88B0A1]'
    },
    {
      title: 'Commissions',
      value: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalCommissions)}`,
      change: '+15.2%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
        </svg>
      ),
      bgColor: 'bg-[#AD7C59]',
      iconColor: 'text-[#AD7C59]'
    },
    {
      title: 'Taux de Succès',
      value: `${stats.successRate}%`,
      change: '+2.1%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      ),
      bgColor: 'bg-[#D1FAE5]',
      iconColor: 'text-[#10B981]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} bg-opacity-10 rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStats; 