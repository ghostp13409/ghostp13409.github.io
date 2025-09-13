import "./App.css";
import Portfolio from "./pages/Portfolio";
import { useState, useEffect } from "react";
import { Monitor, X } from "lucide-react";

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 1024; // lg breakpoint - show on tablets and phones
      setIsMobile(mobile);

      // Always show warning on mobile/tablet regardless of dismissal
      if (mobile) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };

    // Initial check
    checkDevice();

    // Add event listener
    window.addEventListener("resize", checkDevice);

    // Cleanup
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const dismissWarning = () => {
    setShowMobileWarning(false);
    localStorage.setItem("mobile-warning-dismissed", "true");
  };

  return (
    <>
      {/* Mobile Warning Banner - Scrolling Text */}
      {showMobileWarning && isMobile && (
        <div
          className="fixed top-0 left-0 right-0 bg-black text-white py-1.5 overflow-hidden"
          style={{ zIndex: 999999, position: "fixed" }}
        >
          <div className="whitespace-nowrap animate-marquee text-xs font-medium">
            <span className="inline-block px-4">
              🖥️ Best experience on desktop! This portfolio is optimized for
              larger screens. View on PC for better navigation.
            </span>
          </div>
        </div>
      )}

      <div className="App">
        {/* Main Content with proper spacing to avoid header overlap */}
        <div className={`${showMobileWarning && isMobile ? "pt-6" : ""}`}>
          <Portfolio />
        </div>
      </div>

      {/* Add CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </>
  );
}

export default App;
