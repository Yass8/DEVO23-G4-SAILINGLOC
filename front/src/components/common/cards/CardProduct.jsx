import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerHorizontal, faUsers } from '@fortawesome/free-solid-svg-icons';

const CardProduct = ({
  name,
  image,
  length,
  capacity,
  price,
  onClick,
  showButton = true,
  buttonLabel = "Voir ce bateau"
}) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <a href="#" onClick={onClick}>
      <img src={image} alt={name} className="rounded-t-lg w-full h-48 object-cover" />
    </a>
    <div className="p-5">
      <div className="flex justify-between items-center">
        <a href="#" onClick={onClick}><h4 className="font-bold">{name}</h4></a>
        <p className="font-bold">
          <span className="text-mocha text-2xl font-bold">{price}</span> /jour
        </p>
      </div>
      <p className="mt-2">
        <FontAwesomeIcon icon={faRulerHorizontal} className='text-mocha' /> <span className="ml-1">{length}</span>
        <FontAwesomeIcon icon={faUsers} className='text-mocha ml-4' /> <span className="ml-1">{capacity} passagers</span>
      </p>
      {showButton && (
        <div className="text-center">
          <button className="custom-button mt-4" onClick={onClick}>{buttonLabel}</button>
        </div>
      )}
    </div>
  </div>
);

export default CardProduct;