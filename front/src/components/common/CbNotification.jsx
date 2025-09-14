
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const CbNotification = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    Cookies.set("cookieConsent", "all", { expires: 365 });
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    Cookies.set("cookieConsent", "essential", { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <strong>🍪 Nous utilisons des cookies</strong>
          <p>
            Certains sont essentiels, d’autres nous aident à améliorer ton expérience.  
            <a href="/politique-cookies" className="underline ml-1" target="_blank" rel="noopener noreferrer">
              En savoir plus
            </a>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-mocha hover:bg-mocha/90 rounded text-white text-sm"
          >
            Tout accepter
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="px-4 py-2 border border-mocha hover:bg-sand rounded text-sm"
          >
            Refuser les non-essentiels
          </button>
        </div>
      </div>
    </div>
  );
};

export default CbNotification;