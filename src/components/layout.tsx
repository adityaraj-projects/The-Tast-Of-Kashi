import { ReactNode, useState, useEffect, lazy, Suspense } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  Landmark,
  Store,
  BookOpen,
  MapPin,
  Bot,
  Users,
  Flame,
  Settings,
  Bell,
  CloudSun,
  Navigation,
  Bookmark,
  Moon,
  Sun,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "./SearchBar";
const HistoryDialog = lazy(() => import("./HistoryDialog").then(module => ({ default: module.HistoryDialog })));
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LayoutProps {
  children: ReactNode;
}

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/foods", label: "Explore Foods", icon: Utensils },
  { href: "/attractions", label: "Attractions", icon: Landmark },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/events", label: "Events & Aarti", icon: Flame },
  { href: "/map", label: "Map Explorer", icon: MapPin },
  { href: "/wishlist", label: "My Journeys", icon: Navigation },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot, badge: "NEW" },
  { href: "/community", label: "Community", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/foods", label: "Foods", icon: Utensils },
  { href: "/attractions", label: "Attractions", icon: Landmark },
  { href: "/ai-assistant", label: "AI Guide", icon: Bot },
  { href: "/wishlist", label: "Journeys", icon: Navigation },
];

const SEARCHABLE_ITEMS = [
  { name: "Kashi Vishwanath Temple", image: "/images/kashi-vishwanath.png" },
  { name: "Assi Ghat", image: "/images/evening-ghats.png" },
  { name: "Sarnath", image: "/images/sarnath.png" },
  { name: "Dashashwamedh Ghat", image: "/images/ganga-aarti.png" },
  { name: "BHU Campus", image: "/images/ghats-night.png" },
  { name: "Kaal Bhairav Temple", image: "/images/kaal-bhairav.png" },
  { name: "Manikarnika Ghat", image: "/images/manikarnika-ghat.png" },
  { name: "Ramnagar Fort", image: "/images/ramnagar-fort.png" },
  { name: "Swarved Mahamandir", image: "/images/swarved-mahamandir.png" },
  { name: "Tamatar Chaat", image: "/images/tamatar-chaat.png" },
  { name: "Malaiyyo", image: "/images/malaiyoo.png" },
  { name: "Banarasi Lassi", image: "/images/banarasi-lassi.png" },
  { name: "Kachori Sabzi", image: "/images/kachori-sabji.png" },
  { name: "Rabri Jalebi", image: "/images/jalebi-imarti.png" },
  { name: "Banarasi Paan", image: "/images/banarasi-paan.png" },
];

