import FormSearch from "../components/FormSearch";
import CarouselCategories from "../components/CarouselCategories";
import CarouselProducts from "../components/CarouselProducts";
import CarouselTestimonial from "../components/CarouselTestimonial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <>
      
      <FormSearch />

      {/* About Section */}
      <div className="container lg:flex lg:justify-center w-full sm:w-10/12 lg:w-8/12 mx-auto mt-5 pt-5">
        <div className="lg:w-6/12 lg:pr-4 text-center lg:text-left">
          <h2>À propos de SailingLoc</h2>
          <h3>Naviguez librement, entre passionnés</h3>
          <p className="text-justify mt-2 px-2 lg:px-0">
            Chez SailingLoc, nous mettons en relation les amoureux de la mer
            pour faciliter la location de voiliers et bateaux à moteur entre
            particuliers. Que vous soyez marin expérimenté ou aventurier en
            quête de découverte, notre plateforme vous offre une expérience
            simple, sécurisée et conviviale. Découvrez une nouvelle façon de
            naviguer, avec une communauté qui partage la même passion.
          </p>
          <button className="mt-4 px-6 py-2 bg-[#AD7C59] text-[#F5F1EB] rounded-lg shadow transition duration-300 mb-3 lg:mb-0">
            En savoir plus
          </button>
        </div>
        <div className="bg-[url('/images/sailBoat.jpeg')] lg:w-6/12 bg-cover rounded-sm p-4 shadow-sm lg:h-auto h-80"></div>
      </div>

      {/* Carousel Categories */}
      <CarouselCategories />
      {/* Carousel Products */}
      <CarouselProducts />

      {/* Section aide */}
      <section className="bg-[#C1D0C4] py-5">
        <div className="text-center">
          <h2>Louer votre bateau en 3 étapes </h2>
          <h3>Simple, rapide et sécurisé</h3>
        </div>
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center mt-10">
          <div className="text-center mb-8 lg:mb-0 lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-[#AD7C59] border-2 border-dashed rounded-full p-3 px-5 font-bold">
              1
            </span>
            <h4 className="font-bold mt-5">Choisir votre bateau</h4>
            <p>
              Parcourez notre sélection et trouvez le bateau idéal selon vos
              besoins : voilier, catamaran, bateau à moteur…
            </p>
          </div>

          <div className="text-center mb-8 lg:mb-0 lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-[#AD7C59] border-2 border-dashed rounded-full p-3 px-5 font-bold">
              2
            </span>
            <h4 className="font-bold mt-5">Réservez en ligne</h4>
            <p>
              Sélectionnez vos dates, ajoutez les options souhaitées et
              effectuez votre paiement en toute sécurité.
            </p>
          </div>

          <div className="text-center lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-[#AD7C59] border-2 border-dashed rounded-full p-3 px-5 font-bold">
              3
            </span>
            <h4 className="font-bold mt-5">Embarquer et profiter</h4>
            <p>
              Rendez-vous au port, récupérez votre bateau et vivez une
              expérience inoubliable sur l’eau !
            </p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-center"><FontAwesomeIcon icon={faCircleInfo} className='text-[#AD7C59] ml-4' /> Si vous n’avez jamais loué un bateau auparavant, nous vous guiderons à chaque étapes du processus.</p>
        </div>
      </section>

      {/* Carousel Testimonials */}
      <CarouselTestimonial />

      {/* Section proprietaire */}
      <section className="py-10">
        <div className="container mx-auto text-center">
          <h2>Devenez propriétaire sur SailingLoc</h2>
          <h3>Rentabilisez votre bateau en toute simplicité</h3>
          <p className="mt-5 w-full sm:w-10/12 lg:w-8/12 mx-auto">
            Mettez votre bateau en location et rejoignez une communauté de passionnés. SailingLoc vous permet de gérer vos disponibilités, sécuriser vos transactions et maximiser vos revenus en toute sérénité.
          </p>
          <button className="custom-button">
            Enregistrer votre bateau
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
