import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Search, SlidersHorizontal, Flame } from "lucide-react";
import { openHistory } from "@/components/HistoryDialog";
import { toggleWishlist, isWishlistItem, useGetFoods } from "@/hooks/api-hooks";

const CATEGORIES = ["All", "Street Food", "Sweets", "Beverages", "Breakfast", "Desserts", "Specialty", "Winter Special"];

const CARD_BG = "rgba(14,10,3,0.98)";
const CARD_BORDER = "rgba(201,162,39,0.10)";

export default function Foods() {
  const { data: FOODS = [], isLoading, error } = useGetFoods();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFoods = FOODS.filter(food => {
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-full" style={{ background: "var(--app-section-bg)" }}>
        {/* Page Hero */}
        <div className="relative h-[180px] overflow-hidden">
          <img src="/images/tamatar-chaat.png" alt="Foods" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(4,2,0,0.95) 0%,rgba(4,2,0,0.65) 55%,rgba(4,2,0,0.30) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.95) 0%,transparent 60%)" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-[#E8750A]" />
              <span className="text-[11px] text-[#C9A227] font-bold uppercase tracking-widest">Explore</span>
            </div>
            <h1 className="font-serif text-[32px] font-bold text-white leading-tight mb-1">Authentic Foods of Kashi</h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Discover the legendary flavors that have defined Varanasi for centuries.</p>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-5">
          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7A6A4A" }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialty dishes..." 
                className="w-full text-[13px] pl-9 pr-4 py-2 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-[#C9A227]/50"
                style={{ background: "rgba(14,10,3,0.5)", border: "1px solid rgba(201,162,39,0.15)", color: "#FFFFFF" }}
              />
            </div>
            <button className="p-2 rounded-xl flex items-center justify-center transition-colors" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)", color: "#C9A227" }}>
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Categories Horizontal */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[12px] font-semibold px-4 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? "bg-[#C9A227] text-[#040200] border-[#C9A227]" 
                    : "bg-[#0E0A03] text-[#7A6A4A] border-white/5 hover:border-[#C9A227]/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section label */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-medium" style={{ color: "#7A6A4A" }}>
              Showing <span className="text-foreground font-semibold">{filteredFoods.length}</span> dishes
            </p>
            <button className="text-[12px] font-medium hover:underline" style={{ color: "#C9A227" }}>Sort by: Popular ▾</button>
          </div>

          {/* Grid */}
          {error ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-red-400 font-medium mb-3">Failed to load street food dishes</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 text-xs font-bold rounded-lg text-black"
                style={{ background: "#C9A227" }}
              >
                Retry
              </button>
            </div>
          ) : filteredFoods.length === 0 && !isLoading ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[#7A6A4A]">No street food dishes found matching your selection.</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div 
                  key={i} 
                  className="h-[260px] rounded-2xl bg-black/20 border border-white/5"
                  style={{ background: "rgba(14,10,3,0.4)", border: "1px solid rgba(201,162,39,0.05)" }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFoods.map((food, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openHistory(food.name)}
                  className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                >
                  <div className="relative h-[160px] overflow-hidden">
                    <img src={food.image} alt={food.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(4,2,0,0.85) 0%,transparent 55%)" }} />
                    {/* Veg badge */}
                    <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-sm flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)", border: "1.5px solid #22c55e" }}>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    {/* Bookmark */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          id: `food_${food.name}`,
                          title: food.name,
                          itemType: "Food",
                          imageUrl: food.image
                        });
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-90" 
                      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                    >
                      <Bookmark 
                        className="w-3.5 h-3.5" 
                        style={{ 
                          color: isWishlistItem(food.name) ? "#C9A227" : "#FFFFFF",
                          fill: isWishlistItem(food.name) ? "#C9A227" : "none"
                        }} 
                      />
                    </button>
                    {/* Category */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(201,162,39,0.20)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.25)" }}>{food.category}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif font-bold text-[13.5px] text-foreground leading-tight">{food.name}</h3>
                    <p className="text-[10.5px] mt-0.5 leading-tight" style={{ color: "#5A4D38" }}>{food.tagline}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C9A227]" style={{ color: "#C9A227" }} />
                        <span className="text-[11.5px] font-semibold" style={{ color: "#C9A227" }}>{food.rating}</span>
                      </div>
                      <span className="font-bold text-[13px] text-foreground">₹{food.price}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                        food.spice === "Spicy"
                          ? "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:border-red-500/30"
                          : "bg-amber-500/5 text-[#7A6A4A] border-[#C9A227]/15 dark:bg-white/5 dark:text-white/70"
                      }`}>
                        {food.spice === "None" ? "Not Spicy" : food.spice}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist({
                            id: `food_${food.name}`,
                            title: food.name,
                            itemType: "Food",
                            imageUrl: food.image
                          });
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80 transition-all" 
                        style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}
                      >
                        <Heart 
                          className="w-3.5 h-3.5 transition-all" 
                          style={{ 
                            color: isWishlistItem(food.name) ? "#EF4444" : "#C9A227",
                            fill: isWishlistItem(food.name) ? "#EF4444" : "none"
                          }} 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
