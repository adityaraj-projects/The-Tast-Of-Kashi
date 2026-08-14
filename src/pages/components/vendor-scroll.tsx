import { useGetVendors } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function VendorScroll() {
  const { data: vendors, isLoading } = useGetVendors({ limit: 5 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="min-w-[300px] h-[160px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendors || vendors.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Top Local Vendors</h2>
          <p className="text-muted-foreground text-sm mt-1">The masters of Kashi's flavors</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">View All</button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-4">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[320px] bg-card border border-border p-4 rounded-2xl flex gap-4 cursor-pointer hover:border-primary/40 transition-colors group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={vendor.imageUrl} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="font-bold text-foreground truncate">{vendor.name}</h3>
                  {vendor.isVerified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                </div>
                
                <p className="text-xs text-primary mb-2 truncate">{vendor.specialty}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-xs">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="font-bold">{vendor.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5 bg-black/20" />
      </ScrollArea>
    </div>
  );
}