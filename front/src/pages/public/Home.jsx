import FormSearch from "../../components/common/FormSearch";
import CarouselCategories from "../../components/common/CarouselCategories";
import CarouselProducts from "../../components/common/CarouselProducts";
import CarouselTestimonial from "../../components/common/CarouselTestimonial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Preloader from "../../components/common/Preloader";
import ScrollToTop from "../../components/common/ScrollToTop";
import Banner from "../../components/common/Banner";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

function Home() {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Header/>

      <Banner/>
      <FormSearch />

      {/* About Section */}
      <div className="container lg:flex lg:justify-center w-full sm:w-10/12 lg:w-8/12 mx-auto mt-5 pt-5">
        <div className="lg:w-6/12 lg:pr-4 text-center lg:text-left">
          <h2>A propos de SailingLoc</h2>
          <h3>Naviguez librement, entre passionnes</h3>
          <p className="text-justify mt-2 px-2 lg:px-0">
            Chez SailingLoc, nous mettons en relation les amoureux de la mer
            pour faciliter la location de voiliers et bateaux a moteur entre
            particuliers. Que vous soyez marin experimente ou aventurier en
            quete de decouverte, notre plateforme vous offre une experience
            simple, securisee et conviviale. Decouvrez une nouvelle facon de
            naviguer, avec une communaute qui partage la meme passion.
          </p>
          <button className="mt-4 px-6 py-2 bg-mocha text-sand rounded-lg shadow transition duration-300 mb-3 lg:mb-0">
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
      <section className="bg-sage-green py-5">
        <div className="text-center">
          <h2>Louer votre bateau en 3 etapes </h2>
          <h3>Simple, rapide et securise</h3>
        </div>
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center mt-10">
          <div className="text-center mb-8 lg:mb-0 lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-mocha border-2 border-dashed rounded-full p-3 px-5 font-bold">
              1
            </span>
            <h4 className="font-bold mt-5">Choisir votre bateau</h4>
            <p>
              Parcourez notre selection et trouvez le bateau ideal selon vos
              besoins : voilier, catamaran, bateau a moteur…
            </p>
          </div>

          <div className="text-center mb-8 lg:mb-0 lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-mocha border-2 border-dashed rounded-full p-3 px-5 font-bold">
              2
            </span>
            <h4 className="font-bold mt-5">Reservez en ligne</h4>
            <p>
              Selectionnez vos dates, ajoutez les options souhaitees et
              effectuez votre paiement en toute securite.
            </p>
          </div>

          <div className="text-center lg:mx-6 lg:w-3/12 sm:w-6/12 w-10/12">
            <span className="text-2xl text-mocha border-2 border-dashed rounded-full p-3 px-5 font-bold">
              3
            </span>
            <h4 className="font-bold mt-5">Embarquer et profiter</h4>
            <p>
              Rendez-vous au port, recuperez votre bateau et vivez une
              experience inoubliable sur l'eau !
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-center">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="text-mocha ml-4"
            />{" "}
            Si vous navez jamais loue un bateau auparavant, nous vous guiderons
            a chaque etape du processus.
          </p>
        </div>
      </section>

      {/* Carousel Testimonials */}
      <CarouselTestimonial />

      {/* Section proprietaire */}
      <section className="py-10">
        <div className="container mx-auto text-center">
          <h2>Devenez proprietaire sur SailingLoc</h2>
          <h3>Rentabilisez votre bateau en toute simplicite</h3>
          <p className="mt-5 w-full sm:w-10/12 lg:w-8/12 mx-auto">
            Mettez votre bateau en location et rejoignez une communaute de
            passionnes. SailingLoc vous permet de gerer vos disponibilites,
            securiser vos transactions et maximiser vos revenus en toute
            serenite.
          </p>
          <button className="custom-button">Enregistrer votre bateau</button>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
