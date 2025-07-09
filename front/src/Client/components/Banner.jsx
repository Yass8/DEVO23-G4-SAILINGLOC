import banner from "/images/hero.jpeg";
function Banner(){
    return(
        <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[350px]">
  <img
    src={banner}
    alt="Bannière"
    className="w-full h-full object-cover"
  />
  <div className="absolute container w-2/12 top-1/2 left-4 sm:left-10 -translate-y-1/2 text-black space-y-2">
    <h1 className="text-lg sm:text-xl md:text-4xl font-bold leading-snug">
      Trouvez le bateau parfait
      pour votre prochaine
      aventure
    </h1>
    <button className="mt-1 bg-[#c58e6a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium">
      Commencez votre aventure
    </button>
  </div>
</div>

    )
}
export default Banner;