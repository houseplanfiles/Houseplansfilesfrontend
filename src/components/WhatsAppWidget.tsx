import { useEffect } from "react";

const WhatsAppWidget = () => {
  useEffect(() => {
    // Check if script is already added
    if (document.getElementById("kraya-ai-widget")) return;

    window.chatWidgetConfig = {
      whatsappNumber: "919755248864",
      welcomeMessage: "Hey 👋,\nHow can we help you?",
      buttonText: "Chat on Whatsapp",
      profileName: "Kraya AI",
      profileImageUrl: "https://api.kraya-ai.com/images/kraya-logo.png",
      appUrl: "https://api.kraya-ai.com"
    };

    const script = document.createElement("script");
    script.src = "https://api.kraya-ai.com/widget/chat.js?v=1771404832599";
    script.async = true;
    script.id = "kraya-ai-widget";

    document.head.appendChild(script);

    return () => {
      // Optional: Clean up script if component unmounts
      const existingScript = document.getElementById("kraya-ai-widget");
      if (existingScript) existingScript.remove();
      // Also clean up any widget elements if they are added to the DOM
      const widget = document.querySelector('.kraya-chatbot-widget');
      if (widget) widget.remove();
    };
  }, []);

  return null;
};

export default WhatsAppWidget;

declare global {
  interface Window {
    chatWidgetConfig?: {
      whatsappNumber: string;
      welcomeMessage: string;
      buttonText: string;
      profileName: string;
      profileImageUrl: string;
      appUrl: string;
    };
  }
}
