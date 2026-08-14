import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout";
import { useGetAiSuggestions, useSendAiMessage } from "@/hooks/api-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Send, Bot, User, Mic, MicOff, Languages, MapPin, 
  Compass, Calendar, Heart, Share2, Volume2, VolumeX, CheckCircle, 
  Info, Star, Clock, AlertTriangle, ArrowRight, Wand2, RefreshCw,
  Sun, Flame, Bookmark, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

type ModeType = "spiritual" | "food" | "planner" | "voice";

interface PlaceDetails {
  name: string;
  image: string;
  rating: number;
  type: string;
  distance: string;
  time: string;
}

const PLACE_DETAILS: Record<string, PlaceDetails> = {
  "ram-bhandar": { name: "Ram Bhandar", image: "/images/kachori-sabji.png", rating: 4.7, type: "Food Spot", distance: "0.3 km", time: "4 mins walk" },
  "tamatar-chaat": { name: "Kashi Chaat Bhandar", image: "/images/tamatar-chaat.png", rating: 4.8, type: "Food Spot", distance: "0.3 km", time: "4 mins walk" },
  "blue-lassi": { name: "Blue Lassi Shop", image: "/images/banarasi-lassi.png", rating: 4.8, type: "Food Spot", distance: "0.2 km", time: "3 mins walk" },
  "kashi-vishwanath": { name: "Kashi Vishwanath Temple", image: "/images/kashi-vishwanath-aerial.jpg", rating: 4.9, type: "Temple", distance: "0.2 km", time: "2 mins walk" },
  "assi-ghat": { name: "Assi Ghat", image: "/images/assi-ghat-aarti.jpg", rating: 4.7, type: "Ghat", distance: "2.4 km", time: "30 mins walk" },
  "manikarnika-ghat": { name: "Manikarnika Ghat", image: "/images/manikarnika-ghat.png", rating: 4.8, type: "Ghat", distance: "0.6 km", time: "8 mins walk" },
  "dashashwamedh-ghat": { name: "Dashashwamedh Ghat", image: "/images/dashashwamedh-ghat-aarti.jpg", rating: 4.8, type: "Ghat", distance: "0.5 km", time: "6 mins walk" },
  "kaal-bhairav": { name: "Kaal Bhairav Temple", image: "/images/kaal-bhairav.png", rating: 4.8, type: "Temple", distance: "1.1 km", time: "14 mins walk" },
  "sarnath": { name: "Sarnath (Dhamek Stupa)", image: "/images/sarnath.png", rating: 4.6, type: "Heritage", distance: "8.2 km", time: "1.5 hours walk" },
  "ramnagar-fort": { name: "Ramnagar Fort", image: "/images/ramnagar-fort.png", rating: 4.6, type: "Heritage", distance: "5.1 km", time: "1 hour walk" },
  "swarved-mahamandir": { name: "Swarved Mahamandir", image: "/images/swarved-mahamandir.png", rating: 4.9, type: "Temple", distance: "12.5 km", time: "2.5 hours walk" },
};

const MODE_PROMPTS: Record<ModeType, string[]> = {
  spiritual: [
    "🛕 Tell me about Kashi Vishwanath Corridor",
    "🔥 What is the significance of Ganga Aarti?",
    "🔱 Why is Kaal Bhairav called Kotwal of Kashi?"
  ],
  food: [
    "🍛 Best breakfast foods near Dashashwamedh",
    "🥛 Where is the authentic Blue Lassi Shop?",
    "🍅 Tell me about Tamatar Chaat and Malaiyyo"
  ],
  planner: [
    "🗺️ Plan a perfect 1-day walking tour",
    "🚤 Plan a sunset boat ride route",
    "🚶 Recommended trails for sunrise photo spots"
  ],
  voice: [
    "🎤 Start voice conversation",
    "🔊 Speak daily spiritual quotes",
    "❓ Tell me the dress codes for temples"
  ]
};

