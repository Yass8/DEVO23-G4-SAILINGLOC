import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import {
  MessageHeader,
  MessageFilters,
  MessageTable,
  MessagePagination,
  MessageModal
} from '../../components/admin/messages';
import Preloader from '../../components/common/Preloader';

const MessagesAdmin = () => {
  // États
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    readStatus: '',
    userType: '',
    minDate: ''
  });

  // Fonctions d'action avec SweetAlert
  const handleDeleteMessage = (messageId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Ce message sera définitivement supprimé",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setFilteredMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        Swal.fire(
          'Supprimé !',
          'Le message a été supprimé avec succès.',
          'success'
        );
      }
    });
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, is_read: true } : msg
    ));
    
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => ({ ...prev, is_read: true }));
    }
    
    Swal.fire(
      'Marqué comme lu !',
      'Le message a été marqué comme lu.',
      'success'
    );
  };

  const handleBulkDelete = () => {
    if (selectedMessage && selectedMessage.length === 0) return;
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez supprimer ${selectedMessage ? 1 : 0} message(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logique de suppression en lot
        Swal.fire(
          'Supprimé !',
          'Les messages ont été supprimés avec succès.',
          'success'
        );
      }
    });
  };

  // Données mockées basées sur le modèle backend
  const mockMessages = [
    {
      id: 1,
      sender_id: 1,
      receiver_id: 2,
      reservation_id: 101,
      content: "Bonjour, j'aimerais réserver votre bateau pour le weekend du 15-16 juin. Pouvez-vous me donner plus d'informations sur les disponibilités et les tarifs ?",
      is_read: false,
      createdAt: '2024-01-15T10:30:00Z',
      senderName: 'Marie Dubois',
      receiverName: 'Jean Martin',
      senderType: 'client',
      receiverType: 'proprietaire'
    },
    {
      id: 2,
      sender_id: 2,
      receiver_id: 1,
      reservation_id: 101,
      content: "Bonjour Marie, bien sûr ! Votre bateau est disponible ce weekend. Le tarif est de 150€ par jour. Souhaitez-vous confirmer la réservation ?",
      is_read: true,
      createdAt: '2024-01-15T11:15:00Z',
      senderName: 'Jean Martin',
      receiverName: 'Marie Dubois',
      senderType: 'proprietaire',
      receiverType: 'client'
    },
    {
      id: 3,
      sender_id: 3,
      receiver_id: 4,
      reservation_id: null,
      content: "Salut ! Comment ça va ? J'ai une question sur le nouveau système de réservation.",
      is_read: false,
      createdAt: '2024-01-14T16:45:00Z',
      senderName: 'Sophie Bernard',
      receiverName: 'Pierre Durand',
      senderType: 'client',
      receiverType: 'admin'
    },
    {
      id: 4,
      sender_id: 4,
      receiver_id: 3,
      reservation_id: null,
      content: "Ça va bien, merci ! Le nouveau système est maintenant opérationnel. Quelles sont vos questions ?",
      is_read: true,
      createdAt: '2024-01-14T17:20:00Z',
      senderName: 'Pierre Durand',
      receiverName: 'Sophie Bernard',
      senderType: 'admin',
      receiverType: 'client'
    },
    {
      id: 5,
      sender_id: 5,
      receiver_id: 6,
      reservation_id: 102,
      content: "Bonjour, j'ai un problème avec ma réservation. Le bateau n'est pas disponible à la date indiquée.",
      is_read: false,
      createdAt: '2024-01-13T09:30:00Z',
      senderName: 'Lucas Moreau',
      receiverName: 'Emma Petit',
      senderType: 'client',
      receiverType: 'proprietaire'
    },
    {
      id: 6,
      sender_id: 6,
      receiver_id: 5,
      reservation_id: 102,
      content: "Je m'excuse pour ce désagrément. Il y a eu une erreur dans notre système. Je vais vous proposer une alternative.",
      is_read: true,
      createdAt: '2024-01-13T10:15:00Z',
      senderName: 'Emma Petit',
      receiverName: 'Lucas Moreau',
      senderType: 'proprietaire',
      receiverType: 'client'
    },
    {
      id: 7,
      sender_id: 7,
      receiver_id: 8,
      reservation_id: 103,
      content: "Merci pour votre accueil hier ! Le bateau était parfait et la croisière était magnifique.",
      is_read: true,
      createdAt: '2024-01-12T14:20:00Z',
      senderName: 'Thomas Leroy',
      receiverName: 'Camille Rousseau',
      senderType: 'client',
      receiverType: 'proprietaire'
    },
    {
      id: 8,
      sender_id: 8,
      receiver_id: 7,
      reservation_id: 103,
      content: "Ravie que vous ayez passé un bon moment ! N'hésitez pas à revenir, vous serez toujours le bienvenu.",
      is_read: false,
      createdAt: '2024-01-12T15:00:00Z',
      senderName: 'Camille Rousseau',
      receiverName: 'Thomas Leroy',
      senderType: 'proprietaire',
      receiverType: 'client'
    }
  ];

  // Charger les données au montage
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      // Simuler un délai d'API
      setTimeout(() => {
        setMessages(mockMessages);
        setFilteredMessages(mockMessages);
        setIsLoading(false);
      }, 1000);
    };

    loadMessages();
  }, []);

  // Filtrer les messages
  useEffect(() => {
    let filtered = [...messages];

    // Filtre de recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(message =>
        message.content.toLowerCase().includes(searchLower) ||
        message.senderName?.toLowerCase().includes(searchLower) ||
        message.receiverName?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre de statut de lecture
    if (filters.readStatus) {
      if (filters.readStatus === 'read') {
        filtered = filtered.filter(message => message.is_read);
      } else if (filters.readStatus === 'unread') {
        filtered = filtered.filter(message => !message.is_read);
      }
    }

    // Filtre de type d'utilisateur
    if (filters.userType) {
      filtered = filtered.filter(message =>
        message.senderType === filters.userType ||
        message.receiverType === filters.userType
      );
    }

    // Filtre de date
    if (filters.minDate) {
      const minDate = new Date(filters.minDate);
      filtered = filtered.filter(message => new Date(message.createdAt) >= minDate);
    }

    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, filters]);



  // Gestionnaires d'événements
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleDelete = (messageId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Ce message sera définitivement supprimé",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setFilteredMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        if (selectedMessage && selectedMessage.id === messageId) {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }
        
        Swal.fire(
          'Supprimé !',
          'Le message a été supprimé avec succès.',
          'success'
        );
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <MessageHeader />

        {/* Filtres */}
        <MessageFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Tableau des messages */}
        <MessageTable
          messages={filteredMessages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onViewDetails={handleViewDetails}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <MessagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal de détails */}
        <MessageModal
          message={selectedMessage}
          isOpen={isModalOpen}
          onClose={closeModal}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default MessagesAdmin; 