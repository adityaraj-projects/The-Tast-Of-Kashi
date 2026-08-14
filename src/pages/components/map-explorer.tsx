import { motion } from "framer-motion";
import { Maximize2, MapPin, Plus, Minus } from "lucide-react";

export function MapExplorer() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-border flex items-center justify-between bg-black/20">
        <h3 className="font-serif font-bold text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Kashi Map Explorer
        </h3>
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="relative flex-1 bg-muted overflow-hidden group">
        <img 
          src="/map-bg.png" 
          alt="Map of Kashi" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
        />
        
        {/* Mock Pins */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(201,162,39,0.8)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#E8750A] rounded-full shadow-[0_0_15px_rgba(232,117,10,0.8)] border-2 border-white"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(201,162,39,0.8)]"></div>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10 rounded flex items-center justify-center text-white hover:bg-primary/40 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10 rounded flex items-center justify-center text-white hover:bg-primary/40 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Location Overlay */}
        <div className="absolute bottom-4 inset-x-4 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="/cat-temple.png" alt="Dashashwamedh Ghat" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Dashashwamedh Ghat</h4>
            <p className="text-[10px] text-primary">Ganga Aarti Location</p>
          </div>
        </div>
      </div>
    </div>
  );
}