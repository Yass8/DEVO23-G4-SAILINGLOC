import React from 'react';

const ReviewStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total des Avis',
      value: `${stats.totalReviews}`,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Note Moyenne',
      value: `${stats.averageRating}/5`,
      change: '+0.3',
      changeType: 'increase'
    },
    {
      title: 'Avis Répondus',
      value: `${stats.respondedReviews}`,
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Taux de Satisfaction',
      value: `${stats.satisfactionRate}%`,
      change: '+5.2%',
      changeType: 'increase'
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewStats; 