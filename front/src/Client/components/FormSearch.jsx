

function FormSearch(){

    return (
        <>
            {/* Research Form F5F1EB  AD7C59 4B6A88 */}
        <h1 className="mb-3 text-center text-2xl mt-4">Louer maintenant</h1>
        <h2 className="mb-3 text-center">Réserver une location de bateau</h2>

        <div className="container w-full sm:w-10/12 lg:w-8/12 mx-auto p-4 rounded-[6px] bg-[#4B6A88] shadow">
            <form className="lg:flex flex-col justify-around lg:flex-row lg:flex-wrap ">

                {/* Input : Lien de départ */}
                <div className="relative z-0 w-full lg:w-2/12">
                <input
                    type="text"
                    id="port"
                    className="block py-2.5 px-0 w-full text-sm text-[#F5F1EB] bg-transparent border-0 
                            border-b-2 lg:border-b-0 lg:border-r-2 border-gray-300 appearance-none 
                            focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                />
                <label
                    htmlFor="port"
                    className="absolute text-sm text-[#F5F1EB] duration-300 transform -translate-y-6 scale-75 
                            top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#AD7C59] 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                            peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Lien de départ
                </label>
                </div>

                {/* Input : Date de départ */}
                <div className="relative z-0 w-full lg:w-2/12">
                <input
                    type="text"
                    id="departure-date"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => e.target.value === '' && (e.target.type = 'text')}
                    className="block py-2.5 px-0 w-full text-sm text-[#F5F1EB] bg-transparent border-0 
                            border-b-2 lg:border-b-0 lg:border-r-2 border-gray-300 appearance-none 
                            focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                />
                <label
                    htmlFor="departure-date"
                    className="absolute text-sm text-[#F5F1EB] duration-300 transform -translate-y-6 scale-75 
                            top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#AD7C59] 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                            peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Date de départ
                </label>
                </div>

                {/* Input : Date de fin */}
                <div className="relative z-0 w-full lg:w-2/12">
                <input
                    type="text"
                    id="end-date"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => e.target.value === '' && (e.target.type = 'text')}
                    className="block py-2.5 px-0 w-full text-sm text-[#F5F1EB] bg-transparent border-0 
                            border-b-2 lg:border-b-0 lg:border-r-2 border-gray-300 appearance-none 
                            focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                />
                <label
                    htmlFor="end-date"
                    className="absolute text-sm text-[#F5F1EB] duration-300 transform -translate-y-6 scale-75 
                            top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#AD7C59] 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                            peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Date de fin
                </label>
                </div>

                {/* Select : Type de bateau */}
                <div className="relative z-0 w-full lg:w-2/12">
                <select
                    id="boat-type"
                    defaultValue=""
                    className="block w-full py-2.5 px-0 text-sm text-[#F5F1EB] bg-transparent border-0 
                            border-b-2 lg:border-b-0 lg:border-r-2 border-gray-300 appearance-none 
                            focus:outline-none focus:ring-0 peer"
                >
                    <option value="" disabled hidden></option>
                    <option>Voilier</option>
                    <option>Catamaran</option>
                    <option>Yacht</option>
                </select>
                <label
                    htmlFor="boat-type"
                    className="absolute text-sm text-[#F5F1EB] duration-300 transform -translate-y-6 scale-75 
                            top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#AD7C59] 
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                            peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Type de bateau
                </label>
                </div>

                {/* Submit Button */}
                <div className="lg:w-2/12 flex justify-center">
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#F5F1EB] bg-[#AD7C59] focus:outline-none"
                >
                    Rechercher
                </button>
                </div>

            </form>
            </div>

        </>
    );

}

export default FormSearch;
import React from 'react';