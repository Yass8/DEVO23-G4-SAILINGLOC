import FormSearch from "../components/FormSearch";


function Home() {
  return (
    <>
        <FormSearch />

        {/* About Section */}
        <div className="container lg:flex lg:justify-center w-full sm:w-10/12 lg:w-8/12 mx-auto mt-5 pt-5">
            <div className="lg:w-6/12 lg:pr-4">
                <h1>À propos de SailingLoc</h1>
                <h2>Naviguez librement, entre passionnés</h2>
                <p className="text-justify mt-2">
                    Chez SailingLoc, nous mettons en relation les amoureux de la mer pour faciliter la location de voiliers et bateaux à moteur entre particuliers. Que vous soyez marin expérimenté ou aventurier en quête de découverte, notre plateforme vous offre une expérience simple, sécurisée et conviviale.   Découvrez une nouvelle façon de naviguer, avec une communauté qui partage la même passion.
                </p>
                <button className="mt-4 px-6 py-2 bg-[#AD7C59] text-[#F5F1EB] rounded-lg shadow transition duration-300">
                    En savoir plus
                </button>
            </div>
            <div className="bg-[url('/images/sailBoat.jpeg')] lg:w-6/12 bg-cover rounded-sm p-4 shadow-sm lg:h-auto h-80">

            </div>
        </div>

        
    </>
  );
}

export default Home;