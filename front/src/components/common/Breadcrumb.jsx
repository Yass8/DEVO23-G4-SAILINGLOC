import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Breadcrumb({ items = [] }) {

  return (
    <nav aria-label="breadcrumb" className="text-sm font-medium text-mocha">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FontAwesomeIcon icon={faAngleRight} className="text-mocha mx-2 opacity-70" />
            )}
            {index < items.length - 1 ? (
              <a
                href={item.href}
                className="flex items-center gap-1 text-sm hover:text-[#8B5A3E] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="flex items-center gap-1 text-sm font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
