import React from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import { Button } from "./ui/button";
import { Repeat } from "lucide-react"; // Ek icon import karein

const FloatingCurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);

  const toggleCurrency = () => {
    setCurrency(currency === "INR" ? "USD" : "INR");
  };

  // AI Sensy Widget Detection
  React.useEffect(() => {
    const checkWidget = () => {
      const chatWindow = document.querySelector(
        '[aria-label="Close"], .close, .aisensy-close, .wa-widget-content-open'
      );
      setIsWidgetOpen(!!chatWindow);
    };
    const interval = setInterval(checkWidget, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="transition-all duration-500 ease-in-out"
      style={{
        position: "fixed",
        bottom: isWidgetOpen ? "610px" : "230px",
        right: "20px",
        zIndex: 1000, // Yeh button ko dusre content ke upar rakhega
      }}
    >
      <Button
        variant="outline"
        onClick={toggleCurrency}
        className="bg-white shadow-lg rounded-full p-3 h-auto text-gray-800 border-orange-200 hover:bg-orange-50"
        aria-label={`Switch to ${currency === "INR" ? "USD" : "INR"}`}
      >
        <Repeat className="h-5 w-5 mr-2 text-orange-500" />
        {currency === "INR" ? "INR" : "USD"}
      </Button>
    </div>
  );
};

export default FloatingCurrencySwitcher;
