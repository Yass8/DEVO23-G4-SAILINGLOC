import { useNavigate } from "react-router-dom";
import banner from "/images/hero.jpeg";

function Banner({activeBtn = false}) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[180px] sm:h-[220px] md:h-[300px] lg:h-[350px]">
      <img src={banner} alt="Bannière" className="w-full h-full object-cover" />
      <div
        className="
          absolute
          top-1/2
          left-4 sm:left-8 md:left-12 lg:left-20
          -translate-y-1/2
          w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]
          text-black
          space-y-3
          "
      >
      {!activeBtn && (
        <>
        <h1
          className="
            text-base sm:text-lg md:text-2xl lg:text-4xl
            font-bold
            leading-snug
          "
        >
          Trouvez le bateau
          <br /> parfait pour votre <br /> prochaine <br /> aventure
        </h1>
        
          <button
            onClick={() => navigate("/boats")}
            className="
            bg-[#c58e6a]
            hover:bg-[#b37954]
            transition-colors
            text-white
            px-4 py-2
            rounded-md
            text-sm sm:text-base
            font-medium
          "
          >
            Commencez votre aventure
          </button>
          </>
        )}
      </div>
    </div>
  );
}
export default Banner;
