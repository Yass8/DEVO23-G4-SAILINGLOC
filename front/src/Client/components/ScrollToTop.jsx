import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function ScrollToTop() {
  const [scroll, setScroll] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    setScroll(scrolled);
    setVisible(scrollTop > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 cursor-pointer z-50 transition-opacity ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={scrollToTop}
    >
      <div className="relative w-14 h-14">
        <svg
          className="absolute top-0 left-0 w-14 h-14 transform rotate-[-90deg] text-[#b47b56]"
          viewBox="0 0 100 100"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="307"
            strokeDashoffset={307 - (307 * scroll) / 100}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <FontAwesomeIcon icon={faArrowUp} className="text-[#b47b56] text-xl" />
        </div>
      </div>
    </div>
  );
}
