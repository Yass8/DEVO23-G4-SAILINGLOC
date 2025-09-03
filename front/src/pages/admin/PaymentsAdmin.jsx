import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  PaymentHeader,
  PaymentFilters,
  PaymentTable,
  PaymentPagination,
  PaymentModal
} from '../../components/admin/payments';

const PaymentsAdmin = () => {
  // États
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    amount: ''
  });

  // Données mockées basées sur le modèle backend
    const mockPayments = [
      {
        id: 1,
      reference: 'PAY-2024-001',
      reservation_id: 1,
      reservationId: 'RES-2024-001',
      amount: 1250.00,
      method: 'credit_card',
      transaction_id: 'TXN_123456789',
        status: 'completed',
      commission_amount: 125.00,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      clientName: 'Jean Dupont',
      clientEmail: 'jean.dupont@email.com',
      boatName: 'Bavaria 46 Cruiser',
      boatOwner: 'Marie Martin',
      startDate: '2024-02-01',
      endDate: '2024-02-08'
      },
      {
        id: 2,
      reference: 'PAY-2024-002',
      reservation_id: 2,
      reservationId: 'RES-2024-002',
      amount: 890.00,
      method: 'credit_card',
      transaction_id: 'TXN_987654321',
        status: 'pending',
      commission_amount: 89.00,
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      clientName: 'Sophie Bernard',
      clientEmail: 'sophie.bernard@email.com',
      boatName: 'Catamaran Lagoon 42',
      boatOwner: 'Pierre Durand',
      startDate: '2024-02-15',
      endDate: '2024-02-22'
      },
      {
        id: 3,
      reference: 'PAY-2024-003',
      reservation_id: 3,
      reservationId: 'RES-2024-003',
      amount: 2100.00,
      method: 'credit_card',
      transaction_id: null,
      status: 'failed',
      commission_amount: 210.00,
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z',
      clientName: 'Lucas Moreau',
      clientEmail: 'lucas.moreau@email.com',
      boatName: 'Yacht Princess 55',
      boatOwner: 'Claire Rousseau',
      startDate: '2024-03-01',
      endDate: '2024-03-08'
    },
    {
      id: 4,
      reference: 'PAY-2024-004',
      reservation_id: 4,
      reservationId: 'RES-2024-004',
      amount: 750.00,
      method: 'credit_card',
      transaction_id: 'TXN_456789123',
      status: 'completed',
      commission_amount: 75.00,
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      clientName: 'Emma Petit',
      clientEmail: 'emma.petit@email.com',
      boatName: 'Voilier Beneteau Oceanis 45',
      boatOwner: 'Thomas Leroy',
      startDate: '2024-02-20',
      endDate: '2024-02-27'
    },
    {
      id: 5,
      reference: 'PAY-2024-005',
      reservation_id: 5,
      reservationId: 'RES-2024-005',
      amount: 1800.00,
      method: 'credit_card',
      transaction_id: 'TXN_789123456',
        status: 'refunded',
      commission_amount: 180.00,
      createdAt: '2024-01-19T11:30:00Z',
      updatedAt: '2024-01-20T15:20:00Z',
      clientName: 'Antoine Girard',
      clientEmail: 'antoine.girard@email.com',
      boatName: 'Bateau à moteur Azimut 50',
      boatOwner: 'Nathalie Dubois',
      startDate: '2024-03-10',
      endDate: '2024-03-17'
    }
  ];

  // Filtrage des paiements
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = !filters.search || 
        payment.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.clientEmail.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || payment.status === filters.status;
      const matchesAmount = !filters.amount || payment.amount === parseFloat(filters.amount);

      return matchesSearch && matchesStatus && matchesAmount;
    });
  }, [payments, filters]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewDetails = useCallback((payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  }, []);

  const handleStatusChange = useCallback(async (paymentId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer le changement de statut',
        text: `Voulez-vous vraiment marquer ce paiement comme "${newStatus === 'completed' ? 'complété' : 'remboursé'}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newStatus === 'completed' ? '#10B981' : '#3B82F6',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Mise à jour locale de l'état (simulation)
        setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
            ? { ...payment, status: newStatus, updatedAt: new Date().toISOString() }
        : payment
        ));

        await Swal.fire({
          title: 'Statut mis à jour !',
          text: `Le paiement a été marqué comme "${newStatus === 'completed' ? 'complété' : 'remboursé'}" avec succès.`,
          icon: 'success',
          confirmButtonColor: '#10B981'
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour du statut.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, []);

  const handleDelete = useCallback(async (paymentId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Voulez-vous vraiment supprimer ce paiement ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Mise à jour locale de l'état (simulation)
        setPayments(prev => prev.filter(payment => payment.id !== paymentId));

        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le paiement a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la suppression du paiement.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, []);

  // Effets pour le modal
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedPayment(null);
    }
  }, [selectedPayment]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  }, []);

  // Chargement des données mockées
  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        // Simulation d'un délai d'API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayments(mockPayments);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PaymentHeader />
        <PaymentFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
        <PaymentTable 
          payments={filteredPayments}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
        {totalPages > 1 && (
          <PaymentPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <PaymentModal 
          payment={selectedPayment}
          isOpen={isModalOpen}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PaymentsAdmin; 