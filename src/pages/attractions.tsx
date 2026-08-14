import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Search, SlidersHorizontal, Landmark, MapPin, Clock } from "lucide-react";
import { openHistory } from "@/components/HistoryDialog";
import { toggleWishlist, isWishlistItem } from "@/hooks/api-hooks";

const ATTRACTIONS = [
  { name: "Kashi Vishwanath Temple", sub: "One of the 12 Jyotirlingas of Lord Shiva", image: "/images/kashi-vishwanath-aerial.jpg", rating: 4.9, type: "Temple", timing: "4 AM – 11 PM", location: "Vishwanath Gali" },
  { name: "Ganga Dwar", sub: "Grand entry corridor gates connecting Ganges to Temple", image: "/images/ganga-dwar.jpg", rating: 4.9, type: "Heritage", timing: "Open All Day", location: "Corridor Ghats" },
  { name: "Assi Ghat", sub: "Peaceful riverside ghat for yoga & spirituality", image: "/images/assi-ghat-aarti.jpg", rating: 4.7, type: "Ghat", timing: "Open All Day", location: "Assi, Varanasi" },
  { name: "Sarnath", sub: "Where Buddha gave his first sermon", image: "/images/sarnath.png", rating: 4.6, type: "Heritage", timing: "9 AM – 5 PM", location: "13 km from Varanasi" },
  { name: "Dashashwamedh Ghat", sub: "Grand Ganga Aarti every evening", image: "/images/dashashwamedh-ghat-aarti.jpg", rating: 4.8, type: "Ghat", timing: "Open All Day", location: "Dashashwamedh, Varanasi" },
  { name: "BHU Campus", sub: "One of Asia's largest residential universities", image: "/images/ghats-night.png", rating: 4.7, type: "Heritage", timing: "Campus hours", location: "Lanka, Varanasi" },
  { name: "Kaal Bhairav Temple", sub: "The ancient guardian temple of Kotwal of Kashi", image: "/images/kaal-bhairav.png", rating: 4.8, type: "Temple", timing: "5 AM – 10 PM", location: "K45/3, Vishweshwarganj" },
  { name: "Manikarnika Ghat", sub: "Most sacred cremation ground in Hinduism", image: "/images/manikarnika-ghat.png", rating: 4.8, type: "Ghat", timing: "Open All Day", location: "Manikarnika, Varanasi" },
  { name: "Ramnagar Fort", sub: "18th century royal fort on the Ganges", image: "/images/ramnagar-fort.png", rating: 4.6, type: "Heritage", timing: "10 AM – 5 PM", location: "Ramnagar, Varanasi" },
  { name: "Swarved Mahamandir", sub: "Grand multistory meditation temple", image: "/images/swarved-mahamandir.png", rating: 4.9, type: "Temple", timing: "6 AM – 7 PM", location: "Umaraha, Varanasi" },
  { name: "Alaknanda Jetty", sub: "Luxury double-decker Ganga cruise boarding jetty", image: "/images/alaknanda-jetty.jpg", rating: 4.8, type: "Boat", timing: "5 AM – 9 PM", location: "Ravidas Ghat Jetty, Varanasi" },
];

const TYPES = ["All", "Temple", "Ghat", "Heritage", "Boat"];

const CARD_BG = "rgba(14,10,3,0.98)";
const CARD_BORDER = "rgba(201,162,39,0.10)";

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Temple: { bg: "rgba(201,162,39,0.15)", color: "#C9A227", border: "rgba(201,162,39,0.25)" },
  Ghat: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.20)" },
  Heritage: { bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "rgba(168,85,247,0.20)" },
  Boat: { bg: "rgba(6,182,212,0.12)", color: "#06b6d4", border: "rgba(6,182,212,0.20)" },
};

export default function Attractions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredAttractions = ATTRACTIONS.filter(attr => {
    const matchesType = selectedType === "All" || attr.type === selectedType;
    const matchesSearch = attr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          attr.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          attr.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-full" style={{ background: "var(--app-section-bg)" }}>
        {/* Page Hero */}
        <div className="relative h-[180px] overflow-hidden">
          <img src="/images/kashi-vishwanath.png" alt="Attractions" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(4,2,0,0.95) 0%,rgba(4,2,0,0.65) 55%,rgba(4,2,0,0.30) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.95) 0%,transparent 60%)" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-[#C9A227]" />
              <span className="text-[11px] text-[#C9A227] font-bold uppercase tracking-widest">Heritage</span>
            </div>
            <h1 className="font-serif text-[32px] font-bold text-white leading-tight mb-1">Timeless Attractions</h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Explore the sacred temples, ancient ghats, and historical monuments of Varanasi.</p>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-5">
          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5A4D38" }} />
              <input 
                type="text" 
                placeholder="Search attractions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full pl-9 pr-4 py-2.5 text-sm outline-none" 
                style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, color: "var(--foreground)" }} 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80" style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, color: "#8A7450" }}>
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: "none" }}>
            {TYPES.map((t, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedType(t)}
                className="flex-shrink-0 text-[12px] font-medium px-4 py-1.5 rounded-full transition-all hover:opacity-80 cursor-pointer" 
                style={
                  selectedType === t
                    ? { background: "linear-gradient(90deg,#C9A227 0%,#A07820 100%)", color: "#040200" }
                    : { background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, color: "#7A6A4A" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAttractions.map((attr, i) => {
              const tc = TYPE_COLORS[attr.type] || TYPE_COLORS.Heritage;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openHistory(attr.name)}
                  className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                >
                  <div className="relative h-[170px] overflow-hidden">
                    <img src={attr.image} alt={attr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.90) 0%,transparent 55%)" }} />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        attr.type === "Temple"
                          ? "bg-[#C9A227]/15 text-[#C9A227] border-[#C9A227]/25"
                          : attr.type === "Ghat"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                          : attr.type === "Boat"
                          ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30"
                          : "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"
                      }`}>{attr.type}</span>
                    </div>
                    {/* Bookmark */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: `attr_${attr.name}`,
                          title: attr.name,
                          itemType: attr.type,
                          imageUrl: attr.image
                        });
                      }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-all z-10" 
                      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                    >
                      <Bookmark 
                        className="w-3.5 h-3.5" 
                        style={{ 
                          color: isWishlistItem(attr.name) ? "#C9A227" : "#FFFFFF",
                          fill: isWishlistItem(attr.name) ? "#C9A227" : "none"
                        }} 
                      />
                    </button>
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                      <span className="text-[12px] font-bold text-white">{attr.rating}</span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-serif font-bold text-[14px] text-foreground leading-tight mb-1">{attr.name}</h3>
                    <p className="text-[10.5px] leading-relaxed line-clamp-2 mb-3 text-muted-foreground">{attr.sub}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#7A6A4A" }} />
                        <span className="text-[11px] truncate text-muted-foreground">{attr.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 flex-shrink-0" style={{ color: "#7A6A4A" }} />
                        <span className="text-[11px] text-muted-foreground">{attr.timing}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openHistory(attr.name);
                        }}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80" 
                        style={{ background: "linear-gradient(90deg,#C9A227 0%,#A07820 100%)", color: "#040200" }}
                      >
                        Explore →
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist({
                            id: `attr_${attr.name}`,
                            title: attr.name,
                            itemType: attr.type,
                            imageUrl: attr.image
                          });
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-all" 
                        style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}
                      >
                        <Heart 
                          className="w-3.5 h-3.5 transition-all" 
                          style={{ 
                            color: isWishlistItem(attr.name) ? "#EF4444" : "#C9A227",
                            fill: isWishlistItem(attr.name) ? "#EF4444" : "none"
                          }} 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
