import { useGetStories } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function StoriesSidebar() {
  const { data: stories, isLoading } = useGetStories({ limit: 4 });

  if (isLoading) {
    return (
      <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) return null;

  return (
    <div className="bg-card border border-border p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Stories of Kashi
        </h3>
        <button className="text-xs text-primary hover:text-primary/80 font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
              <img 
                src={story.imageUrl} 
                alt={story.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {story.title}
              </h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {story.category} • {story.readTime}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}