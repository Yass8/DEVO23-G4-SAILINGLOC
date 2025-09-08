import React, { useState, useEffect, useMemo } from 'react';
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

const ReviewsAdmin = () => {
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

  // Données mockées basées sur le modèle backend
  const mockReviews = [
    {
      id: 1,
      reservation_id: 101,
      rating: 5,
      comment: "Excellent bateau ! La croisière était parfaite, l'équipement était en excellent état et le propriétaire très professionnel. Je recommande vivement !",
      response: "Merci beaucoup pour votre avis positif ! Nous sommes ravis que vous ayez passé un excellent moment.",
      createdAt: '2024-01-15T14:30:00Z',
      userName: 'Marie Dubois',
      userId: 1,
      boatName: 'Bavaria 46 Cruiser',
      boatId: 1
    },
    {
      id: 2,
      reservation_id: 102,
      rating: 4,
      comment: "Très bon bateau, bien équipé. La seule petite déception était la météo qui n'était pas au rendez-vous, mais ce n'est pas de la faute du propriétaire.",
      response: null,
      createdAt: '2024-01-14T16:45:00Z',
      userName: 'Jean Martin',
      userId: 2,
      boatName: 'Catamaran Lagoon 42',
      boatId: 2
    },
    {
      id: 3,
      reservation_id: 103,
      rating: 5,
      comment: "Expérience incroyable ! Le bateau était parfait, la navigation était fluide et le service impeccable. Je reviendrai certainement !",
      response: "Nous sommes ravis que votre expérience ait été à la hauteur de vos attentes ! Vous serez toujours le bienvenu.",
      createdAt: '2024-01-13T11:20:00Z',
      userName: 'Sophie Bernard',
      userId: 3,
      boatName: 'Jeanneau Sun Odyssey 349',
      boatId: 3
    },
    {
      id: 4,
      reservation_id: 104,
      rating: 3,
      comment: "Bateau correct mais quelques petits problèmes techniques. Le propriétaire a été réactif pour les résoudre.",
      response: "Nous nous excusons pour ces désagréments techniques. Nous avons pris note pour améliorer notre service.",
      createdAt: '2024-01-12T09:15:00Z',
      userName: 'Pierre Durand',
      userId: 4,
      boatName: 'Beneteau Oceanis 40.1',
      boatId: 4
    },
    {
      id: 5,
      reservation_id: 105,
      rating: 5,
      comment: "Parfait de A à Z ! Le bateau était impeccable, la réservation facile et le propriétaire très arrangeant. Une expérience à renouveler !",
      response: null,
      createdAt: '2024-01-11T13:40:00Z',
      userName: 'Lucas Moreau',
      userId: 5,
      boatName: 'Dufour 382 Grand Large',
      boatId: 5
    },
    {
      id: 6,
      reservation_id: 106,
      rating: 4,
      comment: "Très satisfait de cette location. Le bateau était bien entretenu et la documentation fournie était complète.",
      response: "Merci pour votre retour positif ! Nous nous efforçons de maintenir cette qualité de service.",
      createdAt: '2024-01-10T15:30:00Z',
      userName: 'Emma Petit',
      userId: 6,
      boatName: 'Hanse 348',
      boatId: 6
    },
    {
      id: 7,
      reservation_id: 107,
      rating: 2,
      comment: "Déçu de cette expérience. Le bateau avait quelques problèmes et la communication avec le propriétaire était difficile.",
      response: "Nous nous excusons sincèrement pour cette expérience décevante. Nous allons améliorer nos processus.",
      createdAt: '2024-01-09T10:20:00Z',
      userName: 'Thomas Leroy',
      userId: 7,
      boatName: 'Catalina 34',
      boatId: 7
    },
    {
      id: 8,
      reservation_id: 108,
      rating: 5,
      comment: "Fantastique ! Tout était parfait, de la réservation au retour. Le bateau était magnifique et la navigation un vrai plaisir.",
      response: "Nous sommes ravis que votre expérience ait été exceptionnelle ! Merci pour cette belle recommandation.",
      createdAt: '2024-01-08T17:15:00Z',
      userName: 'Camille Rousseau',
      userId: 8,
      boatName: 'X-Yachts X4³',
      boatId: 8
    }
  ];

  // Charger les données au montage
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      // Simuler un délai d'API
      setTimeout(() => {
        setReviews(mockReviews);
        setFilteredReviews(mockReviews);
        setIsLoading(false);
      }, 1000);
    };

    loadReviews();
  }, []);

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

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleRespond = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleSubmitResponse = (reviewId, responseText) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, response: responseText } : review
    ));
    
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({ ...prev, response: responseText }));
    }
  };

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setFilteredReviews(prev => prev.filter(review => review.id !== reviewId));
        
        if (selectedReview && selectedReview.id === reviewId) {
          setIsModalOpen(false);
          setSelectedReview(null);
        }
        
        Swal.fire(
          'Supprimé !',
          'L\'avis a été supprimé avec succès.',
          'success'
        );
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

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