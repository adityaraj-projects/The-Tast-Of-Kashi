import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search, Bell, Bookmark, Moon, Sun, ChevronDown, CloudSun,
  Star, Flame, Landmark, ArrowRight, Heart, ChevronLeft, ChevronRight,
  MapPin, Clock, Zap, BookOpen, Utensils, CalendarDays, Smile,
  Sparkles, Navigation, Bot, PhoneCall, AlertTriangle, Compass
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { openHistory } from "@/components/HistoryDialog";
import { toggleWishlist, useIsWishlisted } from "@/hooks/api-hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchBar } from "@/components/SearchBar";

const POPULAR_FOODS = [
  { id: "fallback_food_1", name: "Tamatar Chaat", tagline: "The Iconic Street Delight", image: "/images/tamatar-chaat.png", rating: 4.8, price: 40 },
  { id: "fallback_food_2", name: "Malaiyyo", tagline: "Winter's Royal Treat", image: "/images/malaiyoo.png", rating: 4.7, price: 60 },
  { id: "fallback_food_3", name: "Banarasi Lassi", tagline: "Rich, Creamy, Divine", image: "/images/banarasi-lassi.png", rating: 4.6, price: 35 },
  { id: "fallback_food_4", name: "Kachori Sabzi", tagline: "Crispy & Spicy Breakfast", image: "/images/kachori-sabji.png", rating: 4.7, price: 30 },
  { id: "fallback_food_5", name: "Rabri Jalebi", tagline: "Timeless Sweet Combo", image: "/images/jalebi-imarti.png", rating: 4.6, price: 50 },
  { id: "fallback_food_6", name: "Banarasi Paan", tagline: "A Tradition of Taste", image: "/images/banarasi-paan.png", rating: 4.8, price: 20 },
  { id: "fallback_food_7", name: "Kulfi Falooda", tagline: "Creamy Frozen Bliss", image: "/images/kulfi-falooda.png", rating: 4.5, price: 55 },
  { id: "fallback_food_8", name: "Thandai", tagline: "Festival Drink of Kashi", image: "/images/thandai.png", rating: 4.7, price: 45 },
  { id: "fallback_food_9", name: "Malpua Rabri", tagline: "Fried Sweet Pancakes", image: "/images/malpua-rabri.png", rating: 4.6, price: 65 },
  { id: "fallback_food_10", name: "Rabdi", tagline: "Reduced Milk Dessert", image: "/images/rabdi.png", rating: 4.5, price: 40 },
];

const TOP_ATTRACTIONS = [
  { id: "fallback_attr_1", name: "Kashi Vishwanath Temple", sub: "Spiritual Icon", image: "/images/kashi-vishwanath-aerial.jpg", rating: 4.9 },
  { id: "fallback_attr_2", name: "Ganga Dwar", sub: "Gateway to the Ganges", image: "/images/ganga-dwar.jpg", rating: 4.9 },
  { id: "fallback_attr_3", name: "Assi Ghat", sub: "Peaceful & Spiritual", image: "/images/assi-ghat-aarti.jpg", rating: 4.7 },
  { id: "fallback_attr_4", name: "Sarnath", sub: "Historical Treasure", image: "/images/sarnath.png", rating: 4.6 },
  { id: "fallback_attr_5", name: "Dashashwamedh Ghat", sub: "Divine Aarti Experience", image: "/images/dashashwamedh-ghat-aarti.jpg", rating: 4.8 },
  { id: "fallback_attr_6", name: "BHU Campus", sub: "Heritage & Knowledge", image: "/images/ghats-night.png", rating: 4.7 },
  { id: "fallback_attr_7", name: "Kaal Bhairav Temple", sub: "Kotwal of Kashi", image: "/images/kaal-bhairav.png", rating: 4.8 },
  { id: "fallback_attr_8", name: "Manikarnika Ghat", sub: "Sacred Cremation Ground", image: "/images/manikarnika-ghat.png", rating: 4.8 },
  { id: "fallback_attr_9", name: "Ramnagar Fort", sub: "Royal Heritage", image: "/images/ramnagar-fort.png", rating: 4.6 },
  { id: "fallback_attr_10", name: "Swarved Mahamandir", sub: "Modern Meditation Temple", image: "/images/swarved-mahamandir.png", rating: 4.9 },
];

const EVENTS = [
  { day: "15", month: "JUN", name: "Dev Deepawali", venue: "Dashashwamedh Ghat", time: "6:00 PM Onwards", image: "/images/bg-login.png" },
  { day: "21", month: "JUN", name: "Ganga Aarti Special", venue: "Assi Ghat", time: "7:00 PM Onwards", image: "/images/ganga-aarti.png" },
  { day: "05", month: "JUL", name: "Sawan Mahotsav", venue: "Kashi Vishwanath Corridor", time: "5:00 PM Onwards", image: "/images/kashi-vishwanath.png" },
];

const AI_CHIPS = ["Best food near me", "Historical places", "Plan 1 day trip", "Hidden gems"];

const WISHLIST_IMGS = [
  "/images/tamatar-chaat.png",
  "/images/banarasi-lassi.png",
  "/images/kachori-sabji.png",
  "/images/malaiyoo.png",
];

const STATS_ROW = [
  { icon: Utensils, value: "50+", label: "Authentic Foods" },
  { icon: Landmark, value: "30+", label: "Attractions" },
  { icon: Navigation, value: "100+", label: "Local Vendors" },
  { icon: BookOpen, value: "80+", label: "Stories" },
  { icon: CalendarDays, value: "12", label: "Upcoming Events" },
  { icon: Smile, value: "2.5K+", label: "Happy Explorers" },
];