export function SidebarContent({
  onClose,
  temp,
  theme,
  toggleTheme,
  setIsWeatherOpen,
  navigate
}: {
  onClose?: () => void;
  temp: number | null;
  theme: string;
  toggleTheme: () => void;
  setIsWeatherOpen: (open: boolean) => void;
  navigate: (url: string) => void;
}) {
  const [location] = useLocation();

  return (
    <div
      className="flex-1 flex flex-col h-full relative overflow-hidden"
      style={{
        background: "var(--app-sidebar-bg)",
      }}
    >
      {/* Subtle warm glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% -10%, rgba(201,162,39,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="px-4 pt-5 pb-3 relative z-10">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => onClose?.()}>
          <img
            src="/images/logo.png"
            alt="The Taste of Kashi"
            className="w-11 h-11 object-contain flex-shrink-0"
            style={{ filter: "drop-shadow(0 0 8px rgba(201,162,39,0.35))" }}
          />
          <div>
            <p className="text-[9px] text-[#8A7450] tracking-[0.15em] uppercase font-medium leading-none mb-0.5">
              The Taste of
            </p>
            <h1
              className="font-serif text-[20px] font-bold leading-none tracking-wide"
              style={{
                background: "linear-gradient(135deg, #E8C84A 0%, #C9A227 40%, #A07820 80%, #C9A227 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kashi
            </h1>
            <p className="text-[9px] text-[#6B5D3A] font-hindi leading-none mt-0.5">
              हर स्वाद, एक कहानी
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-0.5 relative z-10">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive ? "text-[#C9A227]" : "text-[#5A4D38] hover:text-[#A08848]"
                }`}
              style={
                isActive
                  ? {
                    background:
                      "linear-gradient(90deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)",
                    borderLeft: "2px solid rgba(201,162,39,0.7)",
                    boxShadow: "inset 0 0 12px rgba(201,162,39,0.06)",
                  }
                  : {}
              }
            >
              <Icon
                style={{ width: 16, height: 16, flexShrink: 0 }}
                className={isActive ? "text-[#C9A227]" : "text-[#4A3D28] group-hover:text-[#C9A227]"}
              />
              <span className="text-[12.5px] font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[8px] bg-[#E8750A] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Kashi Experience Card */}
      <div className="p-3 pb-5 relative z-10">
        <div className="relative h-[140px] rounded-2xl overflow-hidden cursor-pointer group">
          <img
            src="/images/evening-ghats.png"
            alt="Kashi Experience"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,3,1,0.97) 0%, rgba(5,3,1,0.65) 50%, rgba(5,3,1,0.15) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{
                background: "linear-gradient(90deg, #E8C84A, #C9A227)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kashi Experience
            </p>
            <p className="text-white/70 text-[10px] leading-tight mb-2">
              Curated experiences just for you
            </p>
            <button
              className="w-full text-[11px] font-semibold rounded-lg py-1.5 transition-all"
              style={{
                background: "linear-gradient(90deg, #C9A227 0%, #A07820 100%)",
                color: "#0A0700",
                boxShadow: "0 2px 12px rgba(201,162,39,0.25)",
              }}
            >
              Plan My Trip →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  temp,
  theme,
  toggleTheme,
  setIsWeatherOpen,
  navigate
}: {
  temp: number | null;
  theme: string;
  toggleTheme: () => void;
  setIsWeatherOpen: (open: boolean) => void;
  navigate: (url: string) => void;
}) {
  return (
    <aside
      className="hidden lg:flex w-[200px] flex-shrink-0 flex-col h-screen relative overflow-hidden"
      style={{
        borderRight: "1px solid rgba(201,162,39,0.10)",
      }}
    >
      <SidebarContent
        temp={temp}
        theme={theme}
        toggleTheme={toggleTheme}
        setIsWeatherOpen={setIsWeatherOpen}
        navigate={navigate}
      />
    </aside>
  );
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("kashi_theme") || "dark");

  const [temp, setTemp] = useState<number | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [weatherCode, setWeatherCode] = useState<number>(0);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);


  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  // Fetch live weather data for Varanasi/Banaras via Open-Meteo API
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
      .catch(err => {
        console.error("Failed to fetch Kashi live weather", err);
        setTemp(32); // Fallback standard
      });
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

  const headerContent = (
    <header
      className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 ${
        location === "/" ? "absolute top-0 left-0 right-0 z-30 bg-transparent border-b-0 pointer-events-none" : "border-b"
      }`}
      style={location === "/" ? {} : {
        background: "var(--app-header-bg)",
        borderColor: "var(--app-card-border)",
      }}
    >
      {/* Hamburger toggle button on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-[#C9A227] transition-colors cursor-pointer pointer-events-auto"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar */}
      {location !== "/" && (
        <SearchBar className="max-w-[160px] sm:max-w-md" />
      )}

      {location !== "/" && (
        <div className="flex items-center gap-1.5 md:gap-2 ml-auto">
          {/* Weather widget */}
          <div
            onClick={() => setIsWeatherOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer hover:bg-white/5 transition-colors border"
            style={{ borderColor: "rgba(201,162,39,0.1)" }}
          >
            <CloudSun className="w-3.5 h-3.5 text-[#C9A227]" />
            <div className="leading-none text-left">
              <p className="text-[10px] sm:text-xs font-semibold leading-none">{temp !== null ? `${temp}°C` : "32°C"}</p>
              <p className="hidden sm:block text-[9px] sm:text-[10px] text-[#5A4D38] leading-none mt-0.5">Banaras, UP</p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity relative cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.1)" }}
          >
            <Bell className="w-3.5 h-3.5 text-[#7A6A4A]" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#E8750A] rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none shadow-sm">3</span>
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center hover:opacity-80 transition-opacity"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.1)" }}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
          </button>

          <button
            onClick={toggleTheme}
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.1)" }}
          >
            {theme === "light" ? (
              <Sun className="w-3.5 h-3.5 text-[#C9A227]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#7A6A4A]" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.1)" }}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="hidden md:block leading-none text-left">
              <p className="text-[9px] text-[#5A4D38]">Namaste, Aditya</p>
              <p className="text-[11px] font-semibold text-foreground">Explorer</p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#5A4D38] hidden sm:block" />
          </div>
        </div>
      )}
    </header>
  );

  return (
    <div className="flex h-screen text-foreground overflow-hidden" style={{ background: "var(--app-bg)" }}>
      {/* Desktop Sidebar */}
      <Sidebar
        temp={temp}
        theme={theme}
        toggleTheme={toggleTheme}
        setIsWeatherOpen={setIsWeatherOpen}
        navigate={navigate}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 lg:hidden"
            />
            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-[240px] flex lg:hidden shadow-2xl"
              style={{
                borderRight: "1px solid rgba(201,162,39,0.15)",
              }}
            >
              <SidebarContent
                onClose={() => setIsMobileMenuOpen(false)}
                temp={temp}
                theme={theme}
                toggleTheme={toggleTheme}
                setIsWeatherOpen={setIsWeatherOpen}
                navigate={navigate}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative">
        {location !== "/" && headerContent}
        <main className="flex-1 overflow-y-auto relative pb-16 lg:pb-0">
          {location === "/" && headerContent}
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-[#0E0A03]/90 backdrop-blur-lg border-t border-[#C9A227]/10 flex items-center justify-around z-40 px-2 pb-safe" style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.4)" }}>
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all duration-200 cursor-pointer ${
                isActive ? "text-[#C9A227]" : "text-[#5A4D38] hover:text-[#A08848]"
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              <span className="text-[10px] mt-1 font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
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
            <p className="text-xs text-[#8A7450] leading-relaxed mt-2 italic bg-[#C9A227]/5 p-2 rounded-lg border border-[#C9A227]/10 text-left">
              💡 **Guide Advice**: {getWeatherDesc(weatherCode).tip}
            </p>
          </div>

          {/* 5-Day Forecast list */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227]/80 text-left">5-Day Climate Outlook</h4>
            <div className="divide-y divide-[#C9A227]/10">
              {weatherForecast.map((f, i) => {
                const dayInfo = getWeatherDesc(f.code);
                const DayIcon = dayInfo.icon;
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-xs font-semibold text-white/80 w-[95px] text-left">{f.date}</span>
                    <div className="flex items-center gap-2 flex-1 justify-start ml-2 text-left">
                      <DayIcon className="w-4 h-4" style={{ color: dayInfo.color }} />
                      <span className="text-xs text-white/60 truncate max-w-[130px]">{dayInfo.label.split(" / ")[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-[#C9A227]">{f.max}°C / {f.min}°C</span>
                  </div>
                );
              })}
              {weatherForecast.length === 0 && (
                <p className="text-xs text-muted-foreground py-3 text-center">Loading forecast data...</p>
              )}
            </div>
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

      <Suspense fallback={null}>
        <HistoryDialog />
      </Suspense>
    </div>
  );
}
