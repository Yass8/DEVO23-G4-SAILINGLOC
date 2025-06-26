

function CarouselProducts() {
  return (
    

    <div className="w-full max-w-6xl mx-auto py-10 px-4">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <a href="#">
            <img className="rounded-t-lg" src="/images/bavaria46cruiser.jpg" alt="bavaria46cruiser" />
        </a>
        <div className="p-5">
            <div className="flex justify-between items-center">
                <a href="#">
                    <h4 className="font-bold">Bavaria cruiser 46</h4>
                </a>
                <p className="font-bold"><span className="font-bold text-[#AD7C59] text-2xl">616 €</span>\jour</p>
            
            </div>
            <div>
                <p>
                    {/* <FontAwesomeIcon icon="fa-solid fa-ruler-horizontal" />*/} <span className="ml-2">14.27 m</span>
                    {/*<FontAwesomeIcon icon="fa-solid fa-users" /> */} <span className="ml-2">16</span>
                </p>
            </div>
        </div>
    </div>
    </div>

  );
}

export default CarouselProducts;