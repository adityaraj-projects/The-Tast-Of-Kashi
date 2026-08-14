import { Layout } from "@/components/layout";
import { useGetVendors } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck } from "lucide-react";

export default function Vendors() {
  const { data: vendors = [], isLoading, error } = useGetVendors();

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-2 text-foreground">Local Vendors</h1>
        <p className="text-muted-foreground mb-8">Meet the artisans and culinary masters of Kashi.</p>

        {error ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-red-500/5 border border-red-500/10">
            <p className="text-red-400 font-medium mb-3">Failed to load vendors</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-xs font-bold rounded-lg text-black bg-[#C9A227]"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[140px] rounded-2xl" />
            ))}
          </div>
        ) : !vendors || vendors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No vendors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border p-5 rounded-2xl flex gap-5 cursor-pointer hover:border-primary/40 transition-colors group"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={vendor.imageUrl} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-bold text-foreground text-lg truncate">{vendor.name}</h3>
                    {vendor.isVerified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                  </div>
                  
                  <p className="text-sm text-primary mb-2 truncate">{vendor.specialty}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{vendor.location}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-1 rounded-xl text-xs text-primary">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="font-bold">{vendor.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}