export default function AiAssistant() {
  const { data: suggestions } = useGetAiSuggestions();
  const { mutate: sendMessage, isPending } = useSendAiMessage();
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState<ModeType>("spiritual");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: 'Namaste! I am your personal Kashi guide. Whether you want to discover hidden food stalls, learn the history of a temple, or plan your day, I am here to help. What would you like to explore?'
    }
  ]);

  // Handle Speech Recognition
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";
      
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          handleSend(text);
        }
        setIsListening(false);
      };
      
      rec.onerror = () => {
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. / आपके ब्राउज़र में भाषण पहचान समर्थित नहीं है।");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message immediately
    const userMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // Send to API
    sendMessage({ data: { message: text } }, {
      onSuccess: (data) => {
        if (data && data.reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
          
          // Trigger Audio Guide if enabled
          if (audioEnabled) {
            window.speechSynthesis.cancel();
            // Filter markdown formatting text for TTS
            const ttsText = data.reply.replace(/\[[^\]]+\]\([^)]+\)/g, "").replace(/[*#_]/g, "");
            const utterance = new SpeechSynthesisUtterance(ttsText);
            // Soothing Indian accent voice configuration
            utterance.lang = "en-IN";
            window.speechSynthesis.speak(utterance);
          }
        }
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      handleSend(query);
      // Clean query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // Enhance prompt helper
  const enhancePrompt = () => {
    if (!input.trim()) return;
    setInput(prev => prev + " with historical context, timings, and map location recommendations");
  };

  // Parser helper to render mini-cards for maps links
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    const foundFocusIds: string[] = [];

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{content.substring(lastIndex, match.index)}</span>);
      }

      const label = match[1];
      const url = match[2];
      
      // Check if it is a map link containing focus id
      const focusMatch = url.match(/focus=([^&]+)/);
      if (focusMatch && focusMatch[1]) {
        foundFocusIds.push(focusMatch[1]);
      }

      parts.push(
        <Link
          key={match.index}
          href={url}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-[#D4AF37]/15 text-[#F2D27A] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/25 transition-all mx-1 my-1 cursor-pointer active:scale-95"
        >
          {label}
        </Link>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.substring(lastIndex)}</span>);
    }

    return (
      <div className="space-y-3">
        <div className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{parts.length > 0 ? parts : content}</div>
        
        {/* Render corresponding mini map location cards */}
        {foundFocusIds.map((fid) => {
          const detail = PLACE_DETAILS[fid];
          if (!detail) return null;
          return (
            <motion.div 
              key={fid}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 bg-black/45 border border-[#D4AF37]/20 rounded-2xl p-3.5 mt-3 shadow-xl overflow-hidden"
            >
              <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F2D27A] border border-[#D4AF37]/20">{detail.type}</span>
                  <div className="flex items-center gap-0.5 text-[#D4AF37]">
                    <Star className="w-3 h-3 fill-[#D4AF37]" />
                    <span className="text-[11px] font-bold">{detail.rating}</span>
                  </div>
                </div>
                <h4 className="font-serif text-[14px] font-bold text-white mb-1.5">{detail.name}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/50">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {detail.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {detail.time}</span>
                </div>
              </div>
              <div className="flex items-center justify-end sm:pl-2">
                <Link 
                  href={`/map?focus=${fid}`}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F2D27A] text-black rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/20"
                >
                  Map <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div 
        className="w-full min-h-[calc(100vh-64px)] p-4 md:p-6 flex flex-col bg-[#0B0907] relative overflow-hidden"
        style={{
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Scoped CSS animations for Apple Intelligence breathing glows */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.25; filter: blur(24px); }
            50% { transform: scale(1.15); opacity: 0.45; filter: blur(32px); }
          }
          @keyframes avatarPulse {
            0%, 100% { box-shadow: 0 0 0 0px rgba(212, 175, 55, 0.4), 0 0 0 8px rgba(212, 175, 55, 0.15); }
            50% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0.1), 0 0 0 20px rgba(212, 175, 55, 0.05); }
          }
          @keyframes linePulse {
            0%, 100% { height: 6px; }
            50% { height: 18px; }
          }
          .glow-bg {
            animation: breathe 8s infinite ease-in-out;
          }
          .avatar-pulse {
            animation: avatarPulse 2.5s infinite ease-in-out;
          }
          .line-pulse {
            animation: linePulse 1.2s infinite ease-in-out;
          }
        `}} />

        {/* Dynamic blurred circles background */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[80px] pointer-events-none glow-bg" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#E8750A]/3 blur-[100px] pointer-events-none glow-bg" style={{ animationDelay: "3s" }} />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-[70px] pointer-events-none glow-bg" style={{ animationDelay: "1.5s" }} />

        {/* Premium Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card/25 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#D4AF37] to-[#F2D27A] rounded-2xl flex items-center justify-center border border-[#D4AF37]/30 shadow-lg shadow-amber-950/20 relative overflow-hidden">
              <Sparkles className="w-6 h-6 text-black animate-pulse" />
              <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-1.5 tracking-wide">
                Kashi AI Companion
              </h1>
              <p className="text-[11.5px] text-[#F2D27A] font-medium tracking-wider uppercase">Your Personal Spiritual & Cultural Guide</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Realtime Weather Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/45 border border-white/5 text-[11.5px] text-white/80">
              <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>31°C • Varanasi, UP</span>
            </div>
            
            {/* Audio Toggle */}
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                audioEnabled 
                  ? "bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F2D27A] shadow-md shadow-amber-950/10" 
                  : "bg-black/45 border-white/5 text-white/50"
              }`}
              title={audioEnabled ? "Speech response: ON" : "Speech response: OFF"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            {/* Settings Link */}
            <Link 
              href="/settings"
              className="px-4 py-2 rounded-xl bg-black/45 border border-white/5 hover:border-[#D4AF37]/30 transition-all text-xs font-bold text-white/80 cursor-pointer active:scale-95"
            >
              Settings
            </Link>
          </div>
        </header>

        {/* 3-Column Desktop Grid Layout */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 items-stretch">
          
          {/* COLUMN 1: LEFT - Companion Profile & Modes */}
          <section className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-card/35 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-5 flex flex-col items-center text-center">
              
              {/* Circular Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0B0907] to-[#201B14] p-1 border border-[#D4AF37]/25 relative mb-4 avatar-pulse flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                  <Bot className="w-10 h-10 text-[#F2D27A] animate-pulse" />
                </div>
                {/* Speaking/listening voice visualizer line pulses when recording */}
                {isListening && (
                  <div className="absolute inset-x-0 bottom-[-8px] flex justify-center items-center gap-0.5 h-6">
                    <span className="w-0.5 bg-[#D4AF37] rounded-full line-pulse" style={{ animationDelay: '0s' }} />
                    <span className="w-0.5 bg-[#D4AF37] rounded-full line-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-0.5 bg-[#D4AF37] rounded-full line-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>

              <h3 className="font-serif text-[15px] font-bold text-white mb-0.5">Kashi Devotional Assistant</h3>
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-[#F2D27A] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span>Online - Active in Kashi</span>
              </div>
              
              {/* Mood Badge */}
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/50 border border-white/5 bg-black/35 rounded-xl px-3 py-1.5 w-full mb-4">
                Mood: <span className="text-[#F2D27A]">Spiritual & Calm 🙏</span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 w-full text-[10px] text-white/60 mb-2">
                <div className="bg-black/20 border border-white/5 rounded-xl p-2.5">
                  <p className="text-white/40 mb-0.5">Voice Engine</p>
                  <p className="font-semibold text-white">Bilingual TTS</p>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-xl p-2.5">
                  <p className="text-white/40 mb-0.5">Primary Lang</p>
                  <p className="font-semibold text-white">English / हिन्दी</p>
                </div>
              </div>
            </div>

            {/* Mode selection Segmented sidebar list */}
            <div className="bg-card/35 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-4 flex flex-col gap-2">
              <h4 className="text-[10.5px] uppercase font-bold tracking-widest text-[#F2D27A] text-left px-1 mb-2">Select AI Mode</h4>
              
              <button 
                onClick={() => setActiveMode("spiritual")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[12.5px] font-bold transition-all text-left cursor-pointer border ${
                  activeMode === "spiritual" 
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F2D27A] shadow-md shadow-amber-950/15" 
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="leading-none mb-0.5">Spiritual Guide</p>
                  <span className="text-[9px] text-white/40 font-normal">Temple queues & Ganga Aarti</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveMode("food")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[12.5px] font-bold transition-all text-left cursor-pointer border ${
                  activeMode === "food" 
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F2D27A] shadow-md shadow-amber-950/15" 
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="leading-none mb-0.5">Food Expert</p>
                  <span className="text-[9px] text-white/40 font-normal">Famous street eats & sweets</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveMode("planner")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[12.5px] font-bold transition-all text-left cursor-pointer border ${
                  activeMode === "planner" 
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F2D27A] shadow-md shadow-amber-950/15" 
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="leading-none mb-0.5">Trip Planner</p>
                  <span className="text-[9px] text-white/40 font-normal">Custom tours & itineraries</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveMode("voice")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[12.5px] font-bold transition-all text-left cursor-pointer border ${
                  activeMode === "voice" 
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F2D27A] shadow-md shadow-amber-950/15" 
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Mic className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="leading-none mb-0.5">Voice Companion</p>
                  <span className="text-[9px] text-white/40 font-normal">Interactive voice guide</span>
                </div>
              </button>
            </div>
          </section>

          {/* COLUMN 2 & 3: CENTER - Premium Chat Box Window */}
          <section className="lg:col-span-2 flex flex-col bg-card/25 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl overflow-hidden relative items-stretch h-[600px] lg:h-auto">
            {/* Background texture */}
            <div className="absolute inset-0 bg-[url('/map-bg.png')] opacity-[0.03] bg-cover bg-center pointer-events-none" />
            
            {/* Mode segmented buttons at top of chat feed */}
            <div className="border-b border-[#D4AF37]/10 p-3 bg-black/35 backdrop-blur-md flex items-center gap-2 justify-between flex-shrink-0 z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2D27A] pl-2 hidden sm:inline">Active Context:</span>
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {(["spiritual", "food", "planner", "voice"] as ModeType[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold capitalize transition-all cursor-pointer border ${
                      activeMode === mode 
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#F2D27A]" 
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    {mode === "spiritual" && "🛕 Spiritual"}
                    {mode === "food" && "🍛 Food"}
                    {mode === "planner" && "🗺️ Planner"}
                    {mode === "voice" && "🎤 Voice"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat conversation feed */}
            <div className="flex-grow overflow-y-auto p-5 space-y-5 relative z-10 scrollbar-none" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={i} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F2D27A] p-0.5 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] rounded-3xl p-4 shadow-xl border ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F2D27A] text-black font-semibold rounded-tr-sm border-[#D4AF37]/30 shadow-amber-950/20' 
                        : 'bg-black/60 backdrop-blur-md border-[#D4AF37]/15 text-white/95 rounded-tl-sm shadow-black/45'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderMessageContent(msg.content)
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#F2D27A]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F2D27A] p-0.5 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black animate-spin" />
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl rounded-tl-sm p-4 flex gap-1 items-center shadow-lg shadow-black/45">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input bar and suggestion pills */}
            <div className="p-4 bg-black/45 border-t border-[#D4AF37]/10 relative z-10 flex-shrink-0">
              
              {/* Dynamic suggestion chips depending on Selected Mode */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar" style={{ scrollbarWidth: "none" }}>
                {MODE_PROMPTS[activeMode].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.substring(2))} // strip prefix icon for send
                    className="flex-shrink-0 px-3.5 py-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 rounded-full text-xs text-[#F2D27A] hover:bg-[#D4AF37]/10 transition-all whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              
              {/* Input container */}
              <div className="relative flex gap-2.5 items-center">
                
                {/* Voice button */}
                <button 
                  onClick={toggleListening}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                    isListening 
                      ? "bg-red-600 border-red-500 text-white animate-pulse" 
                      : "bg-[#D4AF37]/10 border-[#D4AF37]/25 text-[#F2D27A] hover:bg-[#D4AF37]/20"
                  }`}
                  title={isListening ? "Listening..." : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                {/* Text input */}
                <div className="relative flex-1">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder={
                      activeMode === "spiritual" ? "Ask about temple queues, histories, or aarti timings..." :
                      activeMode === "food" ? "Ask about famous dishes, hidden street eats, or sweets..." :
                      activeMode === "planner" ? "Ask for 1-day, 2-day itineraries or walking routes..." :
                      "Ask or speak with your devotional assistant..."
                    } 
                    className="bg-black/35 border-[#D4AF37]/25 h-12 pl-4 pr-11 rounded-2xl text-xs text-white focus-visible:ring-[#D4AF37]/45 focus-visible:border-[#D4AF37]/50 placeholder:text-white/30"
                    disabled={isPending}
                  />
                  
                  {/* Prompt enhancement wand button */}
                  {input.trim() && (
                    <button 
                      onClick={enhancePrompt}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-[#F2D27A] transition-colors cursor-pointer"
                      title="Enhance prompt with context"
                    >
                      <Wand2 className="w-4 h-4 animate-bounce" />
                    </button>
                  )}
                </div>

                {/* Send button */}
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isPending}
                  className="w-12 h-12 flex-shrink-0 bg-gradient-to-tr from-[#D4AF37] to-[#F2D27A] text-black rounded-2xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-amber-950/20 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* COLUMN 4: RIGHT - AI Insights Live telemetry panel */}
          <section className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Live KVT status & Aarti Countdown panel */}
            <div className="bg-card/35 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-5 text-left">
              <h4 className="text-[10.5px] uppercase font-bold tracking-widest text-[#F2D27A] mb-3 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                Kashi Live Insights
              </h4>
              
              <div className="space-y-4">
                <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">Kashi Vishwanath Queue</p>
                    <p className="text-sm font-bold text-white leading-none">35 min wait time</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold bg-[#D4AF37]/15 text-[#F2D27A] border border-[#D4AF37]/20 px-2 py-0.5 rounded-full">Normal</span>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">Evening Aarti Status</p>
                    <p className="text-sm font-bold text-white leading-none">Starts in 2h 15m</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">On Time</span>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">Dashashwamedh Ghat Crowd</p>
                    <p className="text-sm font-bold text-white leading-none">Moderate peak</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Busy</span>
                </div>
              </div>
            </div>

            {/* Lucky temple recommendation card */}
            <div className="bg-card/35 backdrop-blur-md border border-[#D4AF37]/15 rounded-3xl p-5 text-left flex flex-col justify-between flex-grow">
              <div>
                <h4 className="text-[10.5px] uppercase font-bold tracking-widest text-[#F2D27A] mb-3 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Lucky Recommendation
                </h4>
                
                <div className="bg-black/20 border border-white/5 rounded-2xl p-3.5 mb-3">
                  <h5 className="font-serif text-[13.5px] font-bold text-white mb-1.5">Swarved Mahamandir</h5>
                  <p className="text-[10.5px] text-white/60 leading-relaxed mb-2">One of the world's largest meditation centers featuring white marble walls engraved with 3,137 verses.</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#F2D27A]">
                    <Clock className="w-3 h-3" />
                    <span>Best time to visit: 6:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Devotional quote */}
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-3 text-center">
                <p className="text-[10.5px] italic text-[#F2D27A] font-serif">"सत्यमेव जयते नानृतं..."</p>
                <p className="text-[9px] text-[#F2D27A]/60 mt-1 uppercase tracking-wider font-bold">Mundaka Upanishad</p>
              </div>
            </div>
            
          </section>

        </div>
      </div>
    </Layout>
  );
}