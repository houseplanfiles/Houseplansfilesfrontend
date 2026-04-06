import { useEffect } from "react";

const WhatsAppWidget = () => {
  useEffect(() => {
    // Check if script is already added
    if (document.getElementById("kraya-ai-widget")) return;

    window.chatWidgetConfig = {
      whatsappNumber: "919755248864",
      welcomeMessage: "Hi\nHow can i help you in your dream home designing ",
      buttonText: "Chat on Whatsapp",
      profileName: "House plan files ",
      profileImageUrl:
        "https://prod-kraya.s3.ap-south-1.amazonaws.com/9dc27643-8349-4b64-a878-108319da227a/42aewB5TEIVNkDRTRr2nPfo6Y81xj399pwoRWgRs.jpg",
      appUrl: "https://api.kraya-ai.com",
    };

    const script = document.createElement("script");
    script.src = "https://api.kraya-ai.com/widget/chat.js?v=1771604369020";
    script.async = true;
    script.id = "kraya-ai-widget";

    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      const existingScript = document.getElementById("kraya-ai-widget");
      if (existingScript) existingScript.remove();
      // Also clean up any widget elements added to the DOM
      const widget = document.querySelector(".kraya-chatbot-widget");
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

