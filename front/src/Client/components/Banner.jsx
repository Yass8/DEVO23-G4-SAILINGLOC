import banner from "/images/hero.jpeg";
function Banner(){
    return(
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
  <img
    src={banner}
    alt="Bannière"
    className="w-full h-full object-cover"
  />
  <div className="absolute top-1/2 left-4 sm:left-10 -translate-y-1/2 text-black space-y-2">
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">
      Trouvez le bateau parfait<br />
      pour votre prochaine<br />
      aventure
    </h2>
    <button className="mt-1 bg-[#c58e6a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium">
      Commencez votre aventure
    </button>
  </div>
</div>

    )
}
export default Banner;