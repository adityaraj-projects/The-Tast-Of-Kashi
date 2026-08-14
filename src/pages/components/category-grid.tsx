import { useGetCategories } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { UtensilsCrossed, Landmark, Waves, Building2, BookHeart, PaintBucket } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  food: UtensilsCrossed,
  temple: Landmark,
  ghat: Waves,
  heritage: Building2,
  story: BookHeart,
  craft: PaintBucket
};

export function CategoryGrid() {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold text-foreground">Explore By Categories</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, index) => {
          const Icon = ICON_MAP[cat.type] || Landmark;
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border p-5 rounded-2xl cursor-pointer group hover:bg-accent/5 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(201,162,39,0.1)]">
                <Icon className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cat.count} Items</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}