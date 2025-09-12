import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  ReservationHeader,
  ReservationFilters,
  ReservationTable,
  ReservationPagination,
  ReservationModal
} from '../../components/admin/reservations';
import { 
  fetchReservations, 
  fetchReservationById, 
  updateReservation, 
  deleteReservation 
} from '../../services/reservationServices';

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformReservationData = (apiReservation) => {
    return {
      id: apiReservation.id.toString(),
      boatName: apiReservation.boat?.name || 'Bateau inconnu',
      clientName: `${apiReservation.user?.firstname || ''} ${apiReservation.user?.lastname || ''}`.trim(),
      clientEmail: apiReservation.user?.email || '',
      startDate: apiReservation.start_date,
      endDate: apiReservation.end_date,
      status: apiReservation.status || 'pending',
      totalPrice: apiReservation.total_price || 0,
      deposit: apiReservation.deposit || 0,
      createdAt: apiReservation.created_at,
      port: apiReservation.boat?.port?.name || 'Port inconnu',
      boatOwner: `${apiReservation.boat?.user?.firstname || ''} ${apiReservation.boat?.user?.lastname || ''}`.trim(),
      reference: apiReservation.reference || '',
      boat_id: apiReservation.boat_id,
      user_id: apiReservation.user_id
    };
  };

  // Charger les réservations depuis l'API
  useEffect(() => {
    const loadReservations = async () => {
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
        
        console.log('�� Chargement des réservations depuis l\'API...');
        const apiReservations = await fetchReservations();
        console.log('✅ Réponse de l\'API:', apiReservations);
        
        if (!Array.isArray(apiReservations)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        const transformedReservations = apiReservations.map(transformReservationData);
        console.log('✅ Réservations transformées:', transformedReservations);
        
        setReservations(transformedReservations);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des réservations:', error);
        
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
          text: `Impossible de charger les réservations.\n\nDétails: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#AD7C59'
        });
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [navigate]);

  // Filtrage et pagination
  const { filteredReservations, paginatedReservations, totalPages, itemsPerPage } = useMemo(() => {
    const filtered = reservations.filter(reservation => {
      const matchesSearch = 
        reservation.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Logique de filtrage par statut améliorée
      let matchesStatus = true;
      if (statusFilter === 'all') {
        matchesStatus = true;
      } else if (statusFilter === 'confirmed_cancelled') {
        matchesStatus = reservation.status === 'confirmed' || reservation.status === 'cancelled';
      } else {
        matchesStatus = reservation.status === statusFilter;
      }
      
      let matchesDate = true;
      if (dateFilter === 'upcoming') matchesDate = new Date(reservation.startDate) > new Date();
      else if (dateFilter === 'past') matchesDate = new Date(reservation.endDate) < new Date();
      else if (dateFilter === 'current') {
        const today = new Date();
        matchesDate = new Date(reservation.startDate) <= today && new Date(reservation.endDate) >= today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    const startIndex = (currentPage - 1) * 10;
    return {
      filteredReservations: filtered,
      paginatedReservations: filtered.slice(startIndex, startIndex + 10),
      totalPages: Math.ceil(filtered.length / 10),
      itemsPerPage: 10
    };
  }, [reservations, searchTerm, statusFilter, dateFilter, currentPage, updateTrigger]);

  // Gestionnaires
  const handleStatusChange = useCallback(async (reservationId, newStatus) => {
    console.log(`�� handleStatusChange appelé avec: ID=${reservationId}, Status=${newStatus}`);
    
    try {
      // Trouver la réservation pour afficher les détails
      const reservation = reservations.find(r => r.id === reservationId);
      const boatName = reservation?.boatName || 'Réservation';
      const clientName = reservation?.clientName || 'Client';
      
      const statusText = newStatus === 'confirmed' ? 'confirmer' : 'annuler';
      const statusIcon = newStatus === 'confirmed' ? 'success' : 'warning';
      
      console.log(`📋 Détails de la réservation: ${boatName} - ${clientName}`);
      
      // Afficher la confirmation SweetAlert
      const result = await Swal.fire({
        title: `Confirmer l'action ?`,
        html: `
          <div class="text-left">
            <p><strong>Bateau :</strong> ${boatName}</p>
            <p><strong>Client :</strong> ${clientName}</p>
            <p><strong>Action :</strong> ${statusText} la réservation</p>
          </div>
        `,
        icon: statusIcon,
        showCancelButton: true,
        confirmButtonColor: newStatus === 'confirmed' ? '#10B981' : '#F59E0B',
        cancelButtonColor: '#6B7280',
        confirmButtonText: newStatus === 'confirmed' ? 'Confirmer' : 'Annuler',
        cancelButtonText: 'Annuler l\'action',
        reverseButtons: true
      });

      console.log(`🎯 Résultat SweetAlert:`, result);

      if (result.isConfirmed) {
        console.log(`✅ Action confirmée, mise à jour du statut...`);
        
        // Appel API pour mettre à jour le statut
        const updateData = { status: newStatus };
        await updateReservation(reservationId, updateData);
        
        // Mettre à jour le statut local
        setReservations(prev => {
          const updated = prev.map(res => 
            res.id === reservationId ? { ...res, status: newStatus } : res
          );
          console.log('�� Réservations mises à jour:', updated);
          return updated;
        });
        
        // Force la mise à jour des composants
        setUpdateTrigger(prev => prev + 1);
        
        // Afficher le succès
        Swal.fire({
          title: 'Succès !',
          text: `La réservation a été ${newStatus === 'confirmed' ? 'confirmée' : 'annulée'} avec succès.`,
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        console.log(`❌ Action annulée par l'utilisateur`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de mettre à jour la réservation: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#AD7C59'
      });
    }
  }, [reservations]);

  const handleDeleteReservation = useCallback(async (reservationId) => {
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      const boatName = reservation?.boatName || 'Réservation';
      const clientName = reservation?.clientName || 'Client';
      
      const result = await Swal.fire({
        title: 'Supprimer la réservation ?',
        html: `
          <div class="text-left">
            <p><strong>Bateau :</strong> ${boatName}</p>
            <p><strong>Client :</strong> ${clientName}</p>
            <p class="text-red-600"><strong>Cette action est irréversible !</strong></p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        await deleteReservation(reservationId);
        
        // Retirer de la liste locale
        setReservations(prev => prev.filter(r => r.id !== reservationId));
        
        Swal.fire({
          title: 'Supprimé !',
          text: 'La réservation a été supprimée avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de supprimer la réservation: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#AD7C59'
      });
    }
  }, [reservations]);

  console.log('�� handleStatusChange défini:', handleStatusChange);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="space-y-6">
      <ReservationHeader />
      <ReservationFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        dateFilter={dateFilter} 
        setDateFilter={setDateFilter} 
      />
      <ReservationTable 
        reservations={paginatedReservations} 
        onView={(reservation) => { 
          console.log('👁️ Vue de la réservation:', reservation.id);
          setSelectedReservation(reservation); 
          setShowModal(true); 
        }} 
        onStatusChange={(id, status) => {
          console.log('🔄 onStatusChange appelé depuis ReservationTable:', { id, status });
          handleStatusChange(id, status);
        }}
        onDelete={handleDeleteReservation}
      />
      <ReservationPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
        totalItems={filteredReservations.length} 
        itemsPerPage={itemsPerPage} 
        currentItemsCount={paginatedReservations.length} 
      />
      <ReservationModal 
        reservation={selectedReservation} 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setSelectedReservation(null); }} 
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteReservation}
      />
    </div>
  );
};

export default Reservations;