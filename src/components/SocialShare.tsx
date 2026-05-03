import React from "react";
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Send, 
  Youtube, 
  Phone,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  url?: string;
  title?: string;
  phone?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  url = window.location.href, 
  title = "Check this out on HousePlanFiles!", 
  phone 
}) => {
  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={18} fill="currentColor" />,
      color: "bg-[#3b5998]",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={18} fill="currentColor" />,
      color: "bg-[#25D366]",
      link: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "X",
      icon: <span className="font-bold text-sm">X</span>,
      color: "bg-black",
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} fill="currentColor" />,
      color: "bg-[#0077b5]",
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Pinterest",
      icon: <span className="font-bold text-sm">P</span>,
      color: "bg-[#bd081c]",
      link: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    },
    {
      name: "Telegram",
      icon: <Send size={18} fill="currentColor" />,
      color: "bg-[#0088cc]",
      link: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Threads",
      icon: <span className="font-bold text-sm">@</span>,
      color: "bg-black",
      link: `https://threads.net/intent/post?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "YouTube",
      icon: <Youtube size={18} fill="currentColor" />,
      color: "bg-[#ff0000]",
      link: `https://youtube.com`,
    },
    {
      name: "Call",
      icon: <Phone size={18} fill="currentColor" />,
      color: "bg-[#34495e]",
      link: phone ? `tel:${phone}` : "tel:+910000000000",
    }
  ];

  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-gray-900 mb-3">Share this plan</p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item.color} text-white w-9 h-9 rounded-md flex items-center justify-center hover:opacity-90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}
            title={item.name}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
