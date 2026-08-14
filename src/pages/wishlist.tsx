import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useGetWishlist } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Trash2, Calendar, MapPin, DollarSign, Users, Car, 
  Compass, Clock, Sparkles, Download, Share2, Save, Camera, 
  Plus, CheckCircle, Navigation, Info, TrendingUp, BookOpen,
  Award, Shield, CalendarDays, SlidersHorizontal, Sun, Maximize2,
  AlertTriangle, Check, Eye
} from "lucide-react";
import { Link } from "wouter";

type ActiveTabType = "planner" | "journey" | "wishlist";
type JourneySubTab = "passport" | "timeline" | "gallery" | "expenses";

interface TimelineItem {
  timeOfDay: string;
  title: string;
  location: string;
  desc: string;
  duration: string;
  cost: string;
  image: string;
}

interface Itinerary {
  time: string;
  style: string;
  budget: string;
  timeline: TimelineItem[];
}

interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  gps: string;
  mood: string;
  category: string;
  diaryNotes: string;
}

const MOCK_ITINERARY_TEMPLATES: Record<string, TimelineItem[]> = {
  spiritual: [
    { timeOfDay: "05:00 AM", title: "Morning Subah-e-Banaras", location: "Assi Ghat", desc: "Witness Vedic chants, morning ganga aarti, and classical music recital under sunrise skies.", duration: "2 hours", cost: "Free / ₹0", image: "/images/assi-ghat-aarti.jpg" },
    { timeOfDay: "08:30 AM", title: "Breakfast Kachori Sabzi", location: "Ram Bhandar", desc: "Savor Varanasi's legendary morning kachoris with spicy potato curry and warm sweets.", duration: "1 hour", cost: "₹100 per person", image: "/images/kachori-sabji.png" },
    { timeOfDay: "10:00 AM", title: "Jyotirlinga Darshan", location: "Kashi Vishwanath Temple", desc: "Explore the new corridor gates and seek blessings at the sacred Lord Shiva shrine.", duration: "2.5 hours", cost: "Free / ₹250 VIP pass", image: "/images/kashi-vishwanath-aerial.jpg" },
    { timeOfDay: "05:30 PM", title: "Grand Evening Ganga Aarti", location: "Dashashwamedh Ghat", desc: "Secure a wooden boat seat to observe the synchronized brass fire lamp rituals.", duration: "2 hours", cost: "₹300 boat ride", image: "/images/dashashwamedh-ghat-aarti.jpg" }
  ],
  foodie: [
    { timeOfDay: "08:00 AM", title: "Kachori & Jalebi Breakfast", location: "Chachi Ki Kachori", desc: "Enjoy hot fluffed kachoris fried in pure ghee, topped with crispy sweet jalebis.", duration: "1.5 hours", cost: "₹80", image: "/images/kachori-sabji.png" },
    { timeOfDay: "01:00 PM", title: "Midday Banarasi Cream Lassi", location: "Blue Lassi Shop", desc: "Taste thick hand-churned fruit yogurt lassi served in authentic clay cups (kulhads).", duration: "1 hour", cost: "₹90", image: "/images/banarasi-lassi.png" },
    { timeOfDay: "04:30 PM", title: "Spicy Tamatar Chaat Delight", location: "Kashi Chaat Bhandar", desc: "Treat yourself to local tomato chaat topped with cumin syrup and ghee.", duration: "1 hour", cost: "₹70", image: "/images/tamatar-chaat.png" },
    { timeOfDay: "08:00 PM", title: "Ethereal Malaiyyo Froth Sweet", location: "Chowk Street Vendors", desc: "Indulge in Kashi's light saffron-milk dessert condensed under winter night dew.", duration: "1 hour", cost: "₹80", image: "/images/malaiyoo.png" }
  ],
  heritage: [
    { timeOfDay: "09:00 AM", title: "Ancient Buddhist Stupa Walk", location: "Sarnath Deer Park", desc: "Walk around the massive Dhamek Stupa where Buddha gave his first sermon 2500 years ago.", duration: "3 hours", cost: "₹50 ticket", image: "/images/sarnath.png" },
    { timeOfDay: "01:30 PM", title: "Mughal & Rajput Sandstone Palace", location: "Ramnagar Fort", desc: "Browse through royal vintage cars, palanquins, weapons, and the 1852 astronomical clock.", duration: "2 hours", cost: "₹150 ticket", image: "/images/ramnagar-fort.png" },
    { timeOfDay: "04:30 PM", title: "Birla Temple & BHU Green Campus", location: "Banaras Hindu University", desc: "Visit Asia's largest residential campus and the world's tallest temple dome.", duration: "2 hours", cost: "Free / ₹0", image: "/images/ghats-night.png" }
  ]
};

