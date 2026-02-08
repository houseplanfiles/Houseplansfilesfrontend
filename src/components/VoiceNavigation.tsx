import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/features/users/userSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Your Gemini API Key
const GENAI_KEY = "AIzaSyBlMnhsfihW-I_FWJhr9GwjUoqHeEJRzeg";
const genAI = new GoogleGenerativeAI(GENAI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const commandMap: Record<string, string> = {
    "home": "/", "ghar": "/", "main": "/", "start": "/",
    "products": "/products", "house plan": "/products", "designs": "/products", "saman": "/products", "shop": "/products", "all plans": "/products",
    "floor plans": "/floor-plans", "floor plan": "/floor-plans", "naksha": "/floor-plans", "nasha": "/floor-plans", "map": "/floor-plans",
    "3d plans": "/3d-plans", "3d plan": "/3d-plans", "3d design": "/3d-plans", "three d": "/3d-plans", "3 d": "/3d-plans",
    "interior designs": "/interior-designs", "interior": "/interior-designs", "interior design": "/interior-designs", "sajawat": "/interior-designs", "decoration": "/interior-designs", "furniture": "/interior-designs",
    "download": "/download", "files": "/download", "document": "/download", "kaam ki file": "/download",
    "services": "/services", "sewa": "/services", "kam": "/services", "service": "/services",
    "city partner": "/city-partners", "partner": "/city-partners", "city": "/city-partners",
    "career": "/careers", "job": "/careers", "naukri": "/careers", "kaam": "/careers",
    "package": "/packages", "packages": "/packages", "offer": "/packages", "special": "/packages", "plans": "/packages",
    "gallery": "/gallery", "photo": "/gallery", "tasveer": "/gallery", "images": "/gallery", "photu": "/gallery",
    "marketplace": "/marketplace", "bazaar": "/marketplace", "market": "/marketplace",
    "contact": "/contact", "support": "/contact", "help": "/contact", "madad": "/contact", "sarkaar": "/contact",
    "cart": "/cart", "tokri": "/cart", "bag": "/cart", "shopping bag": "/cart",
    "about": "/about", "hamaare baare mein": "/about", "info": "/about",
    "login": "/login", "sign in": "/login", "entry": "/login", "register": "/register", "sign up": "/register", "registration": "/register", "naya account": "/register",
    "dashboard": "/dashboard", "my account": "/dashboard", "profile": "/dashboard/account-details", "setting": "/dashboard/account-details", "my orders": "/dashboard/orders", "orders": "/dashboard/orders", "my booking": "/dashboard/orders", "downloads": "/dashboard/downloads", "download files": "/dashboard/downloads", "address": "/dashboard/addresses", "addresses": "/dashboard/addresses",
    "seller": "/seller", "seller dashboard": "/seller", "seller product": "/seller/products", "my products": "/seller/products", "add product": "/seller/products/add", "naya product": "/seller/products/add",
    "professional": "/professional", "pro dashboard": "/professional", "my plan": "/professional/my-products",
    "admin": "/admin", "admin dashboard": "/admin", "admin panel": "/admin", "sarkari": "/admin",
    "admin products": "/admin/products", "all users": "/admin/users", "add user": "/admin/users/add", "admin orders": "/admin/orders", "customers": "/admin/customers", "reports": "/admin/reports", "admin settings": "/admin/settings",
    "admin gallery": "/admin/gallery", "admin media": "/admin/media", "seller enquiries": "/admin/seller-enquiries", "admin packages": "/admin/packages", "standard requests": "/admin/standard-requests", "premium requests": "/admin/premium-requests", "customization requests": "/admin/customization-requests", "admin blogs": "/admin/blogs", "admin videos": "/admin/addvideos", "seller products": "/admin/seller-products", "manage seller plans": "/admin/managesellerplans",
};

const sortedCommands = Object.keys(commandMap).sort((a, b) => b.length - a.length);

const VoiceNavigation = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [pendingFlow, setPendingFlow] = useState<string | null>(null);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo } = useSelector((state: RootState) => state.user);
    const isFirstMount = useRef(true);

    // AI Sensy Widget Detection
    useEffect(() => {
        const checkWidget = () => {
            const chatWindow = document.querySelector('[aria-label="Close"], .close, .aisensy-close, .wa-widget-content-open');
            setIsWidgetOpen(!!chatWindow);
        };
        const interval = setInterval(checkWidget, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isFirstMount.current) { isFirstMount.current = false; return; }
        if (pendingFlow === "register" && location.pathname === "/register") {
            setTimeout(() => { executeRegisterFlow(); setPendingFlow(null); }, 800);
        }
    }, [location.pathname, pendingFlow]);

    useEffect(() => {
        if (!SpeechRecognitionAPI) return;
        try {
            const recognitionInstance = new SpeechRecognitionAPI();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = "en-IN";

            recognitionInstance.onresult = (event: any) => {
                const transcript = event.results?.[0]?.[0]?.transcript?.toLowerCase();
                if (transcript) handleVoiceInput(transcript);
            };

            recognitionInstance.onerror = () => { setIsListening(false); setIsProcessing(false); };
            recognitionInstance.onend = () => { setIsListening(false); setIsProcessing(false); };
            setRecognition(recognitionInstance);
        } catch (err) { console.error(err); }
    }, []);

    const setInputValue = (id: string, value: string) => {
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            nativeInputValueSetter?.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            return true;
        }
        return false;
    };

    const findAndClickElement = (text: string) => {
        const elements = Array.from(document.querySelectorAll('button, a, [role="button"], span, label, input[type="radio"] + label, footer'));
        const target = elements.find(el => (el.textContent || "").toLowerCase().includes(text.toLowerCase()));
        if (target) {
            (target as HTMLElement).click();
            return true;
        }
        return false;
    };

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-IN";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const executeRegisterFlow = () => {
        toast.info("AI: Filling Registration Form...");
        speak("I am filling the registration form for you.");
        setInputValue("name", "John Doe");
        setInputValue("email", `voice_ai_${Math.floor(Math.random() * 1000)}@houseplan.com`);
        setInputValue("phone", "9876543210");
        setInputValue("password", "Pass@1234");
        setInputValue("city", "Mumbai");
        setInputValue("address", "123, Auto Fill Lane");
        setTimeout(() => {
            const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (btn) btn.click();
            toast.success("AI: Registration Complete!");
            speak("Registration complete. Welcome on board!");
        }, 1200);
    };

    const handleVoiceInput = async (transcript: string) => {
        setIsProcessing(true);
        setIsThinking(true);
        console.log("Input:", transcript);

        try {
            // Ask Gemini to parse the command
            const prompt = `
            You are a website navigation assistant. Parse the following voice command from a user.
            User said: "${transcript}"
            
            Return ONLY a JSON object in this format:
            {
                "intent": "NAVIGATE" | "ACTION" | "FILL" | "FLOW" | "SEARCH",
                "target": "route_path" | "element_name" | "field_name" | "search_term",
                "value": "data_to_fill_if_any",
                "confidence": 0-1
            }

            Rules:
            1. If it's a register request like "register a user" or "ek user register kar do", use intent "FLOW" and target "register".
            2. If it's navigation, target should be the route path.
            3. Common paths: /products, /register, /login, /dashboard, /cart, /admin, /footer.
            4. If it's "scroll to footer" or just "footer", intent "ACTION" and target "footer".
            5. If the user is asking for specific plans by size, dimensions, or name (e.g., "25x50 plans", "modern home designs", "40 by 50 readymade house plan"), use intent "SEARCH" and target should be the search term (e.g., "40x50", "25x50").
            6. "Readymade house plans" refers to the /products page.
            7. Confidence must be high for a match.

            JSON Output:
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (sometimes Gemini adds backticks)
            const jsonStr = text.match(/\{.*\}/s)?.[0];
            if (jsonStr) {
                const aiData = JSON.parse(jsonStr);
                console.log("AI Parsed:", aiData);

                if (aiData.confidence > 0.6) {
                    if (aiData.intent === "SEARCH") {
                        speak(`Searching for ${aiData.target} plans.`);
                        navigate(`/products?search=${encodeURIComponent(aiData.target)}`);
                        setIsThinking(false); setIsProcessing(false); return;
                    }

                    if (aiData.intent === "FLOW" && aiData.target === "register") {
                        speak("Sure, starting the registration flow.");
                        if (location.pathname !== "/register") { setPendingFlow("register"); navigate("/register"); }
                        else executeRegisterFlow();
                        setIsThinking(false); setIsProcessing(false); return;
                    }

                    if (aiData.intent === "NAVIGATE") {
                        speak(`Navigating to ${aiData.target.replace("/", "") || "home"}`);
                        navigate(aiData.target);
                        toast.success(`Navigating to ${aiData.target}`);
                        setIsThinking(false); setIsProcessing(false); return;
                    }

                    if (aiData.intent === "ACTION") {
                        if (aiData.target === "footer") {
                            speak("Scrolling to the bottom of the page.");
                            document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
                            setIsThinking(false); setIsProcessing(false); return;
                        }
                    }
                }
            }
        } catch (err) {
            console.error("AI Error, falling back to keywords:", err);
        }

        // Fallback to Keyword Logic if AI fails or confidence is low
        processKeywordCommand(transcript);
        setIsThinking(false);
        setIsProcessing(false);
    };

    const processKeywordCommand = (transcript: string) => {
        const clean = transcript.replace(/go to |open |show me |please |scroll to |fill |my /g, "").trim();

        // Quick check for Footer
        if (transcript.includes("footer") || transcript.includes("bottom")) {
            speak("Scrolling to footer.");
            document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Quick check for Register Flow
        if (transcript.includes("register a user") || transcript.includes("register user")) {
            speak("Starting registration process.");
            if (location.pathname !== "/register") { setPendingFlow("register"); navigate("/register"); }
            else executeRegisterFlow();
            return;
        }

        // Static routes
        for (const cmd of sortedCommands) {
            if (clean === cmd || transcript.includes(cmd)) {
                speak(`Opening ${cmd}`);
                navigate(commandMap[cmd]);
                toast.success(`Navigating to ${cmd}`);
                return;
            }
        }

        // Last resort: Smart Click
        if (!findAndClickElement(clean)) {
            speak("I am sorry, I couldn't understand that command.");
            toast.error(`Recognized: "${transcript}". No action found.`);
        }
    };

    const toggleListening = useCallback(() => {
        if (!recognition) return toast.error("Voice support unavailable.");
        if (isListening) recognition.stop();
        else {
            if (!hasGreeted && window.speechSynthesis) {
                setHasGreeted(true);
                const utterance = new SpeechSynthesisUtterance("How can I help you?");
                utterance.lang = "en-IN";
                utterance.onstart = () => setIsProcessing(true);
                utterance.onend = () => {
                    setIsProcessing(false);
                    try {
                        recognition.start();
                        setIsListening(true);
                        toast.info("Listening...");
                    } catch (err) {
                        console.error(err);
                        setIsListening(false);
                    }
                };
                window.speechSynthesis.speak(utterance);
            } else {
                try {
                    recognition.start();
                    setIsListening(true);
                    toast.info("Listening...");
                } catch (err) {
                    console.error(err);
                    setIsListening(false);
                }
            }
        }
    }, [isListening, recognition, hasGreeted]);

    if (!SpeechRecognitionAPI) return null;

    return (
        <div
            className="fixed right-6 z-[60] flex flex-col items-end gap-3 transition-all duration-500 ease-in-out"
            style={{ bottom: isWidgetOpen ? "480px" : "110px" }}
        >
            <AnimatePresence>
                {(isListening || isThinking) && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3">
                        {isThinking ? (
                            <>
                                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">AI Thinking...</span>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-1">
                                    {[0, 0.2, 0.4].map(d => <motion.span key={d} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />)}
                                </div>
                                <span className="text-sm font-medium text-gray-600">Listening...</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <Button onClick={toggleListening} disabled={isProcessing} className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isListening ? "bg-red-500 animate-pulse" : "bg-orange-500 hover:scale-105"}`}>
                {isProcessing ? <Loader2 className="animate-spin text-white" /> : isListening ? <MicOff /> : <Mic />}
            </Button>
        </div>
    );
};

export default VoiceNavigation;
