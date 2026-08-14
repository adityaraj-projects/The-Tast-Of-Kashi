import { Plane, Calendar, Users, IndianRupee } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TripPlanner() {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Plane className="w-24 h-24 text-primary" />
      </div>

      <h3 className="font-serif font-bold text-lg mb-1 flex items-center gap-2">
        AI Trip Planner
      </h3>
      <p className="text-xs text-muted-foreground mb-5">Generate a personalized Kashi itinerary</p>
      
      <div className="space-y-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <Select defaultValue="2">
            <SelectTrigger className="bg-black/40 border-white/10 h-10 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="2">2 Days</SelectItem>
              <SelectItem value="3">3 Days</SelectItem>
              <SelectItem value="5">5+ Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="family">
            <SelectTrigger className="bg-black/40 border-white/10 h-10 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select defaultValue="medium">
          <SelectTrigger className="bg-black/40 border-white/10 h-10 text-xs w-full">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget (Backpacker)</SelectItem>
            <SelectItem value="medium">Comfort (Mid-range)</SelectItem>
            <SelectItem value="luxury">Luxury (Heritage Stays)</SelectItem>
          </SelectContent>
        </Select>

        <button className="w-full bg-primary text-primary-foreground font-semibold h-10 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(201,162,39,0.2)] mt-2">
          Generate My Itinerary
        </button>
      </div>
    </div>
  );
}