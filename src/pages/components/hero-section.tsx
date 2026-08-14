import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useGetDashboardSummary } from "@/hooks/api-hooks";

export function HeroSection() {
  const { data: summary } = useGetDashboardSummary();

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] rounded-3xl overflow-hidden border border-primary/20 group"
      >
        <div className="absolute inset-0">
          <img 
            src="/images/bg-login.png" 
            alt="Ganga Aarti at Dusk" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        
        <div className="absolute inset-0 p-10 flex flex-col justify-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4"
          >
            Namaste
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-4"
          >
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#E8750A] to-primary">KASHI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-lg mb-8 font-hindi"
          >
            आनंद, आस्था और स्वाद की अनंत यात्रा।
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(201,162,39,0.3)]">
              Explore Now
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-white hover:bg-white/10 transition-colors border border-white/20 backdrop-blur-md">
              <Play className="w-4 h-4" />
              Watch Video
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-4 p-5 bg-card/50 backdrop-blur-md border border-border rounded-2xl"
      >
        <StatItem value={`${summary?.totalFoods || 50}+`} label="Authentic Foods" />
        <div className="w-px h-8 bg-border hidden md:block" />
        <StatItem value={`${summary?.totalAttractions || 30}+`} label="Attractions" />
        <div className="w-px h-8 bg-border hidden md:block" />
        <StatItem value={`${summary?.totalVendors || 25}+`} label="Local Vendors" />
        <div className="w-px h-8 bg-border hidden md:block" />
        <StatItem value={`${summary?.totalStories || 40}+`} label="Stories" />
        <div className="w-px h-8 bg-border hidden lg:block" />
        <StatItem value={`${summary?.totalExplorers ? Math.floor(summary.totalExplorers/1000) + 'K' : '10K'}+`} label="Happy Explorers" />
      </motion.div>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[120px]">
      <span className="font-serif text-2xl font-bold text-primary">{value}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}