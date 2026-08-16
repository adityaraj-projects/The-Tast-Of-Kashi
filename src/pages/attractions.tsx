import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Search, SlidersHorizontal, Landmark, MapPin, Clock } from "lucide-react";
import { openHistory } from "@/components/HistoryDialog";
import { toggleWishlist, useIsWishlisted, useGetAttractions } from "@/hooks/api-hooks";

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
  const { data: ATTRACTIONS = [], isLoading, error } = useGetAttractions();
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
            <h1 className="font-serif text-[32px] font-bold text-white leading-tight mb-1">Mystical Attractions</h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Journey through holy temples, historical ghats, and ancient legends of Varanasi.</p>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-5">
          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5A4D38" }} />
              <input 
                type="text" 
                placeholder="Search temples, ghats..." 
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

          {/* Type chips */}
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
          {error ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-red-400 font-medium mb-3">Failed to load attractions</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 text-xs font-bold rounded-lg text-black"
                style={{ background: "#C9A227" }}
              >
                Retry
              </button>
            </div>
          ) : filteredAttractions.length === 0 && !isLoading ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[#7A6A4A]">No attractions found matching your search.</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div 
                  key={i} 
                  className="h-[270px] rounded-2xl bg-black/20 border border-white/5"
                  style={{ background: "rgba(14,10,3,0.4)", border: "1px solid rgba(201,162,39,0.05)" }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                      <img src={attr.image} alt={attr.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
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
                      <AttractionWishlistButton attr={attr} variant="bookmark" />
                      {/* Sub label */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] text-[#C9A227]">
                        <MapPin className="w-3 h-3" />
                        <span>{attr.location}</span>
                      </div>
                    </div>
                    <div className="p-3.5 text-left">
                      <h3 className="font-serif font-bold text-[14px] text-white leading-tight">{attr.name}</h3>
                      <p className="text-[10px] text-white/50 mt-1 line-clamp-2 leading-relaxed h-7">{attr.sub}</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-white/60">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          <span>{attr.timing}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                          <span className="text-xs font-bold text-[#C9A227]">{attr.rating}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openHistory(attr.name);
                          }}
                          className="text-[10px] font-bold text-white hover:text-[#C9A227] transition-all cursor-pointer"
                        >
                          Read Legend ▾
                        </button>
                        <AttractionWishlistButton attr={attr} variant="heart" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function AttractionWishlistButton({ attr, variant }: { attr: any; variant: "bookmark" | "heart" }) {
  const isSaved = useIsWishlisted(attr.id, attr.type);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: attr.id,
      title: attr.name,
      itemType: attr.type,
      imageUrl: attr.image
    });
  };

  if (variant === "bookmark") {
    return (
      <button 
        onClick={handleToggle}
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-all z-10" 
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      >
        <Bookmark 
          className="w-3.5 h-3.5" 
          style={{ 
            color: isSaved ? "#C9A227" : "#FFFFFF",
            fill: isSaved ? "#C9A227" : "none"
          }} 
        />
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-85 transition-all cursor-pointer" 
      style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}
    >
      <Heart 
        className="w-3.5 h-3.5 transition-all" 
        style={{ 
          color: isSaved ? "#EF4444" : "#C9A227",
          fill: isSaved ? "#EF4444" : "none"
        }} 
      />
    </button>
  );
}