const CARD_BG = "rgba(14,10,3,0.98)";
const CARD_BORDER = "rgba(201,162,39,0.10)";

function GoldText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "linear-gradient(90deg, #E8C84A 0%, #C9A227 50%, #A07820 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{children}</span>
  );
}

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("kashi_theme") || "dark");
  const [temp, setTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number>(0);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Polishing updates states
  const [time, setTime] = useState(new Date());
  const [showQuickDock, setShowQuickDock] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  
  // Gamification state
  const [xp, setXp] = useState(() => {
    const stored = localStorage.getItem("kashi_xp");
    return stored ? parseInt(stored) : 1420;
  });
  const [level, setLevel] = useState(() => {
    const stored = localStorage.getItem("kashi_level");
    return stored ? parseInt(stored) : 4;
  });
  const [claimedToday, setClaimedToday] = useState(() => {
    const stored = localStorage.getItem("kashi_claimed_today");
    return stored === "true";
  });

  const claimBlessing = () => {
    if (claimedToday) return;
    const nextXp = xp + 50;
    let nextLvl = level;
    if (nextXp >= 2000) {
      nextLvl += 1;
    }
    setXp(nextXp);
    setLevel(nextLvl);
    setClaimedToday(true);
    localStorage.setItem("kashi_xp", nextXp.toString());
    localStorage.setItem("kashi_level", nextLvl.toString());
    localStorage.setItem("kashi_claimed_today", "true");
  };

  // Aarti & Festival Countdown Timer States
  const [aartiTimeLeft, setAartiTimeLeft] = useState("00:00:00");
  const [festivalTimeLeft, setFestivalTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      // Aarti Countdown (Daily at 6:45 PM = 18:45)
      const now = new Date();
      setTime(now);
      const aartiTime = new Date();
      aartiTime.setHours(18, 45, 0, 0);
      
      if (now > aartiTime) {
        aartiTime.setDate(aartiTime.getDate() + 1);
      }
      
      const diffMs = aartiTime.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      
      const pad = (num: number) => num.toString().padStart(2, "0");
      setAartiTimeLeft(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);

      // Festival Countdown (Makar Sankranti - January 14, 2027)
      const festDate = new Date("2027-01-14T00:00:00+05:30");
      const diffFestMs = festDate.getTime() - now.getTime();
      const days = Math.floor(diffFestMs / 86400000);
      const fHrs = Math.floor((diffFestMs % 86400000) / 3600000);
      
      setFestivalTimeLeft(`${days}d ${fHrs}h remaining`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Recommendation engine calculations
  const getRecommendation = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) {
      return {
        title: "🌅 Sunrise Spiritual Recommendation",
        text: "Morning Ganga current is calm. Head to Assi Ghat for Subah-e-Banaras, followed by warm Kachori breakfast at Ram Bhandar.",
        link: "/map?focus=assi-ghat",
        btnText: "Explore Assi Ghat",
        bg: "linear-gradient(to right, rgba(212,175,55,0.15), rgba(232,117,10,0.08))"
      };
    } else if (hours >= 11 && hours < 16) {
      return {
        title: "🍲 Afternoon Food & Shelter",
        text: "The sun is peaking. Take shelter inside Swarved Mahamandir or try a cooling sweet Banarasi Lassi at Blue Lassi shop.",
        link: "/foods",
        btnText: "Explore Foods",
        bg: "linear-gradient(to right, rgba(6,182,212,0.12), rgba(212,175,55,0.08))"
      };
    } else if (hours >= 16 && hours < 21) {
      return {
        title: "🎆 Evening Aarti Special",
        text: "Evening fire rituals are starting soon. Secure boat seating at Dashashwamedh Ghat or board the luxury Alaknanda cruise liner.",
        link: "/map?focus=dashashwamedh-ghat",
        btnText: "Aarti Map Details",
        bg: "linear-gradient(to right, rgba(168,85,247,0.15), rgba(232,117,10,0.08))"
      };
    } else {
      return {
        title: "🌙 Late Night Delicacies",
        text: "Winding down in Kashi? Try traditional warm Rabri Jalebi sweets or browse historical storytelling before bed.",
        link: "/stories",
        btnText: "Read Legends",
        bg: "linear-gradient(to right, rgba(14,116,144,0.12), rgba(15,10,5,0.3))"
      };
    }
  };

  const rec = getRecommendation();

  const toggleEventBookmark = (e: React.MouseEvent, eventName: string) => {
    e.stopPropagation();
    setBookmarkedEvents(prev => 
      prev.includes(eventName) 
        ? prev.filter(name => name !== eventName) 
        : [...prev, eventName]
    );
  };

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=25.3176&longitude=83.0062&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia/Kolkata")
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setTemp(Math.round(data.current.temperature_2m));
          setWeatherCode(data.current.weather_code);
        }
        if (data && data.daily) {
          const list = [];
          for (let i = 0; i < 5; i++) {
            list.push({
              date: new Date(data.daily.time[i]).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
              max: Math.round(data.daily.temperature_2m_max[i]),
              min: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily.weather_code[i]
            });
          }
          setWeatherForecast(list);
        }
      })
      .catch(err => console.error("Weather fetch error", err));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("kashi_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("kashi_theme") || "dark";
      setTheme(currentTheme);
    };
    window.addEventListener("kashi_theme_change", handleThemeChange);
    return () => window.removeEventListener("kashi_theme_change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("kashi_theme", nextTheme);
    window.dispatchEvent(new Event("kashi_theme_change"));
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return { label: "Clear Sky / साफ़ मौसम", icon: Sun, color: "#F59E0B", tip: "Perfect time for morning boat ride and temple visits!" };
    if (code === 1 || code === 2 || code === 3) return { label: "Partly Cloudy / हल्के बादल", icon: CloudSun, color: "#3B82F6", tip: "Great weather to explore Sarnath and the Ghats." };
    if (code >= 51 && code <= 67) return { label: "Drizzle / बूंदाबांदी", icon: CloudSun, color: "#60A5FA", tip: "Expect light showers. Carrying a pocket umbrella is advised." };
    if (code >= 71 && code <= 86) return { label: "Rainy / वर्षा", icon: CloudSun, color: "#2563EB", tip: "Heavy rain. Indoors and visiting temples via corridor recommended." };
    return { label: "Sunny / साफ़", icon: Sun, color: "#F59E0B", tip: "Warm and bright. Wear sunscreen and stay hydrated!" };
  };

  const secDeg = (time.getSeconds() / 60) * 360;
  const minDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hrDeg = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-full min-w-0">
        {/* Main content area */}
        <div className="flex-1 min-w-0 lg:overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* Hero */}
          <div className="relative w-full h-[320px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden">
            <img src="/images/dashboard-kashi-panels.jpg" alt="Kashi" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(4,2,0,0.93) 0%,rgba(4,2,0,0.60) 55%,rgba(4,2,0,0.18) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.88) 0%,transparent 55%)" }} />
            
            {/* Scrollable Search Bar overlay inside Hero */}
            <div className="absolute top-4 left-12 sm:left-7 right-4 sm:right-7 z-30 max-w-md pointer-events-auto">
              <SearchBar />
            </div>

            <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 items-center pt-[64px] px-4 sm:px-7 gap-6">
              
              {/* Left Side Hero info - Expanded for Cinematic Look */}
              <div className="lg:col-span-12 flex flex-col justify-center text-left max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2.5 backdrop-blur-md bg-black/35 border border-white/5 shadow-sm w-fit pointer-events-none" style={{ color: "#C9A227" }}>
                  <span>Namaste, Aditya! 🙏</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-[44px] font-bold text-white leading-tight mb-2.5" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                  Welcome back to <GoldText>Kashi</GoldText>
                </h1>
                <p className="text-xs sm:text-[13.5px] leading-relaxed mb-5 text-white/80" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  Every corner has a story, every flavor has history. Discover ancient ghats, legendary street foods, and the divine energy of the world's oldest living city.
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      document.getElementById("popular-foods-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full transition-all hover:scale-[1.02] cursor-pointer" 
                    style={{ background: "linear-gradient(90deg,#C9A227 0%,#A07820 100%)", color: "#040200", boxShadow: "0 4px 20px rgba(201,162,39,0.30)" }}
                  >
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsVideoOpen(true)}
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-full transition-all hover:bg-white/15 cursor-pointer" 
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}
                  >
                    <span className="text-[10px] sm:text-xs">▶</span> Watch Video
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 lg:grid-cols-6 border-b animate-fade-in" style={{ background: "var(--app-section-bg)", borderColor: "var(--app-card-border)" }}>
            {STATS_ROW.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center py-3 px-1 border-r border-b lg:border-b-0" style={{ borderColor: "rgba(201,162,39,0.07)" }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                    <span className="font-serif text-[14px] font-bold" style={{ background: "linear-gradient(90deg,#E8C84A,#C9A227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-center" style={{ color: "#5A4D38" }}>{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="px-4 sm:px-5 pb-6 space-y-5 pt-4">
            
            {/* AI Recommendation Engine widget (Module 9) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl border border-[#C9A227]/25 text-left relative overflow-hidden shadow-xl"
              style={{ background: rec.bg }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#C9A227] font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> {rec.title}
                  </div>
                  <p className="text-xs text-white/90 max-w-xl leading-relaxed">{rec.text}</p>
                </div>
                <button
                  onClick={() => navigate(rec.link)}
                  className="px-4 py-2 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black text-xs font-bold rounded-xl shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {rec.btnText}
                </button>
              </div>
            </motion.div>

            {/* Dashboard Insights Grid Widget (Module 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Daily Quote & Cultural Tip */}
              <div className="p-4 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 text-left flex flex-col justify-between space-y-3" style={{ background: "var(--app-card-bg)", borderColor: "var(--app-card-border)" }}>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] block mb-1">🕊️ Wisdom of Kashi</span>
                  <p className="text-[11px] font-medium text-white/90 italic leading-relaxed">"मन चंगा तो कठौती में गंगा - Sant Ravidas."</p>
                  <p className="text-[9px] text-muted-foreground mt-1">If the mind is pure, the sacred Ganges resides right in your basin.</p>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-amber-500 block mb-0.5">💡 Local Cultural Tip</span>
                  <p className="text-[10px] text-white/70 leading-relaxed">Early river winds at Ghats are cool. Grab fresh warm Malaiyyo milk foam in Chowk before 9 AM.</p>
                </div>
              </div>

              {/* Queue Estimators & Real-Time Crowds */}
              <div className="p-4 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 text-left space-y-3" style={{ background: "var(--app-card-bg)", borderColor: "var(--app-card-border)" }}>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] flex items-center gap-1.5">
                  ⌛ Temple Queue Estimates
                </span>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10.5px]">
                      <span className="text-white/80 font-medium">Kashi Vishwanath Corridor</span>
                      <span className="text-[#C9A227] font-bold">25 min wait</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10.5px]">
                      <span className="text-white/80 font-medium">Kaal Bhairav Kotwal</span>
                      <span className="text-[#C9A227] font-bold">15 min wait</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/50 border-t border-white/5 pt-1.5">
                    <span>🔥 Aarti Crowd: Extreme</span>
                    <span>Starts 6:45 PM</span>
                  </div>
                </div>
              </div>

              {/* Daily Recommendation and Gem */}
              <div className="p-4 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 text-left flex flex-col justify-between space-y-3" style={{ background: "var(--app-card-bg)", borderColor: "var(--app-card-border)" }}>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] block mb-1">🏛️ Hidden Gem Highlight</span>
                  <h4 className="text-xs font-bold text-white mb-0.5">Dhamek Stupa, Sarnath</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">Where Buddha delivered his first sermon 2500 years ago. Extremely quiet afternoon park.</p>
                </div>
                <button
                  onClick={() => navigate("/map?focus=sarnath")}
                  className="w-full text-center text-[9px] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/25 transition-all cursor-pointer"
                >
                  Locate Dhamek Stupa →
                </button>
              </div>

            </div>

            {/* Popular Foods — 10 items */}
            <section id="popular-foods-section">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#E8750A]" />
                  <h2 className="font-semibold text-[14px] text-foreground">Popular Foods</h2>
                </div>
                <button className="text-[12px] font-medium hover:underline" style={{ color: "#C9A227" }}>View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {POPULAR_FOODS.map((food, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => openHistory(food.name)}
                    className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
                    <div className="relative h-[102px] overflow-hidden">
                      <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.55) 0%,transparent 50%)" }} />
                      <DashboardWishlistButton item={food} itemType="Food" />
                    </div>
                    <div className="p-2.5">
                      <p className="font-semibold text-[11.5px] text-foreground leading-tight">{food.name}</p>
                      <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#5A4D38" }}>{food.tagline}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                          <span className="text-[11px] font-medium" style={{ color: "#C9A227" }}>{food.rating}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">₹{food.price}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Top Attractions — 10 items */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4" style={{ color: "#C9A227" }} />
                  <h2 className="font-semibold text-[14px] text-foreground">Top Attractions</h2>
                </div>
                <button className="text-[12px] font-medium hover:underline" style={{ color: "#C9A227" }}>View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {TOP_ATTRACTIONS.map((attr, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
                    onClick={() => openHistory(attr.name)}
                    className="flex-shrink-0 w-[155px] rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
                    <div className="relative h-[96px] overflow-hidden">
                      <img src={attr.image} alt={attr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.80) 0%,transparent 55%)" }} />
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                        <span className="text-[11px] font-medium text-white">{attr.rating}</span>
                      </div>
                      <DashboardWishlistButton item={attr} itemType={attr.name.includes("Ghat") ? "Ghat" : "Temple"} />
                    </div>
                    <div className="p-2.5">
                      <p className="font-semibold text-[11px] text-foreground leading-tight">{attr.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#5A4D38" }}>{attr.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Bottom 3-col */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Stories */}
              <section className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5" style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                    <h3 className="font-semibold text-[12.5px]">Stories of Kashi</h3>
                  </div>
                  <button className="text-[11px] hover:underline" style={{ color: "#C9A227" }}>View All</button>
                </div>
                <div className="p-3">
                  <div className="relative h-[100px] rounded-xl overflow-hidden mb-2.5">
                    <img src="/images/kashi-vishwanath.png" alt="Story" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.92) 0%,transparent 50%)" }} />
                    <p className="absolute bottom-2 left-2.5 right-2.5 font-serif text-[11px] font-bold text-white leading-tight">The Legend of Kashi Vishwanath</p>
                  </div>
                  <p className="text-[10.5px] leading-relaxed line-clamp-2 mb-3" style={{ color: "#5A4D38" }}>A timeless tale of faith, destruction & rebirth.</p>
                  <div className="flex items-center justify-between">
                    {[ChevronLeft, ChevronRight].map((Icon, i) => (
                      <button key={i} className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Vendors */}
              <section className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5" style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                    <h3 className="font-semibold text-[12.5px]">Top Vendors</h3>
                  </div>
                  <button className="text-[11px] hover:underline" style={{ color: "#C9A227" }}>View All</button>
                </div>
                <div className="p-3">
                  <div className="relative h-[100px] rounded-xl overflow-hidden mb-2.5">
                    <img src="/images/banarasi-chaat.png" alt="Vendor" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.85) 0%,transparent 50%)" }} />
                  </div>
                  <p className="font-semibold text-[12.5px] text-foreground">Kashi Chat Bhandar</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-2.5 h-2.5" style={{ color: "#5A4D38" }} />
                    <p className="text-[10.5px]" style={{ color: "#5A4D38" }}>Thatheri Bazaar</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                      <span className="text-[12px] font-semibold" style={{ color: "#C9A227" }}>4.8</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    {[ChevronLeft, ChevronRight].map((Icon, i) => (
                      <button key={i} className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Wishlist */}
              <section className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5" style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" style={{ color: "#C9A227" }} />
                    <h3 className="font-semibold text-[12.5px]">My Wishlist</h3>
                  </div>
                  <button className="text-[11px] hover:underline" style={{ color: "#C9A227" }}>View All</button>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {WISHLIST_IMGS.map((img, i) => (
                      <div key={i} className="h-[50px] rounded-xl overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
                        <Heart className="w-3 h-3 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                      </div>
                      <span className="text-[12px] font-semibold">12 Items Saved</span>
                    </div>
                    <button className="text-[11px] hover:underline" style={{ color: "#C9A227" }}>Manage →</button>
                  </div>
                </div>
              </section>
            </div>

            {/* Quote bar */}
            <div className="relative rounded-2xl overflow-hidden h-[72px]">
              <img src="/images/ganga-aarti.png" alt="Kashi" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
              <div className="absolute inset-0" style={{ background: "rgba(3,2,0,0.82)" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="font-serif text-[13px] italic leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
                  "Kashi is not just a city, it's a feeling, a blessing, a way of life."
                </p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: "#C9A227" }}>— Ancient Kashi Wisdom</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[280px] flex-shrink-0 lg:overflow-y-auto border-t lg:border-t-0 lg:border-l" style={{ background: "var(--app-sidebar-bg)", borderColor: "var(--app-card-border)", scrollbarWidth: "none" }}>
          <div className="p-3.5 pb-24 lg:pb-4 space-y-4">
            {/* Top utilities row inside Right Panel - hidden on mobile since it is already in header */}
            <div className="hidden lg:flex items-center justify-between gap-1.5 border rounded-2xl bg-black/45 p-2 mb-1 z-10 relative" style={{ borderColor: "var(--app-card-border)" }}>
              {/* Weather widget */}
              <div
                onClick={() => setIsWeatherOpen(true)}
                className="flex items-center gap-1 rounded-xl px-2 py-1 cursor-pointer hover:bg-[#C9A227]/10 transition-all border border-[#C9A227]/20 bg-black/20"
              >
                <CloudSun className="w-3.5 h-3.5 text-[#C9A227]" />
                <div className="leading-none text-left">
                  <p className="text-[10px] font-bold text-[#C9A227]">{temp !== null ? `${temp}°C` : "32°C"}</p>
                  <p className="text-[8px] text-[#7A6A4A] leading-none mt-0.5">Banaras</p>
                </div>
              </div>

              {/* Bell */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/5 border border-white/5 bg-black/20 relative cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#7A6A4A]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E8750A] rounded-full" />
              </button>

              {/* Bookmark */}
              <button
                onClick={() => navigate("/wishlist")}
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/5 border border-white/5 bg-black/20 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/5 border border-white/5 bg-black/20 cursor-pointer"
              >
                {theme === "light" ? (
                  <Sun className="w-3.5 h-3.5 text-[#C9A227]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#7A6A4A]" />
                )}
              </button>

              {/* Profile Avatar Trigger */}
              <button
                onClick={() => navigate("/settings")}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all p-[1px] relative overflow-hidden flex-shrink-0"
                style={{ 
                  background: "linear-gradient(135deg, #E8C84A 0%, #C9A227 100%)",
                }}
              >
                <Avatar className="w-full h-full border border-black rounded-full">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
              </button>
            </div>

            {/* 1. Kashi Chronometer Widget (Apple Watch Analog-Digital Clock) */}
            <div className="p-4 rounded-3xl border border-[#D4AF37]/35 shadow-2xl backdrop-blur-md bg-black/65 flex flex-col items-center relative overflow-hidden text-left" style={{ boxShadow: "0 0 15px rgba(212,175,55,0.1)" }}>
              <span className="absolute top-2 left-3 text-[8px] font-bold text-[#D4AF37]/80 uppercase tracking-widest">Kashi Chronometer</span>
              
              <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37]/30 bg-black/40 relative flex items-center justify-center my-2 shadow-[inset_0_0_12px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0.5 text-[8px] font-bold text-[#D4AF37]">12</div>
                <div className="absolute right-1 text-[8px] font-bold text-[#D4AF37]">3</div>
                <div className="absolute bottom-0.5 text-[8px] font-bold text-[#D4AF37]">6</div>
                <div className="absolute left-1 text-[8px] font-bold text-[#D4AF37]">9</div>

                <div className="w-1.5 h-1.5 rounded-full bg-[#E8C84A] z-10" />

                <div 
                  className="absolute w-0.5 h-5 bg-white origin-bottom bottom-[50%] rounded-full shadow-sm"
                  style={{ transform: `rotate(${hrDeg}deg)` }}
                />
                <div 
                  className="absolute w-0.5 h-7 bg-[#E8C84A] origin-bottom bottom-[50%] rounded-full shadow-sm"
                  style={{ transform: `rotate(${minDeg}deg)` }}
                />
                <div 
                  className="absolute w-px h-8 bg-red-500 origin-bottom bottom-[50%]"
                  style={{ transform: `rotate(${secDeg}deg)` }}
                />
              </div>

              <div className="text-center space-y-1 z-10">
                <p className="font-mono text-base font-bold text-white tracking-wide leading-none">
                  {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider leading-none">
                  {time.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="flex gap-1.5 text-[8.5px] text-white/50 border-t border-[#D4AF37]/15 pt-1 mt-1 justify-center">
                  <span>☀ Rise 5:18 AM</span>
                  <span>•</span>
                  <span>🌇 Set 6:47 PM</span>
                </div>
                <p className="text-[8.5px] text-[#D4AF37]/90 font-bold uppercase tracking-widest leading-none pt-0.5">
                  🌙 Shukla Paksha • Dwitiya
                </p>
              </div>
            </div>

            {/* 2. Today's Highlights / Kashi Live Widget (Directly below Kashi Chronometer) */}
            <section className="p-4 rounded-2xl border border-[#D4AF37]/25 shadow-xl backdrop-blur-md bg-black/60 text-left space-y-3.5 transition-all duration-300 hover:border-[#D4AF37]/50" style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)" }}>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#D4AF37]/15">
                <span className="text-[10px] font-bold text-[#E8C84A] uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Today's Highlights
                </span>
                <span className="text-[8px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">Kashi Live</span>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Temple of the Day */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8A7450] block">🛕 Temple of the Day</span>
                    <span className="font-bold text-white leading-none">Kashi Vishwanath Temple</span>
                  </div>
                  <span className="text-[9px] text-green-400 font-bold">Open</span>
                </div>

                {/* Food of the Day */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8A7450] block">🍛 Today's Special</span>
                    <span className="font-bold text-white leading-none">Malaiyyo Froth Sweet</span>
                  </div>
                  <span className="text-[9px] text-[#C9A227] font-bold">Try Now</span>
                </div>

                {/* Ganga Aarti */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8A7450] block">🔥 Ganga Aarti</span>
                    <span className="font-mono text-white font-bold">{aartiTimeLeft}</span>
                  </div>
                  <span className="text-[9px] text-orange-400 font-bold">6:45 PM</span>
                </div>

                {/* Weather */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8A7450] block">🌤 Weather Insight</span>
                    <span className="font-bold text-white leading-none">{temp !== null ? `${temp}°C` : "27°C"} • Clear Sky</span>
                  </div>
                  <span className="text-[9.5px]">🌤</span>
                </div>

                {/* Hindu Tithi */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#8A7450] block">📿 Today's Tithi</span>
                    <span className="font-bold text-white leading-none">Shukla Paksha • Dwitiya</span>
                  </div>
                  <span className="text-[9px] text-[#C9A227]">Auspicious</span>
                </div>

              </div>
            </section>

            {/* 3. Journey Stats */}
            <section className="rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#D4AF37]/50" style={{ background: "var(--app-card-bg)", border: "1px solid var(--app-card-border)" }}>
              <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22c0-5-4-9-9-9 0 4.5 3.5 8.5 9 9z" fill="#C9A227" opacity="0.8" />
                    <path d="M12 22c0-5 4-9 9-9 0 4.5-3.5 8.5-9 9z" fill="#C9A227" opacity="0.8" />
                    <path d="M12 22c-2-4-1-9 0-13 1 4 2 9 0 13z" fill="#E8C84A" />
                    <path d="M12 22c-4-3-6-7-5-11 3 2 6 6 5 11z" fill="#C9A227" opacity="0.6" />
                    <path d="M12 22c4-3 6-7 5-11-3 2-6 6-5 11z" fill="#C9A227" opacity="0.6" />
                  </svg>
                  <h3 className="font-semibold text-[13px] text-foreground">Your Journey Stats</h3>
                </div>
                <button onClick={() => navigate("/wishlist")} className="text-[11px] font-medium hover:underline cursor-pointer" style={{ color: "#C9A227" }}>View All</button>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: "rgba(201,162,39,0.07)" }}>
                {[
                  { emoji: "❤️", value: 24, label: "Favorites", path: "/wishlist" },
                  { emoji: "📍", value: 18, label: "Places Explored", path: "/map" },
                  { emoji: "📖", value: 12, label: "Stories Read", path: "/stories" },
                  { emoji: "🔥", value: 36, label: "Foods Tasted", path: "/foods" },
                ].map((s, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(s.path)}
                    className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.03] transition-all" 
                    style={{ borderColor: "rgba(201,162,39,0.07)" }}
                  >
                    <span className="text-2xl leading-none flex-shrink-0">{s.emoji}</span>
                    <div>
                      <p className="font-bold text-[22px] text-foreground leading-none">{s.value}</p>
                      <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#5A4D38" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. AI Recommendation Card */}
            <section className="p-4 rounded-2xl border border-[#C9A227]/25 text-left space-y-3 transition-all duration-300 hover:border-[#D4AF37]/50" style={{ background: "var(--app-card-bg)" }}>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] flex items-center gap-1">
                ✨ AI Recommendation
              </span>
              <div className="space-y-1.5">
                <p className="text-[11.5px] font-bold text-white leading-none">Good Evening, Aditya.</p>
                <p className="text-[10.5px] text-white/80 leading-relaxed">Perfect itinerary schedule for tonight:</p>
                <ul className="text-[10px] text-[#C9A227] space-y-0.5 list-disc pl-4">
                  <li>Dashashwamedh Evening Aarti</li>
                  <li>Blue Lassi Shop Treat</li>
                  <li>Night Boat Crossing</li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-2 text-[8px] text-white/50">
                <div>
                  <span className="block text-white/40">Est. Time</span>
                  <span className="font-bold text-white">3.5 hours</span>
                </div>
                <div>
                  <span className="block text-white/40">Est. Cost</span>
                  <span className="font-bold text-white">₹600 total</span>
                </div>
                <div>
                  <span className="block text-white/40">Distance</span>
                  <span className="font-bold text-white">1.8 km walk</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/wishlist")}
                className="w-full text-center text-[10px] font-bold py-2 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Start Journey
              </button>
            </section>

            {/* 5. Smart Quick Actions Board */}
            <section className="p-4 rounded-2xl border border-[#C9A227]/25 text-left space-y-3 transition-all duration-300 hover:border-[#D4AF37]/50" style={{ background: "var(--app-card-bg)" }}>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] flex items-center gap-1">
                ⚡ Quick Operations Dock
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold">
                <button onClick={() => navigate("/ai-assistant")} className="p-2 text-left bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 cursor-pointer">
                  📖 Start AI Guide
                </button>
                <button onClick={() => navigate("/wishlist")} className="p-2 text-left bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 cursor-pointer">
                  📸 Capture Memory
                </button>
                <button onClick={() => navigate("/wishlist")} className="p-2 text-left bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 cursor-pointer">
                  👁️ Open Camera
                </button>
                <button onClick={() => setShowEmergencyModal(true)} className="p-2 text-left bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer">
                  🚨 Emergency Help
                </button>
              </div>
            </section>

          </div>
        </aside>
      </div>

      {/* Weather Forecast Modal */}
      <Dialog open={isWeatherOpen} onOpenChange={setIsWeatherOpen}>
        <DialogContent className="max-w-md bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-[#C9A227] animate-pulse" />
              Kashi Weather Forecast
            </DialogTitle>
            <p className="text-xs text-[#8A7450] font-sans">Varanasi Live Climate Planning Advisor</p>
          </DialogHeader>

          {/* Current weather details */}
          <div className="bg-[#C9A227]/5 border border-[#C9A227]/15 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-left">
                <p className="text-sm font-semibold text-white/70">Current Condition</p>
                <p className="text-sm font-bold text-white mt-0.5">{getWeatherDesc(weatherCode).label}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-extrabold text-[#C9A227]">{temp !== null ? `${temp}°C` : "32°C"}</span>
              </div>
            </div>
            <div className="border-t border-[#C9A227]/10 pt-2.5 mt-2.5 text-left">
              <p className="text-xs text-[#E8C84A] font-semibold">Travel Recommendation:</p>
              <p className="text-[11px] text-white/80 mt-1 leading-relaxed">{getWeatherDesc(weatherCode).tip}</p>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7450] mb-2">5-Day Outlook</h4>
            {weatherForecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-white/75">{day.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#C9A227]">{day.max}°C</span>
                  <span className="text-xs text-white/45">{day.min}°C</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Event Details Modal */}
      <Dialog open={selectedEvent !== null} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-md bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
          {selectedEvent && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#C9A227]" />
                  {selectedEvent.name}
                </DialogTitle>
                <p className="text-xs text-[#8A7450] font-sans">Special Event & Aarti Schedule in Kashi</p>
              </DialogHeader>

              <div className="rounded-2xl overflow-hidden h-[180px] mb-4 border border-[#C9A227]/15">
                <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center bg-[#C9A227]/5 border border-[#C9A227]/15 rounded-xl p-3">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-semibold">Location / Venue</p>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedEvent.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase font-semibold">Scheduled Time</p>
                    <p className="text-xs font-bold text-[#C9A227] mt-0.5">{selectedEvent.time}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#E8C84A]">About this Event:</p>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    {selectedEvent.name === "Dev Deepawali" && "The festival of lights of the gods. Millions of earthen lamps are lit on the steps of all ghats of Varanasi. Truly a sight to behold, celebrated on Kartik Poornima."}
                    {selectedEvent.name === "Ganga Aarti Special" && "A spectacular daily ritual where young priests perform a highly choreographed prayer service to Mother Ganga using multi-tiered brass lamps and incense."}
                    {selectedEvent.name === "Sawan Mahotsav" && "A month-long holy celebration dedicated to Lord Shiva inside the Kashi Vishwanath Corridor, filled with bhajans, rudrabhishek, and devotional energy."}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    alert(`Event "${selectedEvent.name}" has been successfully added to your itinerary calendar!`);
                    setSelectedEvent(null);
                  }}
                  className="w-full text-xs font-bold py-2.5 rounded-xl bg-[#C9A227] text-black mt-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  Add to Calendar / शेड्यूल करें
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Itinerary Details Modal */}
      <Dialog open={isItineraryOpen} onOpenChange={setIsItineraryOpen}>
        <DialogContent className="max-w-md bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#C9A227]" />
              Banaras Trip Itinerary
            </DialogTitle>
            <p className="text-xs text-[#8A7450] font-sans">Your Curated 3-Day Varanasi Travel Plan</p>
          </DialogHeader>

          <div className="space-y-3.5 text-left overflow-y-auto max-h-[380px] pr-1" style={{ scrollbarWidth: "none" }}>
            {/* Day 1 */}
            <div className="border border-[#C9A227]/15 bg-[#C9A227]/5 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-[#E8C84A] uppercase tracking-wider">Day 1: Divine Arrival & Ganga Aarti</p>
              <ul className="text-xs text-white/80 mt-2 space-y-1.5 list-disc pl-4">
                <li>Visit the sacred **Kashi Vishwanath Temple** for darshan.</li>
                <li>Enjoy lunch featuring traditional **Kachori Sabzi** at local lanes.</li>
                <li>Attend the breathtaking evening **Ganga Aarti** at Dashashwamedh Ghat.</li>
              </ul>
            </div>

            {/* Day 2 */}
            <div className="border border-[#C9A227]/15 bg-[#C9A227]/5 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-[#E8C84A] uppercase tracking-wider">Day 2: Morning Boat Ride & Buddhist Heritage</p>
              <ul className="text-xs text-white/80 mt-2 space-y-1.5 list-disc pl-4">
                <li>Experience Sunrise **Subah-e-Banaras** boat ride starting from Assi Ghat.</li>
                <li>Explore the ruins and museum at the historical **Sarnath Buddhist Site**.</li>
                <li>Sip the famous sweet **Malaiyyo** or creamy **Blue Lassi** in the afternoon.</li>
              </ul>
            </div>

            {/* Day 3 */}
            <div className="border border-[#C9A227]/15 bg-[#C9A227]/5 rounded-2xl p-3.5">
              <p className="text-xs font-bold text-[#E8C84A] uppercase tracking-wider">Day 3: Heritage Campus & Meditation</p>
              <ul className="text-xs text-white/80 mt-2 space-y-1.5 list-disc pl-4">
                <li>Walk through the green campus of **Banaras Hindu University (BHU)**.</li>
                <li>Visit the modern, massive meditation dome at **Swarved Mahamandir**.</li>
                <li>Shop for classic **Banarasi Silk Sarees** and handlooms.</li>
              </ul>
            </div>

            <button 
              onClick={() => setIsItineraryOpen(false)}
              className="w-full text-xs font-bold py-2.5 rounded-xl bg-[#C9A227] text-black mt-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              Close Itinerary / बंद करें
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#C9A227]" />
              Kashi Notifications
            </DialogTitle>
            <p className="text-xs text-[#8A7450] font-sans">Live alerts and schedules for Kashi explorers</p>
          </DialogHeader>

          <div className="space-y-2.5 text-left">
            {[
              { title: "Dev Deepawali Scheduled", desc: "Dev Deepawali is scheduled on Kartik Poornima. Millions of lamps will light up all 84 ghats. Book your morning boat slots early!", time: "2 hours ago" },
              { title: "Evening Ganga Aarti", desc: "Today's Evening Ganga Aarti ritual at Dashashwamedh Ghat will begin at 6:45 PM. Arrive by 6:00 PM to secure a seating spot.", time: "4 hours ago" },
              { title: "Subah-e-Banaras Weather", desc: "Forecast suggests clear skies tomorrow morning. Excellent time to experience yoga and classical music at Assi Ghat at 5:30 AM.", time: "1 day ago" }
            ].map((n, i) => (
              <div key={i} className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-2xl transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#E8C84A]">{n.title}</span>
                  <span className="text-[9px] text-white/40">{n.time}</span>
                </div>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            ))}

            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full text-xs font-bold py-2.5 rounded-xl bg-[#C9A227] text-black mt-3 transition-all hover:scale-[1.01] cursor-pointer"
            >
              Dismiss All / ठीक है
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Travel Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-3xl bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-0">
          <DialogHeader className="p-4 border-b border-white/5">
            <DialogTitle className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#C9A227]">🎥</span> Discover the Essence of Kashi
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full bg-black">
            {isVideoOpen && (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/z1gK411l0Uo?autoplay=1"
                title="Varanasi Travel Guide & Ganga Aarti"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Floating Action Compass Trigger (Module 6) - shifted up on mobile to clear the bottom nav bar */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
        
        {/* Expanded menu dock */}
        <AnimatePresence>
          {showQuickDock && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="flex flex-col gap-2 bg-[#0d0a06]/95 border border-[#C9A227]/30 p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto text-left"
            >
              {[
                { label: "🛕 Spiritual Walk", path: "/map?focus=kashi-vishwanath" },
                { label: "🍛 Food Trail", path: "/foods" },
                { label: "🚤 Boat Rides", path: "/attractions" },
                { label: "📖 AI Guide", path: "/ai-assistant" },
                { label: "📸 Add Memory", path: "/wishlist" },
              ].map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(act.path);
                    setShowQuickDock(false);
                  }}
                  className="flex items-center justify-between gap-3 text-[10.5px] font-bold text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-[#C9A227]/10 active:scale-95 transition-all text-left cursor-pointer w-[140px]"
                >
                  <span>{act.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]/70" />
                </button>
              ))}
              
              <button
                onClick={() => {
                  setShowEmergencyModal(true);
                  setShowQuickDock(false);
                }}
                className="flex items-center justify-between gap-3 text-[10.5px] font-extrabold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-left cursor-pointer w-[140px]"
              >
                <span>🚨 Emergency</span>
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The main floating compass button */}
        <button
          onClick={() => setShowQuickDock(prev => !prev)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto border border-[#C9A227]/40 relative"
          style={{ boxShadow: "0 4px 20px rgba(201,162,39,0.35)" }}
        >
          <Compass className={`w-6 h-6 transition-transform duration-500 ${showQuickDock ? 'rotate-180 text-black' : 'text-black'}`} />
          <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-black animate-pulse" />
        </button>

      </div>

      {/* Emergency Hotline Helpline Numbers Modal */}
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent className="max-w-md bg-[#0f0a05]/95 backdrop-blur-xl border border-red-500/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-serif text-xl font-bold text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
              Emergency Helplines & Support
            </DialogTitle>
            <p className="text-xs text-muted-foreground">Immediate tourist guidelines, police support, and medical channels for Varanasi.</p>
          </DialogHeader>

          <div className="space-y-3 text-left">
            <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-2xl space-y-1.5">
              <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-widest block">Local Police & Helpline</span>
              <p className="text-sm font-bold text-white font-mono">🚨 Call 112 (National Emergency Support)</p>
              <p className="text-xs text-white/70">Varanasi Tourist Police Cell: <span className="font-mono font-semibold">+91-542-2502236</span></p>
            </div>
            
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
              <span className="text-[10px] text-[#C9A227] font-bold uppercase tracking-widest block">Medical & Ambulance</span>
              <p className="text-sm font-bold text-white font-mono"> Ambulances Call 108 / 102 (National Ambulance)</p>
              <p className="text-xs text-white/70">Apex Hospital Varanasi: <span className="font-mono font-semibold">+91-542-2390035</span></p>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
              <span className="text-[10px] text-[#C9A227] font-bold uppercase tracking-widest block">Varanasi Helpline Centre</span>
              <p className="text-xs text-white/70">Tourist Help Plaza Godowlia: <span className="font-mono font-semibold">1800-180-5022</span></p>
            </div>

            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="w-full text-xs font-bold py-2.5 rounded-xl bg-red-500 text-white mt-3 transition-all hover:bg-red-600 cursor-pointer shadow-lg shadow-red-500/10"
            >
              Close Emergency Window
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function DashboardWishlistButton({ item, itemType }: { item: any; itemType: string }) {
  const isSaved = useIsWishlisted(item.id, itemType);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: item.id,
      title: item.name,
      itemType: itemType,
      imageUrl: item.image
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <Bookmark
        className="w-3 h-3"
        style={{
          color: isSaved ? "#C9A227" : "#FFFFFF",
          fill: isSaved ? "#C9A227" : "none"
        }}
      />
    </button>
  );
}
