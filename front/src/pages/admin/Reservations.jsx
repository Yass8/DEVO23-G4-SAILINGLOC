import { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  ReservationHeader,
  ReservationFilters,
  ReservationTable,
  ReservationPagination,
  ReservationModal
} from '../../components/admin/reservations';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Données simulées
  const mockReservations = [
    { id: 1, boatName: "Bavaria 46 Cruiser", clientName: "Jean Dupont", clientEmail: "jean.dupont@email.com", startDate: "2024-07-15", endDate: "2024-07-22", status: "confirmed", totalPrice: 1200, deposit: 300, createdAt: "2024-07-10", port: "Port de Nice", boatOwner: "Marie Martin" },
    { id: 2, boatName: "Catamaran Lagoon 42", clientName: "Sophie Bernard", clientEmail: "sophie.bernard@email.com", startDate: "2024-07-20", endDate: "2024-07-27", status: "pending", totalPrice: 1800, deposit: 450, createdAt: "2024-07-12", port: "Port de Cannes", boatOwner: "Pierre Durand" },
    { id: 3, boatName: "Voilier Beneteau Oceanis 45", clientName: "Marc Leroy", clientEmail: "marc.leroy@email.com", startDate: "2024-07-18", endDate: "2024-07-25", status: "cancelled", totalPrice: 1400, deposit: 350, createdAt: "2024-07-11", port: "Port de Saint-Tropez", boatOwner: "Claire Moreau" },
    { id: 4, boatName: "Bateau à moteur Azimut 55", clientName: "Anne Rousseau", clientEmail: "anne.rousseau@email.com", startDate: "2024-07-25", endDate: "2024-08-01", status: "completed", totalPrice: 2500, deposit: 625, createdAt: "2024-07-13", port: "Port de Monaco", boatOwner: "François Petit" },
    { id: 5, boatName: "Voilier Jeanneau Sun Odyssey 519", clientName: "Thomas Dubois", clientEmail: "thomas.dubois@email.com", startDate: "2024-08-01", endDate: "2024-08-08", status: "pending", totalPrice: 1600, deposit: 400, createdAt: "2024-07-14", port: "Port de Antibes", boatOwner: "Isabelle Blanc" }
  ];

  useEffect(() => {
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

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
    console.log(`🚀 handleStatusChange appelé avec: ID=${reservationId}, Status=${newStatus}`);
    
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
      
      // Mettre à jour le statut
      setReservations(prev => {
        const updated = prev.map(res => 
          res.id === reservationId ? { ...res, status: newStatus } : res
        );
        console.log('📊 Réservations mises à jour:', updated);
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
  }, [reservations]);

  console.log('🔍 handleStatusChange défini:', handleStatusChange);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="space-y-6">
      <ReservationHeader />
      <ReservationFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} />
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
      />
      <ReservationPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredReservations.length} itemsPerPage={itemsPerPage} currentItemsCount={paginatedReservations.length} />
      <ReservationModal reservation={selectedReservation} isOpen={showModal} onClose={() => { setShowModal(false); setSelectedReservation(null); }} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default Reservations;