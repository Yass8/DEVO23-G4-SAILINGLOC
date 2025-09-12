import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { 
  fetchContracts, 
  fetchContractById, 
  updateContract, 
  deleteContract 
} from '../../services/contractServices';

const Contracts = () => {
  const navigate = useNavigate();
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

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformContractData = (apiContract) => {
    return {
      id: apiContract.id.toString(),
      contractNumber: apiContract.contract_number || `CTR-${apiContract.id}`,
      reservationId: apiContract.reservation_id?.toString() || '',
      type: apiContract.type || 'rental',
      status: apiContract.status || 'pending',
      clientName: `${apiContract.reservation?.user?.firstname || ''} ${apiContract.reservation?.user?.lastname || ''}`.trim(),
      clientEmail: apiContract.reservation?.user?.email || '',
      clientPhone: apiContract.reservation?.user?.phone || '',
      clientAddress: apiContract.reservation?.user?.address || '',
      boatName: apiContract.reservation?.boat?.name || 'Bateau inconnu',
      boatOwner: `${apiContract.reservation?.boat?.user?.firstname || ''} ${apiContract.reservation?.boat?.user?.lastname || ''}`.trim(),
      boatType: apiContract.reservation?.boat?.boat_type?.name || 'Type inconnu',
      port: apiContract.reservation?.boat?.port?.name || 'Port inconnu',
      startDate: apiContract.reservation?.start_date || '',
      endDate: apiContract.reservation?.end_date || '',
      totalAmount: apiContract.reservation?.total_price || 0,
      deposit: apiContract.reservation?.deposit || 0,
      commission: apiContract.commission || 0,
      specialConditions: apiContract.special_conditions || '',
      createdAt: apiContract.created_at,
      reservationConfirmedAt: apiContract.reservation?.confirmed_at || '',
      contractGeneratedAt: apiContract.generated_at || apiContract.created_at,
      reservation_id: apiContract.reservation_id,
      user_id: apiContract.reservation?.user_id
    };
  };

  // Charger les contrats depuis l'API
  useEffect(() => {
    const loadContracts = async () => {
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
        
        console.log(' Chargement des contrats depuis l\'API...');
        const apiContracts = await fetchContracts();
        console.log('✅ Réponse de l\'API:', apiContracts);
        
        if (!Array.isArray(apiContracts)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        const transformedContracts = apiContracts.map(transformContractData);
        console.log('✅ Contrats transformés:', transformedContracts);
        
        setContracts(transformedContracts);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des contrats:', error);
        
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
          text: `Impossible de charger les contrats.\n\nDétails: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#AD7C59'
        });
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [navigate]);

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
        matchesDate = new Date(contract.createdAt) >= yearAgo;
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
    try {
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
        // Appel API pour mettre à jour le statut
        const updateData = { status: newStatus };
        await updateContract(contractId, updateData);
        
        // Mettre à jour le statut local
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
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de mettre à jour le contrat: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#AD7C59'
      });
    }
  }, [contracts]);

  const handleDelete = useCallback(async (contractId) => {
    try {
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
        // Appel API pour supprimer le contrat
        await deleteContract(contractId);
        
        // Retirer de la liste locale
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
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de supprimer le contrat: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#AD7C59'
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
    return <Preloader />;
  }

  return (
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
  );
};

export default Contracts;