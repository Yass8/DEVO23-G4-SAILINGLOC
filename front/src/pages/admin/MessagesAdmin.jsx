import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  MessageHeader,
  MessageFilters,
  MessageTable,
  MessagePagination,
  MessageModal
} from '../../components/admin/messages';
import Preloader from '../../components/common/Preloader';
import { 
  fetchMessages, 
  fetchMessageById, 
  updateMessage, 
  deleteMessage 
} from '../../services/messageServices';

const MessagesAdmin = () => {
  const navigate = useNavigate();
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

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Token invalide, nettoyage et redirection...');
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fonction de transformation des données API
  const transformMessageData = (apiMessage) => {
    return {
      id: apiMessage.id,
      sender_id: apiMessage.sender_id,
      receiver_id: apiMessage.receiver_id,
      reservation_id: apiMessage.reservation_id,
      content: apiMessage.content,
      is_read: apiMessage.is_read,
      createdAt: apiMessage.createdAt,
      senderName: apiMessage.sender?.firstname + ' ' + apiMessage.sender?.lastname || 'Utilisateur inconnu',
      receiverName: apiMessage.receiver?.firstname + ' ' + apiMessage.receiver?.lastname || 'Utilisateur inconnu',
      senderType: apiMessage.sender?.roles?.[0]?.toLowerCase() || 'client',
      receiverType: apiMessage.receiver?.roles?.[0]?.toLowerCase() || 'client'
    };
  };

  // Charger les messages depuis l'API
  const loadMessages = useCallback(async () => {
    try {
      console.log('🔄 Chargement des messages depuis l\'API...');
      setIsLoading(true);
      
      const response = await fetchMessages();
      console.log('✅ Réponse de l\'API:', response);
      
      const transformedMessages = response.map(transformMessageData);
      console.log('✅ Messages transformés:', transformedMessages);
      
      setMessages(transformedMessages);
      setFilteredMessages(transformedMessages);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des messages:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les messages. Veuillez réessayer.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

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

  // Fonctions d'action avec API
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
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
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de supprimer le message. Veuillez réessayer.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await updateMessage(messageId, { is_read: true });
      
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
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de marquer le message comme lu. Veuillez réessayer.',
        confirmButtonText: 'OK'
      });
    }
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
        handleDeleteMessage(messageId);
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