import { useState } from "react";
import { Search, MapPin, Landmark, Utensils, Flame, Sparkles, ChevronRight, X } from "lucide-react";
import { openHistory } from "./HistoryDialog";

interface SearchItem {
  name: string;
  image: string;
  type: "Temple" | "Food" | "Heritage" | "Ghat";
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  { name: "Kashi Vishwanath Temple", image: "/images/kashi-vishwanath-aerial.jpg", type: "Temple" },
  { name: "Assi Ghat", image: "/images/assi-ghat-aarti.jpg", type: "Ghat" },
  { name: "Ganga Dwar", image: "/images/ganga-dwar.jpg", type: "Heritage" },
  { name: "Sarnath", image: "/images/sarnath.png", type: "Heritage" },
  { name: "Dashashwamedh Ghat", image: "/images/dashashwamedh-ghat-aarti.jpg", type: "Ghat" },
  { name: "BHU Campus", image: "/images/ghats-night.png", type: "Heritage" },
  { name: "Kaal Bhairav Temple", image: "/images/kaal-bhairav.png", type: "Temple" },
  { name: "Manikarnika Ghat", image: "/images/manikarnika-ghat.png", type: "Ghat" },
  { name: "Ramnagar Fort", image: "/images/ramnagar-fort.png", type: "Heritage" },
  { name: "Swarved Mahamandir", image: "/images/swarved-mahamandir.png", type: "Temple" },
  // Foods
  { name: "Tamatar Chaat", image: "/images/tamatar-chaat.png", type: "Food" },
  { name: "Malaiyyo", image: "/images/malaiyoo.png", type: "Food" },
  { name: "Banarasi Lassi", image: "/images/banarasi-lassi.png", type: "Food" },
  { name: "Kachori Sabzi", image: "/images/kachori-sabji.png", type: "Food" },
  { name: "Rabri Jalebi", image: "/images/jalebi-imarti.png", type: "Food" },
  { name: "Banarasi Paan", image: "/images/banarasi-paan.png", type: "Food" },
  { name: "Kulfi Falooda", image: "/images/kulfi-falooda.png", type: "Food" },
  { name: "Thandai", image: "/images/thandai.png", type: "Food" }
];

const POPULAR_TRENDS = [
  { name: "Kashi Vishwanath Temple", type: "Temple", icon: Landmark, color: "#D4AF37" },
  { name: "Tamatar Chaat", type: "Food", icon: Utensils, color: "#E8750A" },
  { name: "Assi Ghat", type: "Ghat", icon: Flame, color: "#EC4899" }
];

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredItems = SEARCHABLE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "Temple": return "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20";
      case "Food": return "bg-[#E8750A]/10 text-[#E8750A] border-[#E8750A]/20";
      case "Ghat": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "Heritage": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className={`relative flex-1 pointer-events-auto ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227] opacity-75" />
      <input
        type="text"
        placeholder="Explore temples, streets foods, artifacts..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full rounded-full pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#C9A227]/40 focus:ring-1 focus:ring-[#C9A227]/25"
        style={{
          background: "rgba(10, 8, 5, 0.95)",
          border: "1px solid rgba(201,162,39,0.22)",
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Click-away backdrop for suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowSuggestions(false)}
        />
      )}

      {/* Suggestions list */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0a06]/98 backdrop-blur-xl border border-[#C9A227]/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
          {searchQuery.trim().length === 0 ? (
            /* Popular Trends when input is empty */
            <div className="p-2 space-y-2 text-left">
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227]/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Popular Trends
              </span>
              <div className="space-y-1">
                {POPULAR_TRENDS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        openHistory(item.name);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                        <span className="text-xs text-white/90 group-hover:text-white font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C9A227] transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Filtered list search results */
            <>
              {filteredItems.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    openHistory(item.name);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/5"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-white group-hover:text-white">{item.name}</span>
                      <span className={`text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded border mt-1 w-fit ${getBadgeStyles(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A227] transition-all transform group-hover:translate-x-0.5" />
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-[10px] text-muted-foreground p-3 text-center">
                  No matches found / कोई परिणाम नहीं मिला
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
