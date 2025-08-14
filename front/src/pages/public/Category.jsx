import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import { Link } from "react-router-dom";

const categories = [
  { label: "Voilier", img: "/images/bavaria46cruiser.jpg", link: "/boats?type=voilier" },
  { label: "Bateaux à moteurs", img: "/images/moteurBoat.jpeg", link: "/boats?type=moteur" },
  { label: "Bateau fluvial", img: "/images/fluvial.jpg", link: "/boats?type=fluvial" },
  { label: "Catamarans", img: "/images/catamaran.jpg", link: "/boats?type=catamaran" },
  { label: "Yatch", img: "/images/Yatch.jpg", link: "/boats?type=yatch" },
  { label: "Bateau de sport et de loisirs", img: "/images/loisir.jpg", link: "/boats?type=sport-loisir" },
];

const Category = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Banner />

      <main className="flex-grow py-14 px-6">
        <div className="text-center mb-12">
          <h5 className="text-xl md:text-xl text-black mb-2">
            Catégories des Bateaux
          </h5>
          <p className="text-black font-bold text-sm md:text-base">
            Trouvez le bateau qui correspond à votre besoin
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col space-y-4">
              <Link to={cat.link}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-[20rem] object-cover rounded-[10px] hover:opacity-90 transition"
                />
              </Link>
              <div className="text-center">
                <Link to={cat.link}>
                  <span className="text-sm font-bold text-gray-800 hover:underline">
                    {cat.label}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
