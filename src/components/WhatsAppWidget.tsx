import { useEffect } from "react";

const STORAGE_KEY = "aisensy_closed_at";
const DELAY = 3 * 60 * 1000; // 3 minutes

const WhatsAppWidget = () => {
  useEffect(() => {
    const closedAt = localStorage.getItem(STORAGE_KEY);

    // ❌ Agar 3 min complete nahi hua → kuch bhi mat karo
    if (closedAt && Date.now() - Number(closedAt) < DELAY) {
      return;
    }

    // script already added
    if (document.getElementById("aisensy-wa-widget")) return;

    const script = document.createElement("script");
    script.src = "https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js";
    script.async = true;
    script.id = "aisensy-wa-widget";
    script.setAttribute("widget-id", "aaa7tm");

    document.body.appendChild(script);

    // open only after script load
    const openTimer = setTimeout(() => {
      window.AiSensy?.open();
    }, 2000);

    // 👀 Detect close click
    const observer = setInterval(() => {
      const closeBtn = document.querySelector(
        '[aria-label="Close"], .close, .aisensy-close'
      );

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        });

        clearInterval(observer);
      }
    }, 1000);

    return () => {
      clearTimeout(openTimer);
      clearInterval(observer);
    };
  }, []);

  return null;
};

export default WhatsAppWidget;

declare global {
  interface Window {
    AiSensy?: {
      open: () => void;
    };
  }
}
