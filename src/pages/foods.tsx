import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Search, SlidersHorizontal, Flame } from "lucide-react";
import { openHistory } from "@/components/HistoryDialog";
import { toggleWishlist, isWishlistItem } from "@/hooks/api-hooks";

const FOODS = [
  { name: "Tamatar Chaat", tagline: "The Iconic Street Delight", image: "/images/tamatar-chaat.png", rating: 4.8, price: 40, category: "Street Food", isVeg: true, spice: "Medium" },
  { name: "Malaiyyo", tagline: "Winter's Royal Treat", image: "/images/malaiyoo.png", rating: 4.7, price: 60, category: "Winter Special", isVeg: true, spice: "Mild" },
  { name: "Banarasi Lassi", tagline: "Rich, Creamy & Divine", image: "/images/banarasi-lassi.png", rating: 4.6, price: 35, category: "Beverages", isVeg: true, spice: "None" },
  { name: "Kachori Sabzi", tagline: "Crispy & Spicy Breakfast", image: "/images/kachori-sabji.png", rating: 4.7, price: 30, category: "Breakfast", isVeg: true, spice: "Spicy" },
  { name: "Rabri Jalebi", tagline: "Timeless Sweet Combo", image: "/images/jalebi-imarti.png", rating: 4.6, price: 50, category: "Sweets", isVeg: true, spice: "None" },
  { name: "Banarasi Paan", tagline: "A Tradition of Taste", image: "/images/banarasi-paan.png", rating: 4.8, price: 20, category: "Specialty", isVeg: true, spice: "None" },
  { name: "Kulfi Falooda", tagline: "Creamy Frozen Bliss", image: "/images/kulfi-falooda.png", rating: 4.5, price: 55, category: "Desserts", isVeg: true, spice: "None" },
  { name: "Thandai", tagline: "Festival Drink of Kashi", image: "/images/thandai.png", rating: 4.7, price: 45, category: "Beverages", isVeg: true, spice: "Mild" },
  { name: "Malpua Rabri", tagline: "Fried Sweet Pancakes", image: "/images/malpua-rabri.png", rating: 4.6, price: 65, category: "Sweets", isVeg: true, spice: "None" },
  { name: "Rabdi", tagline: "Reduced Milk Dessert", image: "/images/rabdi.png", rating: 4.5, price: 40, category: "Sweets", isVeg: true, spice: "None" },
];

const CATEGORIES = ["All", "Street Food", "Sweets", "Beverages", "Breakfast", "Desserts", "Specialty", "Winter Special"];

const CARD_BG = "rgba(14,10,3,0.98)";
const CARD_BORDER = "rgba(201,162,39,0.10)";

export default function Foods() {
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5A4D38" }} />
              <input 
                type="text" 
                placeholder="Search foods, vendors..." 
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
            {CATEGORIES.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 text-[12px] font-medium px-4 py-1.5 rounded-full transition-all hover:opacity-80 cursor-pointer" 
                style={
                  selectedCategory === cat
                    ? { background: "linear-gradient(90deg,#C9A227 0%,#A07820 100%)", color: "#040200" }
                    : { background: "var(--app-card-bg)", border: `1px solid var(--app-card-border)`, color: "#7A6A4A" }
                }
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
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
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
        </div>
      </div>
    </Layout>
  );
}
