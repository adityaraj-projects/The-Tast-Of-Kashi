import { useGetDashboardRecommended } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Heart, Star, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function RecommendedCarousel() {
  const { data: items, isLoading } = useGetDashboardRecommended();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="min-w-[280px] h-[320px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Recommended For You</h2>
          <p className="text-muted-foreground text-sm mt-1">Based on your explorer profile</p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[320px] rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
              >
                <div className="absolute inset-0 bg-muted">
                  <img 
                    src={item.imageUrl || '/cat-food.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                
                <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-primary transition-colors z-10">
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/20 backdrop-blur-md">
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-3 h-3 fill-primary" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-1">{item.subtitle}</p>
                  
                  {item.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4 pr-2">
          <CarouselPrevious className="relative right-0 translate-y-0 h-8 w-8 bg-card border-border hover:bg-primary/20 hover:text-primary hover:border-primary/30" />
          <CarouselNext className="relative left-0 translate-y-0 h-8 w-8 bg-card border-border hover:bg-primary/20 hover:text-primary hover:border-primary/30" />
        </div>
      </Carousel>
    </div>
  );
}