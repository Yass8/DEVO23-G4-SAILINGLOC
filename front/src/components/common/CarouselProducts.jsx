import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import CardProduct from './cards/CardProduct';
import { getBoats } from '../../services/boatServices';

const CarouselProducts = () => {
  const getItemsPerPage = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [currentIndex, setCurrentIndex] = useState(0);

  const [boats, setBoats] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getBoats().then((data) => {
      setBoats(data);
    });
  }, []);

  const totalPages = Math.ceil(boats.length / itemsPerPage);
  let visibleItems = boats.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  if (visibleItems.length < itemsPerPage && boats.length > 0) {
    const itemsToAdd = itemsPerPage - visibleItems.length;
    visibleItems = visibleItems.concat(boats.slice(0, itemsToAdd));
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-4 px-4">
      <h2 className="text-center">Nos bateaux les plus prisés</h2>
      <h3 className="text-center">
        Sélection des modèles les plus loués et appréciés
      </h3>      

      <div className="relative">
        <button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 px-3  bg-mocha rounded-[100%] shadow hover:bg-slate-blue text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
          {visibleItems.map((product, index) => (
            <CardProduct
              key={index}
              name={product.name}
              image={product.image}
              length={product.length}
              capacity={product.capacity}
              price={product.price}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 px-3  bg-mocha rounded-[100%] shadow hover:bg-slate-blue text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className='flex justify-center my-4'>
        <button className="custom-button">
          <Link to="/boats">Voir tous les bateaux</Link>
        </button>
      </div>
    </div>
  );
};

export default CarouselProducts;