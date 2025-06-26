import Header from "../components/Header";
import Banner from "../components/Banner";

const categories = [
  { label: "Voilier", img: "/voilier.png" },
  { label: "Bateaux à moteurs", img: "/moteur.png" },
  { label: "Bateau fluvial", img: "/fluvial.png" },
  { label: "Catamarans", img: "/catamaran.png" },
  { label: "Yacht", img: "/yacht.png" },
  { label: "Bateau de sport et de loisirs", img: "/sport.png" },
];

const Category = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <Header />
      <Banner />

      <main className="flex-grow py-14 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Trouvez le bateau parfait pour votre prochaine aventure
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Explorez nos catégories de bateaux pour trouver celui qui vous correspond.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition transform hover:-translate-y-1"
            >
              <div className="w-full aspect-square flex items-center justify-center mb-3">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="max-h-20 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-center text-gray-800">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
