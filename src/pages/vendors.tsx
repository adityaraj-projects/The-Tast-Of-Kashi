import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGetVendors, toggleWishlist, useIsWishlisted } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { 
  Star, 
  MapPin, 
  BadgeCheck, 
  Clock, 
  IndianRupee, 
  Search, 
  Store, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  SlidersHorizontal 
} from "lucide-react";
import { openHistory } from "@/lib/events";

const VENDOR_CATEGORIES = [
  "All",
  "Chaat & Street Food",
  "Sweets & Dairy",
  "Banarasi Silk & Craft",
  "Authentic Dining",
  "Lassi & Beverages",
];

function VendorWishlistButton({ vendor }: { vendor: any }) {
  const isSaved = useIsWishlisted(vendor.id, "Vendor");
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await toggleWishlist({
        id: String(vendor.id),
        title: vendor.name,
        itemType: "Vendor",
        imageUrl: vendor.imageUrl,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md ${
        isSaved
          ? "bg-[#C9A227] text-[#040200] shadow-[#C9A227]/40 scale-105"
          : "bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/15"
      }`}
    >
      <Bookmark className={`w-4.5 h-4.5 ${isSaved ? "fill-[#040200]" : ""}`} />
    </button>
  );
}

export default function Vendors() {
  const { data: vendors = [], isLoading, error } = useGetVendors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      vendor.name.toLowerCase().includes(q) ||
      (vendor.nameHindi && vendor.nameHindi.toLowerCase().includes(q)) ||
      vendor.specialty.toLowerCase().includes(q) ||
      vendor.location.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-full pb-16" style={{ background: "var(--app-section-bg)" }}>
        {/* Luxury Hero Banner */}
        <div className="relative h-[220px] sm:h-[260px] overflow-hidden">
          <img
            src="/images/vendors/baati-chokha.jpg"
            alt="Heritage Vendors of Varanasi"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,2,0,0.96) 0%, rgba(4,2,0,0.75) 55%, rgba(4,2,0,0.45) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(4,2,0,0.98) 0%, transparent 60%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-[#C9A227]" />
              <span className="text-[11px] text-[#C9A227] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E8750A]" />
                Living Heritage of Kashi
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
              Heritage Vendors & Shops
            </h1>
            <p className="text-[13px] sm:text-sm max-w-2xl text-white/70">
              काशी के ऐतिहासिक प्रतिष्ठान — Meet the generational culinary legends, master weavers, and artisan keepers of Varanasi's authentic soul.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto py-6">
          {/* Search Bar & Category Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#7A6A4A" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops by name, Hindi title, dish, or location..."
                  className="w-full text-[13px] pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-[#C9A227]/50"
                  style={{
                    background: "rgba(14,10,3,0.6)",
                    border: "1px solid rgba(201,162,39,0.2)",
                    color: "#FFFFFF",
                  }}
                />
              </div>
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: "rgba(201,162,39,0.08)",
                  border: "1px solid rgba(201,162,39,0.15)",
                  color: "#C9A227",
                }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{filteredVendors.length} Outlets</span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {VENDOR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[12px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? "bg-[#C9A227] text-[#040200] border-[#C9A227] font-semibold shadow-sm"
                      : "bg-[#0E0A03] text-[#7A6A4A] border-white/5 hover:border-[#C9A227]/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors Grid */}
          {error ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-red-400 font-medium mb-3">Failed to load local vendors</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 text-xs font-bold rounded-lg text-black bg-[#C9A227] hover:bg-[#d8b02e] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[340px] rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-2xl bg-white/5 border border-white/10">
              <Store className="w-10 h-10 mx-auto text-[#7A6A4A] mb-3" />
              <p className="text-[#C9A227] font-semibold text-base mb-1">No vendors found</p>
              <p className="text-sm text-white/50">
                Try searching with a different keyword or reset category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openHistory(vendor.name)}
                  className="rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.015] flex flex-col"
                  style={{
                    background: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Card Image Banner */}
                  <div className="relative h-[210px] w-full overflow-hidden bg-black/40">
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(4,2,0,0.92) 0%, rgba(4,2,0,0.2) 60%, transparent 100%)",
                      }}
                    />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md"
                        style={{
                          background: "rgba(201,162,39,0.25)",
                          color: "#F6C851",
                          border: "1px solid rgba(201,162,39,0.35)",
                        }}
                      >
                        {vendor.category}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <VendorWishlistButton vendor={vendor} />

                    {/* Hindi Title & Rating on bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        {vendor.nameHindi && (
                          <p className="text-xs font-semibold text-[#E8A838] tracking-wide mb-0.5 drop-shadow">
                            {vendor.nameHindi}
                          </p>
                        )}
                        <h3 className="font-serif text-lg font-bold text-white leading-tight flex items-center gap-1.5 drop-shadow">
                          {vendor.name}
                          {vendor.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                          )}
                        </h3>
                      </div>

                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold backdrop-blur-md"
                        style={{
                          background: "rgba(0,0,0,0.75)",
                          border: "1px solid rgba(201,162,39,0.3)",
                          color: "#F6C851",
                        }}
                      >
                        <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                        <span>{vendor.rating}</span>
                        {vendor.reviewsCount && (
                          <span className="text-[10px] text-white/50 font-normal">
                            ({vendor.reviewsCount})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <p className="text-[13px] text-foreground/80 line-clamp-2 leading-relaxed">
                      {vendor.specialty}
                    </p>

                    {/* Meta info: timing, price, location */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                          <span className="truncate max-w-[190px]">{vendor.location}</span>
                        </div>
                        {vendor.priceRange && (
                          <div className="flex items-center gap-1 text-[#E8A838] font-medium text-[11.5px]">
                            <span>{vendor.priceRange}</span>
                          </div>
                        )}
                      </div>

                      {vendor.timing && (
                        <div className="flex items-center gap-1.5 text-white/50 text-[11.5px]">
                          <Clock className="w-3 h-3 text-[#7A6A4A] flex-shrink-0" />
                          <span>{vendor.timing}</span>
                        </div>
                      )}
                    </div>

                    {/* Click Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openHistory(vendor.name);
                      }}
                      className="mt-1 w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 group-hover:brightness-110"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(232,117,10,0.15) 100%)",
                        border: "1px solid rgba(201,162,39,0.35)",
                        color: "#F6C851",
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Explore History, Menu & Story</span>
                    </button>
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