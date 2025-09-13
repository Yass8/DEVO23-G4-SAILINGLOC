import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  PaymentHeader,
  PaymentFilters,
  PaymentTable,
  PaymentPagination,
  PaymentModal
} from '../../components/admin/payments';
import { 
  fetchPayments, 
  fetchPaymentById, 
  updatePayment, 
  deletePayment 
} from '../../services/paymentServices';

const PaymentsAdmin = () => {
  const navigate = useNavigate();
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

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformPaymentData = (apiPayment) => {
    return {
      id: apiPayment.id.toString(),
      reference: apiPayment.reference || `PAY-${apiPayment.id}`,
      reservation_id: apiPayment.reservation_id,
      reservationId: apiPayment.reservation?.reference || `RES-${apiPayment.reservation_id}`,
      amount: parseFloat(apiPayment.amount) || 0,
      method: apiPayment.method || 'credit_card',
      transaction_id: apiPayment.transaction_id || null,
      status: apiPayment.status || 'pending',
      commission_amount: parseFloat(apiPayment.commission_amount) || 0,
      createdAt: apiPayment.created_at,
      updatedAt: apiPayment.updated_at,
      clientName: `${apiPayment.reservation?.user?.firstname || ''} ${apiPayment.reservation?.user?.lastname || ''}`.trim(),
      clientEmail: apiPayment.reservation?.user?.email || '',
      boatName: apiPayment.reservation?.boat?.name || 'Bateau inconnu',
      boatOwner: `${apiPayment.reservation?.boat?.user?.firstname || ''} ${apiPayment.reservation?.boat?.user?.lastname || ''}`.trim(),
      startDate: apiPayment.reservation?.start_date || '',
      endDate: apiPayment.reservation?.end_date || ''
    };
  };

  // Charger les paiements depuis l'API
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        
        // Vérification de l'authentification
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ Aucun token trouvé, redirection vers la connexion...');
          Swal.fire({
            title: 'Authentification requise !',
            text: 'Vous devez être connecté pour accéder à cette page.',
            icon: 'error',
            confirmButtonColor: '#AD7C59'
          });
          navigate('/login');
          return;
        }
        
        console.log(' Chargement des paiements depuis l\'API...');
        const apiPayments = await fetchPayments();
        console.log('✅ Réponse de l\'API:', apiPayments);
        
        if (!Array.isArray(apiPayments)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        const transformedPayments = apiPayments.map(transformPaymentData);
        console.log('✅ Paiements transformés:', transformedPayments);
        
        setPayments(transformedPayments);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des paiements:', error);
        
        // Gestion spécifique des erreurs d'authentification
        if (error.message.includes('Token invalide') || error.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          Swal.fire({
            title: 'Session expirée !',
            text: 'Votre session a expiré. Veuillez vous reconnecter.',
            icon: 'error',
            confirmButtonColor: '#AD7C59'
          });
          navigate('/login');
          return;
        }
        
        Swal.fire({
          title: 'Erreur de chargement !',
          text: `Impossible de charger les paiements.\n\nDétails: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#AD7C59'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [navigate]);

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
      const payment = payments.find(p => p.id === paymentId);
      const statusText = newStatus === 'completed' ? 'complété' : 'remboursé';
      
      const result = await Swal.fire({
        title: 'Confirmer le changement de statut',
        html: `
          <div class="text-left">
            <p><strong>Paiement :</strong> ${payment.reference}</p>
            <p><strong>Montant :</strong> ${payment.amount}€</p>
            <p><strong>Client :</strong> ${payment.clientName}</p>
            <p><strong>Action :</strong> marquer comme "${statusText}"</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newStatus === 'completed' ? '#10B981' : '#3B82F6',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Appel API pour mettre à jour le statut
        const updateData = { status: newStatus };
        await updatePayment(paymentId, updateData);
        
        // Mise à jour locale de l'état
        setPayments(prev => prev.map(p => 
          p.id === paymentId 
            ? { ...p, status: newStatus, updatedAt: new Date().toISOString() }
            : p
        ));

        await Swal.fire({
          title: 'Statut mis à jour !',
          text: `Le paiement a été marqué comme "${statusText}" avec succès.`,
          icon: 'success',
          confirmButtonColor: '#10B981'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de mettre à jour le paiement: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [payments]);

  const handleDelete = useCallback(async (paymentId) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        html: `
          <div class="text-left">
            <p><strong>Paiement :</strong> ${payment.reference}</p>
            <p><strong>Montant :</strong> ${payment.amount}€</p>
            <p><strong>Client :</strong> ${payment.clientName}</p>
            <p class="text-red-600">Cette action est irréversible !</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Appel API pour supprimer le paiement
        await deletePayment(paymentId);
        
        // Retirer de la liste locale
        setPayments(prev => prev.filter(p => p.id !== paymentId));

        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le paiement a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de supprimer le paiement: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [payments]);

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