import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSpinner,
  faDownload,
  faPlus,
  faUser,
  faShip,
  faCalendar,
  faEuroSign,
  faFileInvoice,
  faReceipt,
  faClock,
  faTimes,
  faBan,
  faCheck,
  faFileAlt,
  faShieldAlt,
  faGavel,
  faArrowUp,
  faArrowDown,
  faSync,
  faFileExport
} from '@fortawesome/free-solid-svg-icons';

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPayment, setModalPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  // Données simulées
  useEffect(() => {
    const mockPayments = [
      {
        id: 1,
        paymentNumber: 'PAY-2024-001',
        reservation: {
          id: 1,
          boat: { name: 'Ocean Explorer', type: 'Voilier' },
          client: { name: 'Marie Martin', email: 'marie@email.com' },
          owner: { name: 'Jean Dupont', email: 'jean@email.com' }
        },
        status: 'completed',
        type: 'reservation',
        method: 'card',
        amount: 750,
        fees: 15,
        totalAmount: 765,
        currency: 'EUR',
        createdAt: '2024-01-26',
        completedAt: '2024-01-26',
        transactionId: 'TXN-123456789',
        description: 'Paiement réservation Ocean Explorer',
        notes: 'Paiement traité avec succès',
        refunded: false,
        refundAmount: 0,
        documents: ['recu.pdf', 'facture.pdf']
      },
      {
        id: 2,
        paymentNumber: 'PAY-2024-002',
        reservation: {
          id: 2,
          boat: { name: 'Sea Breeze', type: 'Catamaran' },
          client: { name: 'Pierre Bernard', email: 'pierre@email.com' },
          owner: { name: 'Sophie Petit', email: 'sophie@email.com' }
        },
        status: 'pending',
        type: 'deposit',
        method: 'transfer',
        amount: 240,
        fees: 5,
        totalAmount: 245,
        currency: 'EUR',
        createdAt: '2024-01-28',
        completedAt: null,
        transactionId: null,
        description: 'Acompte Sea Breeze',
        notes: 'En attente de confirmation bancaire',
        refunded: false,
        refundAmount: 0,
        documents: ['demande_virement.pdf']
      },
      {
        id: 3,
        paymentNumber: 'PAY-2024-003',
        reservation: {
          id: 3,
          boat: { name: 'Blue Horizon', type: 'Moteur' },
          client: { name: 'Lucas Moreau', email: 'lucas@email.com' },
          owner: { name: 'Pierre Bernard', email: 'pierre@email.com' }
        },
        status: 'refunded',
        type: 'reservation',
        method: 'card',
        amount: 900,
        fees: 18,
        totalAmount: 918,
        currency: 'EUR',
        createdAt: '2024-01-21',
        completedAt: '2024-01-21',
        transactionId: 'TXN-987654321',
        description: 'Paiement réservation Blue Horizon',
        notes: 'Remboursé pour annulation',
        refunded: true,
        refundAmount: 900,
        documents: ['recu.pdf', 'remboursement.pdf']
      }
    ];

    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des paiements
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reservation.boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reservation.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.type === filterType;
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // Gestion de la sélection multiple
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayments(currentPayments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  // Actions sur les paiements
  const handleViewPayment = (payment) => {
    setModalPayment(payment);
    setShowModal(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment({ ...payment });
    setShowEditModal(true);
  };

  const handleApprovePayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'completed', completedAt: new Date().toISOString().split('T')[0] }
        : payment
    ));
  };

  const handleRefundPayment = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment && !payment.refunded) {
      const refundAmount = prompt(`Montant du remboursement pour ${payment.paymentNumber} (max: ${payment.amount}€):`, payment.amount);
      if (refundAmount && !isNaN(refundAmount) && refundAmount <= payment.amount) {
        setPayments(payments.map(p => 
          p.id === paymentId 
            ? { ...p, refunded: true, refundAmount: parseFloat(refundAmount) }
            : p
        ));
      }
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      setPayments(payments.filter(payment => payment.id !== paymentId));
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedPayments.length === 0) return;

    switch (action) {
      case 'approve':
        setPayments(payments.map(payment => 
          selectedPayments.includes(payment.id) 
            ? { ...payment, status: 'completed', completedAt: new Date().toISOString().split('T')[0] }
            : payment
        ));
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPayments.length} paiement(s) ?`)) {
          setPayments(payments.filter(payment => !selectedPayments.includes(payment.id)));
          setSelectedPayments([]);
        }
        break;
      default:
        break;
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Numéro', 'Bateau', 'Client', 'Statut', 'Type', 'Méthode', 'Montant', 'Frais', 'Total'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        payment.paymentNumber,
        payment.reservation.boat.name,
        payment.reservation.client.name,
        payment.status,
        payment.type,
        payment.method,
        payment.amount,
        payment.fees,
        payment.totalAmount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paiements_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Composant pour le statut
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: faCheckCircle, label: 'Complété' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faClock, label: 'En attente' },
      failed: { color: 'bg-red-100 text-red-800', icon: faTimesCircle, label: 'Échoué' },
      refunded: { color: 'bg-blue-100 text-blue-800', icon: faArrowDown, label: 'Remboursé' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: faBan, label: 'Annulé' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Composant pour la méthode de paiement
  const MethodBadge = ({ method }) => {
    const methodConfig = {
      card: { color: 'bg-blue-100 text-blue-800', icon: faCreditCard, label: 'Carte' },
      transfer: { color: 'bg-green-100 text-green-800', icon: faArrowUp, label: 'Virement' },
      cash: { color: 'bg-gray-100 text-gray-800', icon: faEuroSign, label: 'Espèces' },
      check: { color: 'bg-purple-100 text-purple-800', icon: faFileAlt, label: 'Chèque' }
    };

    const config = methodConfig[method] || methodConfig.card;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-[#AD7C59]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez tous les paiements, validez les transactions et suivez les remboursements
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AD7C59] hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nouveau paiement
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complétés</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
            <option value="refunded">Remboursés</option>
            <option value="cancelled">Annulés</option>
          </select>

          {/* Filtre par type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les types</option>
            <option value="reservation">Réservation</option>
            <option value="deposit">Acompte</option>
            <option value="fee">Frais</option>
            <option value="insurance">Assurance</option>
          </select>

          {/* Filtre par méthode */}
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="card">Carte</option>
            <option value="transfer">Virement</option>
            <option value="cash">Espèces</option>
            <option value="check">Chèque</option>
          </select>

          {/* Actions en lot */}
          {selectedPayments.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-2 text-sm text-green-600 hover:text-green-800"
              >
                Approuver
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCreditCard} className="w-8 h-8 text-[#AD7C59]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total paiements</dt>
                <dd className="text-lg font-medium text-gray-900">{payments.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Complétés</dt>
                <dd className="text-lg font-medium text-gray-900">{payments.filter(p => p.status === 'completed').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faClock} className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">En attente</dt>
                <dd className="text-lg font-medium text-gray-900">{payments.filter(p => p.status === 'pending').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faEuroSign} className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Montant total</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.totalAmount, 0)} €
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Table des paiements */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === currentPayments.length && currentPayments.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut & Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montants & Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-[#AD7C59] flex items-center justify-center">
                            <FontAwesomeIcon icon={faCreditCard} className="text-white text-lg" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.paymentNumber}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{payment.type}</div>
                          <div className="text-xs text-gray-400">
                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" />
                            {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <FontAwesomeIcon icon={faShip} className="w-3 h-3 mr-1 text-blue-500" />
                            {payment.reservation.boat.name}
                          </div>
                          <div className="text-xs text-gray-500">{payment.reservation.boat.type}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-1 text-green-500" />
                            {payment.reservation.client.name}
                          </div>
                          <div className="text-xs text-gray-500">{payment.reservation.client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <StatusBadge status={payment.status} />
                        <MethodBadge method={payment.method} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold text-[#AD7C59]">{payment.totalAmount} €</div>
                        <div className="text-xs text-gray-500">Montant: {payment.amount} €</div>
                        <div className="text-xs text-gray-500">Frais: {payment.fees} €</div>
                        {payment.refunded && (
                          <div className="text-xs text-blue-600">Remboursé: {payment.refundAmount} €</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-[#AD7C59] hover:text-[#9B6B47]"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => handleApprovePayment(payment.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {payment.status === 'completed' && !payment.refunded && (
                          <button
                            onClick={() => handleRefundPayment(payment.id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Rembourser"
                          >
                            <FontAwesomeIcon icon={faArrowDown} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {indexOfFirstPayment + 1} à {Math.min(indexOfLastPayment, filteredPayments.length)} sur {filteredPayments.length} résultats
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de détails paiement */}
      {showModal && modalPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails du paiement {modalPayment.paymentNumber}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations du paiement</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Numéro</label>
                      <p className="text-sm text-gray-900">{modalPayment.paymentNumber}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900 capitalize">{modalPayment.type}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <StatusBadge status={modalPayment.status} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Méthode</label>
                      <MethodBadge method={modalPayment.method} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Devise</label>
                      <p className="text-sm text-gray-900">{modalPayment.currency}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 mt-6">Montants</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montant principal</label>
                      <p className="text-sm text-gray-900 font-semibold">{modalPayment.amount} €</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frais</label>
                      <p className="text-sm text-gray-900">{modalPayment.fees} €</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total</label>
                      <p className="text-sm text-gray-900 font-semibold text-[#AD7C59]">{modalPayment.totalAmount} €</p>
                    </div>
                    
                    {modalPayment.refunded && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Remboursé</label>
                        <p className="text-sm text-gray-900 text-blue-600">{modalPayment.refundAmount} €</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Réservation</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bateau</label>
                      <p className="text-sm text-gray-900">{modalPayment.reservation.boat.name} ({modalPayment.reservation.boat.type})</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client</label>
                      <p className="text-sm text-gray-900">{modalPayment.reservation.client.name}</p>
                      <p className="text-xs text-gray-500">{modalPayment.reservation.client.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Propriétaire</label>
                      <p className="text-sm text-gray-900">{modalPayment.reservation.owner.name}</p>
                      <p className="text-xs text-gray-500">{modalPayment.reservation.owner.email}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 mt-6">Détails techniques</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Transaction</label>
                      <p className="text-sm text-gray-900 font-mono">{modalPayment.transactionId || 'Non disponible'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{modalPayment.description}</p>
                    </div>
                    
                    {modalPayment.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <p className="text-sm text-gray-600">{modalPayment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {modalPayment.documents && modalPayment.documents.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                      <div className="space-y-2">
                        {modalPayment.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4 text-red-500" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleEditPayment(modalPayment);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition de paiement */}
      {showEditModal && editingPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Modifier le paiement {editingPayment.paymentNumber}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={editingPayment.status}
                      onChange={(e) => setEditingPayment({
                        ...editingPayment,
                        status: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    >
                      <option value="pending">En attente</option>
                      <option value="completed">Complété</option>
                      <option value="failed">Échoué</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={editingPayment.type}
                      onChange={(e) => setEditingPayment({
                        ...editingPayment,
                        type: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    >
                      <option value="reservation">Réservation</option>
                      <option value="deposit">Acompte</option>
                      <option value="fee">Frais</option>
                      <option value="insurance">Assurance</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editingPayment.notes || ''}
                    onChange={(e) => setEditingPayment({
                      ...editingPayment,
                      notes: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    placeholder="Ajouter des notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Mettre à jour le paiement
                      setPayments(payments.map(payment => 
                        payment.id === editingPayment.id 
                          ? editingPayment
                          : payment
                      ));
                      setShowEditModal(false);
                      setEditingPayment(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsAdmin; 