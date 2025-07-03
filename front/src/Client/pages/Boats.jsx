import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";

import Filter from "../components/Filter";
import Breadcrumb from "../components/Breadcrumb";
import { getBoats } from "../../services/boatServices";
import CardProduct from "../components/cards/CardProduct";
import { useEffect, useState } from "react";
function Boats() {
  const [boats, setBoats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const boatsPerPage = 9;

  useEffect(() => {
    getBoats().then((data) => {
      setBoats(data);
    });
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(boats.length / boatsPerPage);

  // Affiche toujours 6 bateaux par page
  const offset = currentPage * boatsPerPage;
  let currentBoats = boats.slice(offset, offset + boatsPerPage);

  // Si le nombre de bateaux est inférieur à 6, on remplit avec les premiers bateaux
  if (currentBoats.length < boatsPerPage && boats.length > 0) {
    const boatsToAdd = boatsPerPage - currentBoats.length;
    currentBoats = currentBoats.concat(boats.slice(0, boatsToAdd));
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // Met à jour la page courante
  };

  return (
    <div className="lg:flex lg:items-start">
      <div className="w-full sm:w-8/12 lg:w-3/12 mx-auto">
        <div className="block m-4 pt-1 bg-[#4B6A88] text-[#F5F1EB] rounded-sm">
          <div className="search m-4">
            {/* form de recherche */}
            <form className="flex flex-col">
              <div className="flex justify-items-center bg-[#F5F1EB] p-2 rounded">
                <input
                  type="text"
                  placeholder="Rechercher un bateau..."
                  className="w-full rounded placeholder:text-black placeholder:opacity-50 p-2 focus:outline-none text-black"
                />
                <button
                  type="submit"
                  className="bg-[#4B6A88] text-center text-[#F5F1EB] p-2 rounded hover:bg-[#8B5A3E]"
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                </button>
              </div>
            </form>
          </div>
          <div className="filter border-t border-[#F5F1EB] mt-4 p-4">
            <Filter />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-9/12 flex justify-center lg:block p-4 lg:mt-24">
        <div className="">
          <Breadcrumb
            items={[
              { label: "Marseille", href: "/search?port=marseille" },
              { label: "Voiliers", href: "/search?type=voilier" },
              { label: "Luxe", href: "#" },
            ]}
          />
          {/* Nombre de bateaux trouver dans un span ex. 1245 bateaux */}
          <div className="mt-4">
            <span className="text-sm font-bold mt-20">
              {boats.length} bateaux trouvés
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
            {currentBoats.map((boat, index) => (
              <CardProduct
                key={index}
                name={boat.name}
                image={boat.image}
                length={boat.length}
                capacity={boat.capacity}
                price={boat.price}
                onClick={() => console.log(`Voir le bateau: ${boat.name}`)}
              />
            ))}
          </div>
          {/* Pagination design */}
          <div className="flex justify-center mt-6">
            {boats.length > boatsPerPage && (
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName="inline-flex rounded-md shadow-sm text-sm mt-6"
                pageClassName="inline-block" // 💡 ceci est indispensable
                pageLinkClassName="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                previousClassName="inline-block" // au cas où
                previousLinkClassName="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                nextClassName="inline-block"
                nextLinkClassName="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                breakClassName="inline-block"
                breakLinkClassName="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-400 cursor-default"
                activeClassName="bg-red-500" // ✅ ici ça s’applique à <li>
                activeLinkClassName="text-blue-500 font-extrabold pointer-events-none"
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boats;
