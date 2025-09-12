import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  PortHeader,
  PortFilters,
  PortTable,
  PortPagination,
  PortModal
} from '../../components/admin/ports';
import { 
  fetchPorts, 
  createPort, 
  updatePort, 
  deletePort 
} from '../../services/portServices';

const Ports = () => {
  const navigate = useNavigate();
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPort, setSelectedPort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    city: '',
    showAddModal: false
  });

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformPortData = (apiPort) => {
    return {
      id: apiPort.id.toString(),
      name: apiPort.name || '',
      city: apiPort.city || '',
      country: apiPort.country || '',
      latitude: parseFloat(apiPort.latitude) || 0,
      longitude: parseFloat(apiPort.longitude) || 0,
      description: apiPort.description || '',
      facilities: apiPort.facilities || [],
      capacity: parseInt(apiPort.capacity) || 0,
      is_active: apiPort.is_active !== false,
      created_at: apiPort.created_at,
      updated_at: apiPort.updated_at
    };
  };

  // Filtrage des ports
  const filteredPorts = useMemo(() => {
    return ports.filter(port => {
      const matchesSearch = !filters.search || 
        port.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        port.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        port.country.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCountry = !filters.country || port.country === filters.country;
      const matchesCity = !filters.city || port.city === filters.city;

      return matchesSearch && matchesCountry && matchesCity;
    });
  }, [ports, filters]);

  // Pagination
  const paginatedPorts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPorts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPorts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPorts.length / itemsPerPage);

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    if (key === 'showAddModal') {
      setModalMode('add');
      setSelectedPort(null);
      setIsModalOpen(true);
      return;
    }
    
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

  const handleViewDetails = useCallback((port) => {
    setSelectedPort(port);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((port) => {
    setSelectedPort(port);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (portId) => {
    try {
      const port = ports.find(p => p.id === portId);
      
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        html: `
          <div class="text-left">
            <p><strong>Port :</strong> ${port.name}</p>
            <p><strong>Ville :</strong> ${port.city}</p>
            <p><strong>Pays :</strong> ${port.country}</p>
            <p class="text-red-600">Cette action est irréversible !</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Appel API pour supprimer le port
        await deletePort(portId);
        
        // Mise à jour locale de l'état
        setPorts(prev => prev.filter(port => port.id !== portId));
        
        if (selectedPort?.id === portId) {
          setIsModalOpen(false);
          setSelectedPort(null);
        }

        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le port a été supprimé avec succès.',
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
        text: `Impossible de supprimer le port: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [selectedPort, ports]);

  const handleSavePort = useCallback(async (portData) => {
    try {
      if (modalMode === 'add') {
        // Créer un nouveau port via API
        const newPort = await createPort(portData);
        const transformedPort = transformPortData(newPort);
        setPorts(prev => [...prev, transformedPort]);
        
        await Swal.fire({
          title: 'Port créé !',
          text: 'Le port a été créé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        // Mettre à jour le port existant via API
        const updatedPort = await updatePort(selectedPort.id, portData);
        const transformedPort = transformPortData(updatedPort);
        setPorts(prev => prev.map(port => 
          port.id === selectedPort.id ? transformedPort : port
        ));
        
        await Swal.fire({
          title: 'Port mis à jour !',
          text: 'Le port a été modifié avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      }
      
      setIsModalOpen(false);
      setSelectedPort(null);
      setModalMode('add');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible de sauvegarder le port: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [modalMode, selectedPort]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPort(null);
    setModalMode('add');
  }, []);

  // Chargement des données depuis l'API
  useEffect(() => {
    const loadPorts = async () => {
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
        
        console.log(' Chargement des ports depuis l\'API...');
        const apiPorts = await fetchPorts();
        console.log('✅ Réponse de l\'API:', apiPorts);
        
        if (!Array.isArray(apiPorts)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        const transformedPorts = apiPorts.map(transformPortData);
        console.log('✅ Ports transformés:', transformedPorts);
        
        setPorts(transformedPorts);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des ports:', error);
        
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
          text: `Impossible de charger les ports.\n\nDétails: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#AD7C59'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPorts();
  }, [navigate]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PortHeader />
        <PortFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
        <PortTable 
          ports={paginatedPorts}
          onView={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <PortPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredPorts.length}
          itemsPerPage={itemsPerPage}
          currentItemsCount={paginatedPorts.length}
        />
        <PortModal
          port={selectedPort}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSavePort}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Ports;