export default function Wishlist() {
  const { data: wishlistItems, isLoading } = useGetWishlist();
  const [activeTab, setActiveTab] = useState<ActiveTabType>("planner");
  const [subTab, setSubTab] = useState<JourneySubTab>("passport");

  // Planner inputs
  const [budgetLevel, setBudgetLevel] = useState<"low" | "mid" | "premium">("mid");
  const [availableTime, setAvailableTime] = useState("1d");
  const [travelStyle, setTravelStyle] = useState("spiritual");
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Expenses State
  const [expenses, setExpenses] = useState<Array<{ id: string; desc: string; amount: number; category: string }>>(() => {
    const stored = localStorage.getItem("kashi_expenses");
    return stored ? JSON.parse(stored) : [
      { id: "e1", desc: "Boat ride at Assi Ghat", amount: 300, category: "Transport" },
      { id: "e2", desc: "Tamatar Chaat at Kashi Chaat", amount: 80, category: "Food" },
      { id: "e3", desc: "Prasad at Vishwanath Corridor", amount: 200, category: "Spiritual" }
    ];
  });

  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCat, setNewExpCat] = useState("Food");

  // Memories & Timeline State
  const [memories, setMemories] = useState<MemoryPhoto[]>(() => {
    const stored = localStorage.getItem("kashi_memories");
    return stored ? JSON.parse(stored) : [
      {
        id: "m1",
        title: "Subah-e-Banaras Vibe",
        date: "2026-07-18",
        time: "05:45 AM",
        location: "Assi Ghat steps",
        image: "/images/assi-ghat-aarti.jpg",
        gps: "25.2980° N, 83.0084° E",
        mood: "Spiritual",
        category: "Sunrise",
        diaryNotes: "Aaj pehli baar sunrise ke samay ganga aarti ki sound suni. Waking up early was totally worth it!"
      },
      {
        id: "m2",
        title: "Malaiyyo in Winter Lanes",
        date: "2026-07-20",
        time: "09:30 AM",
        location: "Chowk lanes",
        image: "/images/malaiyoo.png",
        gps: "25.3122° N, 83.0104° E",
        mood: "Excited",
        category: "Food",
        diaryNotes: "The sweet froth dissolves like light air. Combined with pistachios, it is the best dessert in Varanasi!"
      }
    ];
  });

  // Mock Camera States
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedMockImage, setCapturedMockImage] = useState<string | null>(null);
  
  // Camera inputs
  const [capCaption, setCapCaption] = useState("");
  const [capLocation, setCapLocation] = useState("Assi Ghat");
  const [capCategory, setCapCategory] = useState("Sunrise");
  const [capMood, setCapMood] = useState("Peaceful");
  const [capDiary, setCapDiary] = useState("");

  // AI Photo Recognizer States
  const [scannerImage, setScannerImage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Gallery Filters
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [gallerySearch, setGallerySearch] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Save changes helper
  const saveMemories = (updated: MemoryPhoto[]) => {
    setMemories(updated);
    localStorage.setItem("kashi_memories", JSON.stringify(updated));
  };

  // Generate Itinerary
  const generateTrip = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const template = MOCK_ITINERARY_TEMPLATES[travelStyle] || MOCK_ITINERARY_TEMPLATES.spiritual;
      const budgetLabel = budgetLevel === "low" ? "₹500 - ₹1,000" : budgetLevel === "mid" ? "₹1,500 - ₹3,000" : "₹5,000+ Premium Luxe";
      
      setGeneratedItinerary({
        time: availableTime === "3h" ? "3 Hours Quick Tour" : availableTime === "1d" ? "1-Day Full Walk" : availableTime === "2d" ? "2-Day Explore" : "3-Day In-depth Journey",
        style: travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1) + " Route",
        budget: budgetLabel,
        timeline: template
      });
      setIsGenerating(false);
    }, 1000);
  };

  const downloadItinerary = () => {
    if (!generatedItinerary) return;
    const content = `THE TASTE OF KASHI - AI SPIRITUAL ITINERARY\n` +
      `==========================================\n` +
      `Timeframe: ${generatedItinerary.time}\n` +
      `Style: ${generatedItinerary.style}\n` +
      `Budget Level: ${generatedItinerary.budget}\n\n` +
      `SCHEDULE DETAILS:\n` +
      generatedItinerary.timeline.map(t => `- ${t.timeOfDay} at ${t.location}: ${t.title} (${t.desc})`).join("\n");
      
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Kashi_AI_Itinerary_${travelStyle}.txt`;
    link.click();
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc.trim() || !newExpAmount) return;
    const amt = parseFloat(newExpAmount);
    if (isNaN(amt)) return;

    const newExp = {
      id: "exp_" + Date.now(),
      desc: newExpDesc,
      amount: amt,
      category: newExpCat
    };

    const updated = [...expenses, newExp];
    setExpenses(updated);
    localStorage.setItem("kashi_expenses", JSON.stringify(updated));
    
    setNewExpDesc("");
    setNewExpAmount("");
  };

  // Delete Expense
  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem("kashi_expenses", JSON.stringify(updated));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Mock Camera functions
  const openMockCamera = () => {
    if (hasCameraAccess === true) {
      setIsCameraActive(true);
    } else {
      setShowPermissionModal(true);
    }
  };

  const grantPermission = () => {
    setHasCameraAccess(true);
    setShowPermissionModal(false);
    setIsCameraActive(true);
  };

  const triggerMockShutter = () => {
    // Choose random premium Varanasi imagery
    const capPresets = [
      "/images/kashi-vishwanath-aerial.jpg",
      "/images/tamatar-chaat.png",
      "/images/assi-ghat-aarti.jpg"
    ];
    const chosen = capPresets[Math.floor(Math.random() * capPresets.length)];
    setCapturedMockImage(chosen);
  };

  const handleSaveCapturedMemory = () => {
    if (!capturedMockImage || !capCaption.trim()) return;

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newMem: MemoryPhoto = {
      id: "mem_" + Date.now(),
      title: capCaption.trim(),
      date: formattedDate,
      time: formattedTime,
      location: capLocation,
      image: capturedMockImage,
      gps: "25.3176° N, 83.0062° E",
      mood: capMood,
      category: capCategory,
      diaryNotes: capDiary.trim() || "Logged a memorable moment in Banaras!"
    };

    saveMemories([newMem, ...memories]);
    
    // Reset camera form
    setCapturedMockImage(null);
    setIsCameraActive(false);
    setCapCaption("");
    setCapDiary("");
  };

  // Mock AI Photo Identification Scanner
  const triggerAIScan = () => {
    if (!scannerImage) return;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      if (scannerImage.includes("tamatar")) {
        setScanResult({
          name: "Tamatar Chaat (Spicy Tomato Hash)",
          era: "Authentic local Banaras recipe",
          history: "Varanasi's custom specialty. Prepared using boiled potatoes, fresh tomatoes, coriander spices, and sweet sugar syrup cooked in hot pure ghee.",
          tips: "Try it served piping hot in direct earthen clay pots (dona).",
          mapLink: "/foods"
        });
      } else if (scannerImage.includes("vishwanath") || scannerImage.includes("kashi-vishwanath")) {
        setScanResult({
          name: "Kashi Vishwanath Corridor Gate",
          era: "18th Century Jyotirlinga (modernized 2021)",
          history: "One of the twelve sacred jyotirlingas of Lord Shiva. The golden dome was originally coated using over 800 kg of pure gold donated by Maharaja Ranjit Singh.",
          tips: "Walk through Corridor Gate 4 directly from riverfront exit gates.",
          mapLink: "/map?focus=kashi-vishwanath"
        });
      } else {
        setScanResult({
          name: "Dashashwamedh Ghat Riverfront",
          era: "Ancient river bank steps",
          history: "Where Lord Brahma performed ten grand Ashwamedha sacrifices. Host to the daily synchronized evening Ganga Aarti prayer celebrations.",
          tips: "Rent a small wooden boat from Assi jetty before 5:30 PM for clean sightlines.",
          mapLink: "/map?focus=dashashwamedh-ghat"
        });
      }
    }, 1500);
  };

  const filteredMemories = memories.filter(m => {
    const matchCat = galleryCategory === "All" || m.category === galleryCategory;
    const matchSearch = m.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                        m.location.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                        m.diaryNotes.toLowerCase().includes(gallerySearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen text-left">
        
        {/* Page Header */}
        <div className="mb-8 text-left">
          <h1 className="font-serif text-4xl font-bold mb-2 text-white">My Journeys</h1>
          <p className="text-muted-foreground text-sm">Organize your itineraries, logs, memory vaults, and travel statistics.</p>
        </div>

        {/* Top-Level Tabs Navigation */}
        <div className="flex border-b border-white/5 mb-8 gap-6 justify-start text-left overflow-x-auto scrollbar-none">
          {[
            { id: "planner", label: "🗺️ AI Planner & Routes" },
            { id: "journey", label: "🛄 Passport & Timeline" },
            { id: "wishlist", label: "❤️ Saved Wishlist" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTabType)}
              className={`pb-4 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-[#C9A227] text-[#C9A227]" 
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* AI ITINERARY PLANNER TAB */}
          {activeTab === "planner" && (
            <motion.div 
              key="planner" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column Controls */}
              <div className="lg:col-span-1 bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-6 text-left h-fit">
                <h3 className="font-serif text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Input Planner Options
                </h3>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Available Duration</label>
                    <select 
                      value={availableTime} 
                      onChange={(e) => setAvailableTime(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 text-white px-3 py-2.5 rounded-xl text-xs outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="3h" className="bg-[#0f0a05]">3 Hours (Quick Layover)</option>
                      <option value="1d" className="bg-[#0f0a05]">1 Day (Ghat Walk & Aarti)</option>
                      <option value="2d" className="bg-[#0f0a05]">2 Days (Heritage Tour)</option>
                      <option value="3d" className="bg-[#0f0a05]">3 Days (Full Exploration)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Travel Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "spiritual", label: "🛕 Devout" },
                        { id: "foodie", label: "🍛 Gourmet" },
                        { id: "heritage", label: "🏛️ Ancient" }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setTravelStyle(style.id)}
                          className={`py-2 px-1 text-[10px] font-bold border rounded-xl transition-all cursor-pointer ${
                            travelStyle === style.id 
                              ? "bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]" 
                              : "bg-black/25 border-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Budget Type</label>
                    <div className="flex gap-2">
                      {[
                        { id: "low", label: "Economic" },
                        { id: "mid", label: "Mid Range" },
                        { id: "premium", label: "Luxe Gold" }
                      ].map((budget) => (
                        <button
                          key={budget.id}
                          onClick={() => setBudgetLevel(budget.id as any)}
                          className={`flex-1 py-2 text-[10px] font-bold border rounded-xl transition-all cursor-pointer ${
                            budgetLevel === budget.id
                              ? "bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227]" 
                              : "bg-black/25 border-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {budget.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={generateTrip}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold text-xs rounded-xl shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    {isGenerating ? "Generating Route..." : "🛠️ Create Spiritual Route"}
                  </button>
                </div>
              </div>

              {/* Right Column Output Display */}
              <div className="lg:col-span-2">
                {generatedItinerary ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-6 space-y-6 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 flex-wrap gap-3">
                      <div>
                        <h4 className="font-serif text-2xl font-bold text-white leading-tight">
                          Your Kashi AI Schedule
                        </h4>
                        <span className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider block mt-1">
                          {generatedItinerary.time} • {generatedItinerary.style}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={downloadItinerary}
                          className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white cursor-pointer active:scale-95 transition-all"
                          title="Download TXT Schedule"
                        >
                          <Download className="w-4 h-4 text-[#C9A227]" />
                        </button>
                        <button 
                          onClick={() => alert("Itinerary shared successfully!")}
                          className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white cursor-pointer active:scale-95 transition-all"
                          title="Share Schedule"
                        >
                          <Share2 className="w-4 h-4 text-[#C9A227]" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {generatedItinerary.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start group">
                          <div className="text-right w-16 shrink-0 pt-1">
                            <span className="text-[10px] font-bold text-[#C9A227] font-mono block leading-none">{item.timeOfDay}</span>
                            <span className="text-[8px] text-white/40 block mt-0.5">{item.duration}</span>
                          </div>
                          
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227]/80 mt-2 shrink-0 group-hover:scale-125 transition-transform" />

                          <div className="flex-1 bg-black/25 border border-white/5 rounded-2xl p-4 flex gap-4 flex-col sm:flex-row text-left">
                            <div className="w-full sm:w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-black/10">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="font-serif text-sm font-bold text-white">{item.title}</h5>
                              <p className="text-[11px] text-white/70 leading-relaxed">{item.desc}</p>
                              <div className="flex gap-3 text-[9px] text-[#C9A227]/80 pt-1">
                                <span>📍 {item.location}</span>
                                <span>•</span>
                                <span>💰 {item.cost}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                ) : (
                  <div className="text-center py-24 bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl">
                    <Compass className="w-12 h-12 text-[#C9A227]/40 mx-auto mb-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                    <h3 className="font-serif text-xl font-bold text-white mb-1.5">No Spiritual Route Generated</h3>
                    <p className="text-muted-foreground text-xs max-w-sm mx-auto">Select your timing, style, and budget preferences in the left panel to build a personalized timeline.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* MY JOURNEYS & SUB-TABS VAULT */}
          {activeTab === "journey" && (
            <motion.div
              key="journey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              
              {/* Internal Sub-Tabs selection bar */}
              <div className="flex gap-2 p-1.5 bg-black/45 border border-white/5 rounded-2xl w-fit overflow-x-auto scrollbar-none max-w-full">
                {[
                  { id: "passport", label: "🛡️ Passport & Heatmap" },
                  { id: "timeline", label: "⏳ Memory Timeline" },
                  { id: "gallery", label: "📸 Camera & Scanner" },
                  { id: "expenses", label: "💰 Travel Ledger" }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSubTab(st.id as JourneySubTab)}
                    className={`px-4 py-2 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                      subTab === st.id 
                        ? "bg-[#C9A227] text-black shadow-md shadow-[#C9A227]/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Dynamic sub-tab content switcher panels */}
              <AnimatePresence mode="wait">
                
                {/* 1. DIGITAL PASSPORT & HEATMAP SUB-TAB */}
                {subTab === "passport" && (
                  <motion.div
                    key="passport"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
                  >
                    
                    {/* Left Column: Digital Passport certificate card */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0d0a06] via-[#141009] to-[#0d0a06] border-2 border-[#D4AF37]/35 shadow-2xl overflow-hidden">
                        
                        {/* Certificate background watermarks */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <Award className="w-56 h-56 text-[#D4AF37]" />
                        </div>

                        <div className="flex justify-between items-start border-b border-[#D4AF37]/15 pb-4 mb-5">
                          <div>
                            <span className="text-[8px] tracking-[0.2em] font-bold text-[#D4AF37] uppercase block">Kingdom of Varanasi</span>
                            <h4 className="font-serif text-lg font-bold text-white mt-0.5">Kashi Digital Passport</h4>
                          </div>
                          <Shield className="w-7 h-7 text-[#D4AF37] opacity-80" />
                        </div>

                        {/* User Profile info */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37]/40 overflow-hidden bg-black flex-shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-muted-foreground block">Holder Name</span>
                            <h5 className="font-bold text-white text-base leading-tight">Aditya Roy</h5>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] mt-1 inline-block">Explorer Rank: Lvl 4 Corridor Sage</span>
                          </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="space-y-1.5 mb-6 text-left">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/60">Experience Metrics</span>
                            <span className="font-bold text-[#D4AF37]">1,420 / 2,000 XP</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D27A] rounded-full" style={{ width: "71%" }} />
                          </div>
                        </div>

                        {/* Stat badges */}
                        <div className="grid grid-cols-2 gap-3.5 border-t border-white/5 pt-5 text-left text-xs">
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Temples Visited</span>
                            <span className="font-bold text-white">4 / 12 sacred sites</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Foods Tasted</span>
                            <span className="font-bold text-white">6 / 15 delicacies</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Boat Rides</span>
                            <span className="font-bold text-white">2 / 5 crossings</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block">Memories Logged</span>
                            <span className="font-bold text-white">{memories.length} snaps loaded</span>
                          </div>
                        </div>

                      </div>

                      {/* Achievements items */}
                      <div className="p-5 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
                          <Award className="w-4 h-4 text-[#C9A227]" />
                          <span className="font-serif font-bold text-xs text-white">Earned Badges & Achievements</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { title: "First Temple", icon: "🏅", unlocked: true },
                            { title: "Food Explorer", icon: "🍛", unlocked: true },
                            { title: "Ghat Runner", icon: "🛶", unlocked: true },
                            { title: "Heritage Fan", icon: "🏛️", unlocked: false },
                            { title: "Night Walk", icon: "🌙", unlocked: true },
                            { title: "Fest Hunter", icon: "🔥", unlocked: false }
                          ].map((ac, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1 relative ${
                                ac.unlocked 
                                  ? "bg-[#C9A227]/5 border-[#C9A227]/25 text-white" 
                                  : "bg-black/20 border-white/5 text-white/40"
                              }`}
                            >
                              <span className="text-xl leading-none">{ac.icon}</span>
                              <span className="text-[8px] font-bold leading-tight block">{ac.title}</span>
                              {ac.unlocked && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-black flex items-center justify-center text-[7px] text-white">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Kashi Map Heatmap */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <div className="p-5 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3 flex-wrap gap-2 text-left">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] block">Varanasi Footprint</span>
                            <h4 className="font-serif text-sm font-bold text-white">Interactive Kashi Heatmap</h4>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227]">Gold regions indicate explored zones</span>
                        </div>

                        {/* Custom Stylised Kashi Map SVG */}
                        <div className="relative h-[280px] bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
                          
                          {/* River Ganges path layout */}
                          <svg className="w-full h-full text-left" viewBox="0 0 500 300" fill="none">
                            {/* Curved River Blue/Gold Path */}
                            <path 
                              d="M -10,150 C 150,150 250,50 350,220 C 420,300 480,240 520,200" 
                              stroke="rgba(212,175,55,0.2)" 
                              strokeWidth="24" 
                              strokeLinecap="round" 
                            />
                            <path 
                              d="M -10,150 C 150,150 250,50 350,220 C 420,300 480,240 520,200" 
                              stroke="rgba(212,175,55,0.08)" 
                              strokeWidth="36" 
                              strokeLinecap="round" 
                            />

                            {/* Node Points: Visited glow gold, unvisited gray */}
                            {/* Node 1: Sarnath (Unvisited) */}
                            <g transform="translate(180, 40)" className="cursor-pointer group" onClick={() => alert("Sarnath: Unvisited. Plan a Buddhist Heritage Walk to unlock! (+120 XP)")}>
                              <circle r="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                              <circle r="5" fill="#555" />
                              <text y="-18" className="text-[9px] font-bold fill-white/50 text-center" textAnchor="middle">🏛️ Sarnath</text>
                            </g>

                            {/* Node 2: Kashi Vishwanath Corridor (Visited) */}
                            <g transform="translate(240, 110)" className="cursor-pointer group" onClick={() => alert("Kashi Vishwanath Corridor: Visited 3 times! Unlocked: First Temple badge.")}>
                              <circle r="16" fill="rgba(212,175,55,0.15)" className="animate-ping" style={{ animationDuration: "3s" }} />
                              <circle r="10" fill="rgba(212,175,55,0.3)" stroke="#C9A227" strokeWidth="1.5" />
                              <circle r="5" fill="#E8C84A" />
                              <text y="-18" className="text-[9px] font-bold fill-[#C9A227]" textAnchor="middle">🛕 Vishwanath Corridor</text>
                            </g>

                            {/* Node 3: Dashashwamedh Ghat (Visited) */}
                            <g transform="translate(290, 160)" className="cursor-pointer group" onClick={() => alert("Dashashwamedh Ghat: Visited 2 times! Aarti timing coordinates saved.")}>
                              <circle r="14" fill="rgba(212,175,55,0.15)" className="animate-ping" style={{ animationDuration: "2.5s" }} />
                              <circle r="9" fill="rgba(212,175,55,0.25)" stroke="#C9A227" strokeWidth="1" />
                              <circle r="4.5" fill="#E8C84A" />
                              <text x="20" y="4" className="text-[9px] font-bold fill-[#C9A227]" textAnchor="start">🔥 Dashashwamedh</text>
                            </g>

                            {/* Node 4: Manikarnika Ghat (Visited) */}
                            <g transform="translate(220, 175)" className="cursor-pointer group" onClick={() => alert("Manikarnika Ghat: Visited 1 time. Logged in timeline.")}>
                              <circle r="8" fill="rgba(212,175,55,0.25)" stroke="#C9A227" strokeWidth="1" />
                              <circle r="4" fill="#E8C84A" />
                              <text y="15" className="text-[8px] font-semibold fill-white/70" textAnchor="middle">💀 Manikarnika</text>
                            </g>

                            {/* Node 5: Assi Ghat (Visited) */}
                            <g transform="translate(360, 230)" className="cursor-pointer group" onClick={() => alert("Assi Ghat Sunrise: Visited 4 times! Subah-e-Banaras log saved.")}>
                              <circle r="18" fill="rgba(212,175,55,0.15)" className="animate-ping" style={{ animationDuration: "3.5s" }} />
                              <circle r="11" fill="rgba(212,175,55,0.3)" stroke="#C9A227" strokeWidth="1.5" />
                              <circle r="5.5" fill="#E8C84A" />
                              <text y="20" className="text-[9px] font-bold fill-[#C9A227]" textAnchor="middle">🌅 Assi Ghat</text>
                            </g>

                            {/* Node 6: Ramnagar Fort (Unvisited) */}
                            <g transform="translate(420, 100)" className="cursor-pointer group" onClick={() => alert("Ramnagar Fort: Unvisited. Scan a photo of the fort in the gallery tab to unlock!")}>
                              <circle r="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                              <circle r="5" fill="#555" />
                              <text y="-18" className="text-[9px] font-bold fill-white/50" textAnchor="middle">🏰 Ramnagar Fort</text>
                            </g>
                          </svg>

                          <div className="absolute bottom-3 left-3 bg-black/60 border border-white/5 px-2.5 py-1 rounded text-[8px] text-white/60">
                            Click nodes for local details
                          </div>
                        </div>

                        {/* Platform stats indicators */}
                        <div className="grid grid-cols-3 gap-3 text-left pt-2 text-xs">
                          <div className="p-3 bg-black/20 border border-white/5 rounded-2xl">
                            <span className="text-[8.5px] text-muted-foreground uppercase block mb-1">Most Active Day</span>
                            <span className="font-bold text-white">Tuesday</span>
                          </div>
                          <div className="p-3 bg-black/20 border border-white/5 rounded-2xl">
                            <span className="text-[8.5px] text-muted-foreground uppercase block mb-1">Favorite Temple</span>
                            <span className="font-bold text-[#C9A227]">Vishwanath</span>
                          </div>
                          <div className="p-3 bg-black/20 border border-white/5 rounded-2xl">
                            <span className="text-[8.5px] text-muted-foreground uppercase block mb-1">Favorite Food</span>
                            <span className="font-bold text-[#C9A227]">Tamatar Chaat</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </motion.div>
                )}

                {/* 2. CHRONOLOGICAL MEMORY TIMELINE SUB-TAB */}
                {subTab === "timeline" && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="max-w-xl mx-auto space-y-6 text-left"
                  >
                    
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-white">Chronological Diary Timeline</h4>
                        <p className="text-[10px] text-muted-foreground">Flow logs of your Varanasi discoveries</p>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400">Ticking chronologically</span>
                    </div>

                    <div className="relative border-l-2 border-[#C9A227]/30 pl-7 ml-4 space-y-8 py-3 text-left">
                      {memories.map((mem, idx) => (
                        <div key={mem.id} className="relative group">
                          
                          {/* Dot connector indicator */}
                          <span className="absolute -left-[37.5px] top-1.5 w-4 h-4 rounded-full bg-[#E8C84A] border-2 border-black shadow flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-black rounded-full" />
                          </span>

                          <div className="p-4 bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-2xl space-y-3.5">
                            <div className="flex justify-between items-center text-[10px] text-white/50 flex-wrap gap-1.5">
                              <span className="bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 rounded border border-[#C9A227]/25 font-bold uppercase text-[8.5px]">
                                {mem.category}
                              </span>
                              <span>📅 {mem.date} • {mem.time}</span>
                            </div>

                            <div className="flex gap-4 items-start flex-col sm:flex-row">
                              {mem.image && (
                                <div className="w-full sm:w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-black/10">
                                  <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="space-y-1">
                                <h5 className="font-bold text-white text-sm">📍 {mem.location}</h5>
                                <h6 className="font-semibold text-white/90 text-xs italic">"{mem.title}"</h6>
                                <p className="text-[11px] text-white/60 leading-relaxed pt-1">"{mem.diaryNotes}"</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/5 pt-2.5 text-[9px] text-white/40">
                              <span>🌍 GPS: {mem.gps}</span>
                              <span className="font-bold uppercase text-[#C9A227]">Mood: {mem.mood}</span>
                            </div>
                          </div>

                        </div>
                      ))}

                      {memories.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">No journey diaries recorded yet.</p>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 3. MEMORY GALLERY & MOCK CAMERA SUB-TAB */}
                {subTab === "gallery" && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-8 text-left"
                  >
                    
                    {/* Header buttons: Open Camera View & AI scanner */}
                    <div className="flex gap-4 justify-between items-center border-b border-white/5 pb-4 flex-wrap">
                      <div className="space-y-1">
                        <h4 className="font-serif text-base font-bold text-white">Visual Memory Vault</h4>
                        <p className="text-[10px] text-muted-foreground">Capture live experiences or identify photos using AI</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={openMockCamera}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#C9A227]/10"
                        >
                          <Camera className="w-3.5 h-3.5" /> Start Camera
                        </button>

                        <button
                          onClick={() => {
                            // Set preset image and open scanner anchor
                            setScannerImage("/images/tamatar-chaat.png");
                            setScanResult(null);
                            document.getElementById("ai-scanner-section")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Identify Photo (AI)
                        </button>
                      </div>
                    </div>

                    {/* Interactive Mock Camera Viewfinder */}
                    {isCameraActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto p-5 rounded-3xl border border-[#C9A227]/30 bg-black/60 shadow-2xl relative"
                      >
                        <button 
                          onClick={() => setIsCameraActive(false)}
                          className="absolute top-3 right-3 text-white/60 hover:text-white text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer"
                        >
                          Cancel
                        </button>

                        <h4 className="font-serif text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-[#C9A227]" /> Digital Viewfinder
                        </h4>

                        {capturedMockImage ? (
                          <div className="space-y-4">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#C9A227]/20 relative">
                              <img src={capturedMockImage} alt="Captured" className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-green-500 text-black font-extrabold text-[8px] px-2 py-0.5 rounded uppercase">Image Snapped</div>
                            </div>

                            {/* Captured Form */}
                            <div className="space-y-3.5 text-left text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Location</label>
                                  <select
                                    value={capLocation}
                                    onChange={(e) => setCapLocation(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                  >
                                    <option value="Assi Ghat">Assi Ghat Steps</option>
                                    <option value="Kashi Vishwanath Corridor">Vishwanath Corridor</option>
                                    <option value="Chowk Lanes">Chowk Street</option>
                                    <option value="Dashashwamedh Ghat">Dashashwamedh Ghat</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Category</label>
                                  <select
                                    value={capCategory}
                                    onChange={(e) => setCapCategory(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                  >
                                    <option value="Sunrise">Sunrise Moment</option>
                                    <option value="Food">Food Legend</option>
                                    <option value="Temple">Temple Visit</option>
                                    <option value="Festival">Festival Moment</option>
                                    <option value="Night">Night Walk</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Caption</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Savoring sweet lassis" 
                                    value={capCaption} 
                                    onChange={(e) => setCapCaption(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Mood</label>
                                  <select
                                    value={capMood}
                                    onChange={(e) => setCapMood(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                                  >
                                    <option value="Peaceful">Peaceful 🌸</option>
                                    <option value="Spiritual">Spiritual 🙏</option>
                                    <option value="Excited">Excited ⚡</option>
                                    <option value="Blessed">Blessed ✨</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Diary Diary Notes (Emotional touch)</label>
                                <textarea 
                                  rows={2} 
                                  placeholder="Write notes about your feelings..." 
                                  value={capDiary} 
                                  onChange={(e) => setCapDiary(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white resize-none outline-none"
                                />
                              </div>

                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => setCapturedMockImage(null)}
                                  className="flex-1 py-2 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all text-[11px] cursor-pointer"
                                >
                                  Retake Snap
                                </button>
                                <button
                                  onClick={handleSaveCapturedMemory}
                                  className="flex-1 py-2 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-[11px] cursor-pointer"
                                >
                                  Add to Timeline
                                </button>
                              </div>
                            </div>

                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-dashed border-white/20 bg-black/40 flex flex-col items-center justify-center p-4 text-center relative">
                            {/* Scanning indicator */}
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                              <span className="text-[7.5px] uppercase font-bold text-white/40 tracking-wider">Live Viewfinder</span>
                            </div>

                            <Camera className="w-8 h-8 text-[#C9A227]/40 mb-2 animate-pulse" />
                            <p className="text-white/80 text-xs font-bold">Mock Lens Focal Target Focused</p>
                            <p className="text-[10px] text-white/40 max-w-[200px] mt-0.5">Click the snap shutter button to capture a mock high-res Varanasi image.</p>
                            
                            <button
                              onClick={triggerMockShutter}
                              className="mt-4 px-5 py-2 bg-[#C9A227] text-black font-bold text-[10.5px] rounded-xl hover:scale-103 active:scale-97 transition-all cursor-pointer shadow-md"
                            >
                              📸 Snap Photo Shutter
                            </button>
                          </div>
                        )}

                      </motion.div>
                    )}

                    {/* AI Photo Identifier Section */}
                    <div id="ai-scanner-section" className="scroll-mt-6 max-w-lg mx-auto">
                      <div className="p-4.5 rounded-3xl bg-[#0f0a05]/95 border border-[#C9A227]/15 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] block">Scan Landings & Dishes</span>
                          <h4 className="font-serif text-xs font-bold text-white">Future AI Photo Recognition</h4>
                        </div>
                        <div className="flex gap-3 flex-col sm:flex-row text-xs text-left">
                          <div className="space-y-1.5 flex-1">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block">Select Photo to Scan</label>
                            <select
                              value={scannerImage}
                              onChange={(e) => {
                                setScannerImage(e.target.value);
                                setScanResult(null);
                              }}
                              className="w-full bg-black/45 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                            >
                              <option value="">-- Choose target snap --</option>
                              <option value="/images/tamatar-chaat.png">Bowl of Spicy Tamatar Chaat</option>
                              <option value="/images/kashi-vishwanath-aerial.jpg">Corridor Aerial View</option>
                              <option value="/images/dashashwamedh-ghat-aarti.jpg">Ganga Aarti Fire Lamps</option>
                            </select>
                          </div>
                          
                          <button
                            onClick={triggerAIScan}
                            disabled={isScanning || !scannerImage}
                            className="px-4 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold text-xs rounded-xl shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 sm:mt-5"
                          >
                            {isScanning ? "Scanning Snap..." : "Scan Photo"}
                          </button>
                        </div>

                        {/* Scanner animation preview */}
                        {scannerImage && (
                          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/30 my-3">
                            <img src={scannerImage} alt="Preview" className="w-full h-full object-cover" />
                            {isScanning && (
                              <div className="absolute inset-0 bg-gradient-to-b from-[#C9A227]/0 via-[#C9A227]/25 to-[#C9A227]/0 animate-scanner pointer-events-none" />
                            )}
                          </div>
                        )}

                        {/* Scanner results output */}
                        {scanResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-2xl space-y-2 text-left text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-sm">🔍 AI Detected: {scanResult.name}</span>
                              <span className="text-[8.5px] uppercase tracking-wider font-bold text-[#C9A227] bg-[#C9A227]/20 px-2 py-0.5 rounded">{scanResult.era}</span>
                            </div>
                            <p className="text-white/70 leading-relaxed text-[11px]">{scanResult.history}</p>
                            <p className="text-[10px] text-[#C9A227] leading-relaxed">💡 {scanResult.tips}</p>
                            <Link href={scanResult.mapLink}>
                              <button className="text-[10px] font-bold text-white hover:underline mt-2 flex items-center gap-1 cursor-pointer">
                                Open Map Directions →
                              </button>
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Masonry Memory Gallery List */}
                    <div className="space-y-4">
                      
                      {/* Search & Category Pills for Gallery */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/20 p-3 rounded-2xl border border-white/5">
                        
                        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
                          {["All", "Sunrise", "Food", "Temple", "Festival", "Night"].map((c) => (
                            <button
                              key={c}
                              onClick={() => setGalleryCategory(c)}
                              className={`text-[9.5px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                                galleryCategory === c 
                                  ? "bg-[#C9A227] text-black border-[#C9A227]" 
                                  : "bg-black/40 border-white/5 text-white/50 hover:text-white"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          placeholder="Search gallery captions..."
                          value={gallerySearch}
                          onChange={(e) => setGallerySearch(e.target.value)}
                          className="bg-black/50 border border-white/5 rounded-lg py-1 px-3 text-[10.5px] text-white outline-none w-full sm:w-[180px] placeholder:text-white/20"
                        />

                      </div>

                      {/* Grid cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMemories.map((m) => (
                          <div key={m.id} className="group bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl overflow-hidden flex flex-col relative">
                            
                            {/* Category Tag overlay */}
                            <span className="absolute top-3 left-3 z-10 text-[8.5px] font-extrabold uppercase bg-black/60 text-[#C9A227] px-2 py-0.5 rounded border border-[#C9A227]/25 backdrop-blur-md">
                              {m.category}
                            </span>

                            {/* Delete button */}
                            <button
                              onClick={() => {
                                const updated = memories.filter(item => item.id !== m.id);
                                saveMemories(updated);
                              }}
                              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 text-white/60 hover:text-red-400 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:bg-black/80"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Image Header with Fullscreen trigger */}
                            <div className="aspect-video w-full relative overflow-hidden group">
                              <img src={m.image} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <button
                                onClick={() => setFullscreenImage(m.image)}
                                className="absolute bottom-2 right-2 w-7 h-7 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white cursor-pointer active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h5 className="font-serif font-bold text-white text-[13.5px]">📍 {m.location}</h5>
                                <p className="text-[10px] text-white/40">📅 {m.date} • {m.time}</p>
                                <h6 className="font-semibold text-[#C9A227] text-xs mt-1">"{m.title}"</h6>
                                <p className="text-[11.5px] text-white/70 leading-relaxed italic mt-0.5">"{m.diaryNotes}"</p>
                              </div>

                              <div className="border-t border-white/5 pt-2 mt-3 flex justify-between items-center text-[8.5px] text-white/40">
                                <span>🌍 GPS: {m.gps}</span>
                                <span className="font-bold text-[#C9A227] uppercase">Mood: {m.mood}</span>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                      {filteredMemories.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-12">No matching photos found in memory vault.</p>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 4. TRAVEL EXPENSES LEDGER SUB-TAB */}
                {subTab === "expenses" && (
                  <motion.div
                    key="expenses"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
                  >
                    
                    {/* Add expense form */}
                    <div className="lg:col-span-1 bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-6 h-fit">
                      <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" /> Log Travel Expense
                      </h3>
                      
                      <form onSubmit={handleAddExpense} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground">Description</label>
                          <input 
                            type="text" 
                            required
                            value={newExpDesc} 
                            onChange={(e) => setNewExpDesc(e.target.value)}
                            placeholder="e.g., Lassi at Blue Lassi" 
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded-xl text-xs outline-none" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (₹)</label>
                            <input 
                              type="number" 
                              required
                              value={newExpAmount} 
                              onChange={(e) => setNewExpAmount(e.target.value)}
                              placeholder="80" 
                              className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded-xl text-xs outline-none" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Category</label>
                            <select 
                              value={newExpCat} 
                              onChange={(e) => setNewExpCat(e.target.value)}
                              className="w-full bg-black/50 border border-white/10 text-white px-2 py-2 rounded-xl text-xs outline-none"
                            >
                              <option value="Food">Food</option>
                              <option value="Transport">Transport</option>
                              <option value="Spiritual">Spiritual</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold rounded-xl text-xs cursor-pointer active:scale-95 transition-all">
                          Log Expense
                        </button>
                      </form>
                    </div>

                    {/* Expenses List column */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-white">Expenses Ledger</h4>
                          <span className="text-[10px] text-muted-foreground">Total Spent: ₹{totalExpenses}</span>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {expenses.map((exp) => (
                          <div key={exp.id} className="flex justify-between items-center p-3 bg-black/25 rounded-2xl border border-white/5 text-xs">
                            <div className="text-left">
                              <p className="font-semibold text-white">{exp.desc}</p>
                              <span className="text-[9px] uppercase tracking-wider text-[#C9A227]">{exp.category}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white">₹{exp.amount}</span>
                              <button onClick={() => deleteExpense(exp.id)} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {expenses.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-12">No expenses logged yet.</p>
                        )}
                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </motion.div>
          )}

          {/* BOOKMARKS HEART TAB */}
          {activeTab === "wishlist" && (
            <motion.div 
              key="wishlist" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[240px] rounded-2xl" />
                  ))}
                </div>
              ) : !wishlistItems || wishlistItems.length === 0 ? (
                <div className="text-center py-24 bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground text-xs">Explore Kashi and save your favorite experiences.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {wishlistItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative h-[240px] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors"
                    >
                      <div className="absolute inset-0 bg-muted">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-[#C9A227] px-2 py-0.5 rounded-full border border-primary/20 backdrop-blur-md inline-block mb-2">
                          {item.itemType}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white mb-1">{item.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Mock Camera Permission dialog window */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="max-w-xs bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center">
          <Camera className="w-10 h-10 text-[#C9A227] mx-auto mb-3 animate-bounce" />
          <h4 className="font-serif font-bold text-sm text-white mb-1">Camera Permission Needed</h4>
          <p className="text-[10.5px] text-white/60 mb-4 leading-relaxed">Taste of Kashi wants access to your device camera to snap and log live memories on the Kashi timeline.</p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowPermissionModal(false)}
              className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-bold text-[10px] cursor-pointer"
            >
              Deny
            </button>
            <button
              onClick={grantPermission}
              className="flex-1 py-1.5 bg-[#C9A227] text-black font-bold rounded-lg text-[10px] cursor-pointer"
            >
              Allow
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Photo Viewer */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-4xl bg-black/90 p-0 border border-white/10 overflow-hidden rounded-3xl flex items-center justify-center aspect-video">
          {fullscreenImage && (
            <img src={fullscreenImage} alt="Fullscreen snap" className="w-full h-full object-contain" />
          )}
        </DialogContent>
      </Dialog>

    </Layout>
  );
}

// Dialog placeholder overrides
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function DialogContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 rounded-3xl bg-[#0f0a05] border border-[#C9A227]/20 text-white ${className}`}>
      {children}
    </div>
  );
}

function DialogHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1 text-center ${className}`}>{children}</div>;
}

function DialogTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-serif text-lg font-bold text-white ${className}`}>{children}</h3>;
}