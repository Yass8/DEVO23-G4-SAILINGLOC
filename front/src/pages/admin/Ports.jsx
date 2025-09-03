import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  PortHeader,
  PortFilters,
  PortTable,
  PortPagination,
  PortModal
} from '../../components/admin/ports';

const Ports = () => {
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

  // Données mockées basées sur le modèle backend
  const mockPorts = [
    {
      id: 1,
      name: "Port de Nice",
      city: "Nice",
      country: "France",
      latitude: 43.7102,
      longitude: 7.2620,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      Boats: [
        { id: 1, name: "Bavaria 46 Cruiser" },
        { id: 2, name: "Catamaran Lagoon 42" }
      ]
    },
    {
      id: 2,
      name: "Port de Cannes",
      city: "Cannes",
      country: "France",
      latitude: 43.5528,
      longitude: 7.0174,
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
      Boats: [
        { id: 3, name: "Voilier Beneteau Oceanis 45" }
      ]
    },
    {
      id: 3,
      name: "Port de Saint-Tropez",
      city: "Saint-Tropez",
      country: "France",
      latitude: 43.2694,
      longitude: 6.6389,
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
      Boats: [
        { id: 4, name: "Bateau à moteur Azimut 55" }
      ]
    },
    {
      id: 4,
      name: "Port de Monaco",
      city: "Monaco",
      country: "Monaco",
      latitude: 43.7384,
      longitude: 7.4246,
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
      Boats: [
        { id: 5, name: "Yacht Princess 55" }
      ]
    },
    {
      id: 5,
      name: "Port de Antibes",
      city: "Antibes",
      country: "France",
      latitude: 43.5804,
      longitude: 7.1251,
      createdAt: "2024-01-19T11:30:00Z",
      updatedAt: "2024-01-19T11:30:00Z",
      Boats: [
        { id: 6, name: "Voilier Jeanneau Sun Odyssey 519" }
      ]
    }
  ];

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
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Êtes-vous sûr de vouloir supprimer ce port ? Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Mise à jour locale de l'état (simulation)
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
      console.error('Erreur lors de la suppression:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la suppression.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [selectedPort]);

  const handleSavePort = useCallback(async (portData) => {
    try {
      if (modalMode === 'add') {
        // Créer un nouveau port
        const newPort = {
          id: ports.length + 1,
          ...portData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Boats: []
        };
        
        setPorts(prev => [...prev, newPort]);
        
        await Swal.fire({
          title: 'Port créé !',
          text: 'Le port a été créé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        // Mettre à jour le port existant
        setPorts(prev => prev.map(port => 
          port.id === selectedPort.id 
            ? { ...port, ...portData, updatedAt: new Date().toISOString() }
            : port
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
      console.error('Erreur lors de la sauvegarde:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la sauvegarde.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [modalMode, selectedPort, ports]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPort(null);
    setModalMode('add');
  }, []);

  // Chargement des données mockées
  useEffect(() => {
    const loadPorts = async () => {
      setLoading(true);
      try {
        // Simulation d'un délai d'API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPorts(mockPorts);
      } catch (error) {
        console.error('Erreur lors du chargement des ports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPorts();
  }, []);

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