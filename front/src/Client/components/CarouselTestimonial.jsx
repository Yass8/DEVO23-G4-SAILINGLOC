import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";

const boatTestimonials = [
  {
    name: "Marc L.",
    image: "/images/profil/1.jpg",
    rating: 5,
    paragraphe:
      "Louer un voilier via SailingLoc a été une expérience incroyable. Le bateau était en excellent état, et le processus de réservation était fluide. Nous avons passé une semaine magique à explorer la côte méditerranéenne. Je recommande vivement !",
  },
  {
    name: "Sophie D.",
    image: "/images/profil/2.jpg",
    rating: 4,
    paragraphe:
      "Nous avons loué un catamaran pour un week-end entre amis, et tout était parfait ! L’équipe de SailingLoc nous a accompagnés à chaque étape, et le bateau était spacieux et confortable. Une expérience à refaire !",
  },
  {
    name: "Julien R.",
    image: "/images/profil/3.jpg",
    rating: 5,
    paragraphe:
      "C’était ma première location de bateau, et SailingLoc m’a vraiment facilité la tâche. Le site est intuitif, et j’ai trouvé exactement ce que je cherchais en quelques clics. Le bateau était conforme à la description, et la prise en main s’est faite sans souci.",
  },
  {
    name: "Claire M.",
    image: "/images/profil/4.jpg",
    rating: 3,
    paragraphe:
      "Nous avons loué un bateau à moteur pour une journée en famille, et c’était une expérience inoubliable. Les enfants ont adoré, et nous avons pu découvrir des criques magnifiques. Merci à SailingLoc pour cette belle aventure !",
  },
  {
    name: "Jean B.",
    image: "/images/profil/5.jpg",
    rating: 4,
    paragraphe:
      "Louer un voilier via SailingLoc a été une expérience incroyable. Le bateau était en excellent état, et le processus de réservation était fluide. Nous avons passé une semaine magique à explorer la côte méditerranéenne. Je recommande vivement !",
  },
];

const CarouselTestimonial = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Nombre d'éléments par page selon la taille d'écran
  const getItemsPerPage = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2; 
    return 4; 
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Met à jour automatiquement à chaque redimensionnement
  React.useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(boatTestimonials.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  let visibleItems = boatTestimonials.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (visibleItems.length < itemsPerPage && boatTestimonials.length > 0) {
    const itemsToAdd = itemsPerPage - visibleItems.length;
    visibleItems = visibleItems.concat(boatTestimonials.slice(0, itemsToAdd));
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-center">Ce que nos navigateurs disent de nous</h2>
      <h3 className="text-center">Des expériences inoubliables en mer</h3>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center`}>
        {visibleItems.map((boat, index) => (
          <div
            key={index}
            className="max-w-sm p-6 bg-white rounded-lg shadow-sm"
          >
            <p className="mb-3 font-normal lg:h-50">{boat.paragraphe}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex justify-center items-center">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <p className="font-bold">{boat.name}</p>
              </div>
              <div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < boat.rating ? faStar : faRegularStar}
                      className="text-[#AD7C59] w-3 h-3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentPage === index ? "bg-[#4B6A88]" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselTestimonial;
