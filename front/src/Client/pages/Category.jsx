import Header from "../components/Header";
import Banner from "../components/Banner";

const categories = [
  { label: "Voilier", img: "/images/bavaria46cruiser.jpg" },
  { label: "Bateaux à moteurs", img: "/images/moteurBoat.jpeg" },
  { label: "Bateau fluvial", img: "/images/fluvial.jpg" },
  { label: "Catamarans", img: "/images/catamaran.jpg" },
  { label: "Yatch", img: "/images/Yatch.jpg" },
  { label: "Bateau de sport et de loisirs", img: "/images/loisir.jpg" },
];

const Category = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <Header />
      <Banner />

      <main className="flex-grow py-14 px-6">
        <div className="text-center mb-12">
          <h5 className="text-xl md:text-xl  text-black mb-2">
            Catégories des Bateaux
          </h5>
          <p className="text-black font-bold text-sm md:text-base">
            Trouvez le bateau qui correpond a votre besoin
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
          <div key={index} className="flex flex-col space-y-4">
            <div className="w-full"> 
              <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-[20rem] object-cover"
                />
              </div> 
             <div> <span className="text-sm font-medium text-center text-gray-800">
                {cat.label}
              </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
