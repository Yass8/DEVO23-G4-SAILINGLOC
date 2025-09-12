import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ReviewHeader,
  ReviewFilters,
  ReviewTable,
  ReviewPagination,
  ReviewModal
} from '../../components/admin/reviews';
import Preloader from '../../components/common/Preloader';
import { 
  fetchReviews, 
  fetchReviewById, 
  updateReview, 
  deleteReview 
} from '../../services/reviewServices';

const ReviewsAdmin = () => {
  const navigate = useNavigate();
  // États
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    hasResponse: '',
    minDate: ''
  });

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformReviewData = (apiReview) => {
    return {
      id: apiReview.id.toString(),
      reservation_id: apiReview.reservation_id,
      rating: parseInt(apiReview.rating) || 0,
      comment: apiReview.comment || '',
      response: apiReview.response || null,
      createdAt: apiReview.created_at,
      updatedAt: apiReview.updated_at,
      userName: `${apiReview.user?.firstname || ''} ${apiReview.user?.lastname || ''}`.trim(),
      userId: apiReview.user_id,
      boatName: apiReview.boat?.name || 'Bateau inconnu',
      boatId: apiReview.boat_id
    };
  };

  // Charger les avis depuis l'API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        
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
        
        console.log(' Chargement des avis depuis l\'API...');
        const apiReviews = await fetchReviews();
        console.log('✅ Réponse de l\'API:', apiReviews);
        
        if (!Array.isArray(apiReviews)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        const transformedReviews = apiReviews.map(transformReviewData);
        console.log('✅ Avis transformés:', transformedReviews);
        
        setReviews(transformedReviews);
        setFilteredReviews(transformedReviews);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des avis:', error);
        
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
          text: `Impossible de charger les avis.\n\nDétails: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#AD7C59'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [navigate]);

  // Filtrer les avis
  useEffect(() => {
    let filtered = [...reviews];

    // Filtre de recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(review =>
        review.comment?.toLowerCase().includes(searchLower) ||
        review.userName?.toLowerCase().includes(searchLower) ||
        review.boatName?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre de note
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === parseInt(filters.rating));
    }

    // Filtre de réponse
    if (filters.hasResponse !== '') {
      const hasResponse = filters.hasResponse === 'true';
      filtered = filtered.filter(review => !!review.response === hasResponse);
    }

    // Filtre de date
    if (filters.minDate) {
      const minDate = new Date(filters.minDate);
      filtered = filtered.filter(review => new Date(review.createdAt) >= minDate);
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [reviews, filters]);

  // Gestionnaires d'événements
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewDetails = useCallback((review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  }, []);

  const handleRespond = useCallback((review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  }, []);

  const handleSubmitResponse = useCallback(async (reviewId, responseText) => {
    try {
      // Appel API pour mettre à jour la réponse
      const updateData = { response: responseText };
      await updateReview(reviewId, updateData);
      
      // Mise à jour locale
      setReviews(prev => prev.map(review =>
        review.id === reviewId ? { ...review, response: responseText } : review
      ));
      
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview(prev => ({ ...prev, response: responseText }));
      }
      
      Swal.fire({
        title: 'Réponse ajoutée !',
        text: 'Votre réponse a été enregistrée avec succès.',
        icon: 'success',
        confirmButtonColor: '#10B981',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la réponse:', error);
      Swal.fire({
        title: 'Erreur !',
        text: `Impossible d'ajouter la réponse: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [selectedReview]);

  const handleDelete = useCallback(async (reviewId) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        html: `
          <div class="text-left">
            <p><strong>Avis de :</strong> ${review.userName}</p>
            <p><strong>Bateau :</strong> ${review.boatName}</p>
            <p><strong>Note :</strong> ${review.rating}/5</p>
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
        // Appel API pour supprimer l'avis
        await deleteReview(reviewId);
        
        // Mise à jour locale
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setFilteredReviews(prev => prev.filter(review => review.id !== reviewId));
        
        if (selectedReview && selectedReview.id === reviewId) {
          setIsModalOpen(false);
          setSelectedReview(null);
        }
        
        Swal.fire({
          title: 'Supprimé !',
          text: 'L\'avis a été supprimé avec succès.',
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
        text: `Impossible de supprimer l'avis: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [reviews, selectedReview]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedReview(null);
  }, []);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ReviewHeader />

        {/* Filtres */}
        <ReviewFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Tableau des avis */}
        <ReviewTable
          reviews={filteredReviews}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onViewDetails={handleViewDetails}
          onRespond={handleRespond}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <ReviewPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modal de détails */}
        <ReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={closeModal}
          onRespond={handleSubmitResponse}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ReviewsAdmin;