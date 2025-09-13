import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRulerHorizontal, faUsers } from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const CardProduct = ({
  name,
  image,
  length,
  capacity,
  price,
  slug,
  showButton = true,
  buttonLabel = "Voir ce bateau",
}) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <a href={`/boat/${slug}`}>
      <img
        src={`${API_BASE}${image}`}
        alt={name}
        className="rounded-t-lg w-full h-48 object-cover"
      />
    </a>
    <div className="p-5">
      <div className="flex justify-between items-center">
        <a href={`/boat/${slug}`}>
          <h4 className="font-bold">{name}</h4>
        </a>
        <p className="font-bold">
          <span className="text-mocha text-2xl font-bold">{price}</span> /jour
        </p>
      </div>
      <p className="mt-2">
        <FontAwesomeIcon icon={faRulerHorizontal} className="text-mocha" />{" "}
        <span className="ml-1">{length}</span>
        <FontAwesomeIcon icon={faUsers} className="text-mocha ml-4" />{" "}
        <span className="ml-1">{capacity} passagers</span>
      </p>
      {showButton && (
        <div className="text-center">
          <a href={`/boat/${slug}`}>
            <button className="custom-button mt-4">{buttonLabel}</button>
          </a>
        </div>
      )}
    </div>
  </div>
);

export default CardProduct;
