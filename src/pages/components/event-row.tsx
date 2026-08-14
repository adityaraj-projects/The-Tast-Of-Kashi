import { useGetEvents } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export function EventRow() {
  const { data: events, isLoading } = useGetEvents({ limit: 4 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Upcoming Events</h2>
          <p className="text-muted-foreground text-sm mt-1">Experience the energy of Kashi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => {
          const isFeatured = index === 0;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-colors ${
                isFeatured ? "md:col-span-2 h-[280px]" : "h-[200px]"
              }`}
            >
              <div className="absolute inset-0 bg-muted">
                <img 
                  src={event.imageUrl || '/images/ganga-aarti.png'} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
              </div>
              
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {event.date}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                <h3 className={`font-serif font-bold text-white mb-2 ${isFeatured ? "text-3xl" : "text-xl"}`}>
                  {event.name}
                </h3>
                
                <p className={`text-white/80 mb-4 line-clamp-2 ${isFeatured ? "text-base max-w-2xl" : "text-sm"}`}>
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary text-white border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}