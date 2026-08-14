import { useGetUserJourney } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Target, MapPin, Utensils, BookOpen, Store } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function JourneyStats() {
  const { data: journey, isLoading } = useGetUserJourney();

  if (isLoading) {
    return (
      <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="bg-card border border-border p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Your Journey
        </h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
          {journey.levelName}
        </span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Level {journey.level}</span>
          <span className="text-primary font-medium">{journey.xp} / {journey.xpToNext} XP</span>
        </div>
        <Progress value={(journey.xp / journey.xpToNext) * 100} className="h-1.5 bg-black/40" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={MapPin} label="Places Visited" value={journey.placesExplored} />
        <StatCard icon={Utensils} label="Foods Tasted" value={journey.foodsTasted} />
        <StatCard icon={BookOpen} label="Stories Read" value={journey.storiesRead} />
        <StatCard icon={Store} label="Events Joined" value={journey.eventsJoined} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="bg-black/20 border border-white/5 p-3 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}