import { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import { generateContractPDF } from '../../services/contractPdfService';
import {
  ContractHeader,
  ContractFilters,
  ContractTable,
  ContractPagination,
  ContractModal
} from '../../components/admin/contracts';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Données simulées des contrats (uniquement pour les réservations confirmées)
  const mockContracts = [
    {
      id: 1,
      contractNumber: "CTR-2024-001",
      reservationId: "RES-2024-001", // Lien vers la réservation
      type: "rental",
      status: "active",
      clientName: "Jean Dupont",
      clientEmail: "jean.dupont@email.com",
      clientPhone: "+33 6 12 34 56 78",
      clientAddress: "123 Rue de la Paix, 75001 Paris",
      boatName: "Bavaria 46 Cruiser",
      boatOwner: "Marie Martin",
      boatType: "Voilier",
      port: "Port de Nice",
      startDate: "2024-07-15",
      endDate: "2024-07-22",
      totalAmount: 1200,
      deposit: 300,
      commission: 120,
      specialConditions: "Assurance obligatoire, permis côtier requis",
      createdAt: "2024-07-10",
      reservationConfirmedAt: "2024-07-10", // Date de confirmation de la réservation
      contractGeneratedAt: "2024-07-10" // Date de génération du contrat
    },
    {
      id: 2,
      contractNumber: "CTR-2024-002",
      reservationId: "RES-2024-002",
      type: "rental",
      status: "active",
      clientName: "Sophie Bernard",
      clientEmail: "sophie.bernard@email.com",
      clientPhone: "+33 6 98 76 54 32",
      clientAddress: "456 Avenue des Champs, 13008 Marseille",
      boatName: "Catamaran Lagoon 42",
      boatOwner: "Pierre Durand",
      boatType: "Catamaran",
      port: "Port de Cannes",
      startDate: "2024-07-20",
      endDate: "2024-07-27",
      totalAmount: 1800,
      deposit: 450,
      commission: 180,
      specialConditions: "Formation sécurité obligatoire",
      createdAt: "2024-07-12",
      reservationConfirmedAt: "2024-07-12",
      contractGeneratedAt: "2024-07-12"
    },
    {
      id: 3,
      contractNumber: "CTR-2024-003",
      reservationId: "RES-2024-003",
      type: "maintenance",
      status: "completed",
      clientName: "Marc Leroy",
      clientEmail: "marc.leroy@email.com",
      clientPhone: "+33 6 11 22 33 44",
      clientAddress: "789 Boulevard Maritime, 06000 Nice",
      boatName: "Voilier Beneteau Oceanis 45",
      boatOwner: "Claire Moreau",
      boatType: "Voilier",
      port: "Port de Saint-Tropez",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      totalAmount: 2500,
      deposit: 500,
      commission: 250,
      specialConditions: "Maintenance préventive et réparations",
      createdAt: "2024-05-15",
      reservationConfirmedAt: "2024-05-15",
      contractGeneratedAt: "2024-05-15"
    },
    {
      id: 4,
      contractNumber: "CTR-2024-004",
      reservationId: "RES-2024-004",
      type: "rental",
      status: "active",
      clientName: "Anne Rousseau",
      clientEmail: "anne.rousseau@email.com",
      clientPhone: "+33 6 55 66 77 88",
      clientAddress: "321 Quai des Yachts, 98000 Monaco",
      boatName: "Bateau à moteur Azimut 55",
      boatOwner: "François Petit",
      boatType: "Bateau à moteur",
      port: "Port de Monaco",
      startDate: "2024-08-01",
      endDate: "2024-12-31",
      totalAmount: 3500,
      deposit: 700,
      commission: 350,
      specialConditions: "Assurance tous risques, couverture mondiale",
      createdAt: "2024-07-20",
      reservationConfirmedAt: "2024-07-20",
      contractGeneratedAt: "2024-07-20"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage et pagination
  const { filteredContracts, paginatedContracts, totalPages, itemsPerPage } = useMemo(() => {
    const filtered = contracts.filter(contract => {
      const matchesSearch = 
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.boatName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesType = typeFilter === 'all' || contract.type === typeFilter;
      
      let matchesDate = true;
      if (dateFilter === 'today') {
        const today = new Date();
        const contractDate = new Date(contract.createdAt);
        matchesDate = contractDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(contract.createdAt) >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(contract.createdAt) >= monthAgo;
      } else if (dateFilter === 'quarter') {
        const quarterAgo = new Date();
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        matchesDate = new Date(contract.createdAt) >= quarterAgo;
      } else if (dateFilter === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        matchesDate = new Date(contract.createdAt) >= quarterAgo;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    const startIndex = (currentPage - 1) * 10;
    return {
      filteredContracts: filtered,
      paginatedContracts: filtered.slice(startIndex, startIndex + 10),
      totalPages: Math.ceil(filtered.length / 10),
      itemsPerPage: 10
    };
  }, [contracts, searchTerm, statusFilter, typeFilter, dateFilter, currentPage, updateTrigger]);

  // Gestionnaires
  const handleStatusChange = useCallback(async (contractId, newStatus) => {
    const contract = contracts.find(c => c.id === contractId);
    const statusText = newStatus === 'active' ? 'activer' : 'annuler';
    
    const result = await Swal.fire({
      title: `Confirmer l'action ?`,
      html: `
        <div class="text-left">
          <p><strong>Contrat :</strong> ${contract.contractNumber}</p>
          <p><strong>Réservation :</strong> ${contract.reservationId}</p>
          <p><strong>Client :</strong> ${contract.clientName}</p>
          <p><strong>Action :</strong> ${statusText} le contrat</p>
        </div>
      `,
      icon: newStatus === 'active' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#10B981' : '#F59E0B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: newStatus === 'active' ? 'Activer' : 'Annuler',
      cancelButtonText: 'Annuler l\'action',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setContracts(prev => 
        prev.map(c => c.id === contractId ? { ...c, status: newStatus } : c)
      );
      setUpdateTrigger(prev => prev + 1);
      
      Swal.fire({
        title: 'Succès !',
        text: `Le contrat a été ${newStatus === 'active' ? 'activé' : 'annulé'} avec succès.`,
        icon: 'success',
        confirmButtonColor: '#10B981',
        timer: 2000,
        timerProgressBar: true
      });
    }
  }, [contracts]);

  const handleDelete = useCallback(async (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      html: `
        <div class="text-left">
          <p><strong>Contrat :</strong> ${contract.contractNumber}</p>
          <p><strong>Réservation :</strong> ${contract.reservationId}</p>
          <p><strong>Client :</strong> ${contract.clientName}</p>
          <p class="text-red-600">Cette action est irréversible !</p>
          <p class="text-orange-600">Note : La réservation associée ne sera pas supprimée</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setContracts(prev => prev.filter(c => c.id !== contractId));
      setUpdateTrigger(prev => prev + 1);
      
      Swal.fire({
        title: 'Supprimé !',
        text: 'Le contrat a été supprimé avec succès.',
        icon: 'success',
        confirmButtonColor: '#10B981',
        timer: 2000,
        timerProgressBar: true
      });
    }
  }, [contracts]);

  const handleDownload = useCallback(async (contract) => {
    try {
      // Afficher un indicateur de chargement
      Swal.fire({
        title: 'Génération du PDF...',
        text: `Préparation du contrat ${contract.contractNumber}`,
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      // Générer le PDF
      const result = await generateContractPDF(contract);

      if (result.success) {
        Swal.fire({
          title: 'PDF généré avec succès !',
          text: `Le contrat ${contract.contractNumber} a été téléchargé.`,
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      Swal.fire({
        title: 'Erreur lors de la génération',
        text: 'Impossible de générer le PDF. Veuillez réessayer.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, []);

  const handleEdit = useCallback((contract) => {
    Swal.fire({
      title: 'Modification',
      text: `Ouverture de l'éditeur pour le contrat ${contract.contractNumber}`,
      icon: 'info',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Preloader />
      </div>
    );
  }

  return (
    <>
      <Preloader />
      <div className="space-y-6">
        <ContractHeader />
        
        <ContractFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter} 
          setDateFilter={setDateFilter} 
        />
        <ContractTable 
          contracts={paginatedContracts} 
          onView={(contract) => { 
            setSelectedContract(contract); 
            setShowModal(true); 
          }} 
          onEdit={handleEdit}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
        <ContractPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredContracts.length} 
          itemsPerPage={itemsPerPage} 
          currentItemsCount={paginatedContracts.length} 
        />
        <ContractModal 
          contract={selectedContract} 
          isOpen={showModal} 
          onClose={() => { setShowModal(false); setSelectedContract(null); }} 
          onEdit={handleEdit}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
        />
    </div>
    </>
  );
};

export default Contracts;