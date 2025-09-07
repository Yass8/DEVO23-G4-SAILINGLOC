import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-mocha" />
    </div>
  );
}