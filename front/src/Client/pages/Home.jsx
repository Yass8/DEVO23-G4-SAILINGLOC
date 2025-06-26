import CarouselCategories from "../components/CarouselCategories";
import CarouselProducts from "../components/CarouselProducts";
import FormSearch from "../components/FormSearch";

function Home() {
  return (
    <>
      <FormSearch />

        {/* About Section */}
        <div className="container lg:flex lg:justify-center w-full sm:w-10/12 lg:w-8/12 mx-auto mt-5 lg:mb-0 pt-5">
            <div className="lg:w-6/12 lg:pr-4 text-center lg:text-left">
                <h2>À propos de SailingLoc</h2>
                <h3>Naviguez librement, entre passionnés</h3>
                <p className="text-justify mt-2">
                    Chez SailingLoc, nous mettons en relation les amoureux de la mer pour faciliter la location de voiliers et bateaux à moteur entre particuliers. Que vous soyez marin expérimenté ou aventurier en quête de découverte, notre plateforme vous offre une expérience simple, sécurisée et conviviale.   Découvrez une nouvelle façon de naviguer, avec une communauté qui partage la même passion.
                </p>
                <button className="custom-button mb-3 lg:mb-0">
                    En savoir plus
                </button>
            </div>
            <div className="bg-[url('/images/sailBoat.jpeg')] lg:w-6/12 bg-cover rounded-sm p-4 shadow-sm lg:h-auto h-80">

            </div>
        </div>

        <CarouselCategories  />

        <CarouselProducts />

        
    </>
  );
}

export default Home;
