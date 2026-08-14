import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STORIES_DATA, HistoryStory } from "@/lib/stories-data";
import { 
  BookOpen, Languages, Volume2, Square, Clock, Award, 
  MapPin, ShieldAlert, Heart, Eye, HelpCircle, Utensils,
  Flame, Sparkles, Star, TrendingUp, Compass, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HistoryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState<HistoryStory | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("en"); // "en" or "hi"
  const [subTab, setSubTab] = useState("overview"); // "overview" | "architecture" | "rules" | "prasad" | "nearby" | "ingredients" | "vendors"
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      const name = customEvent.detail?.name;
      if (name && STORIES_DATA[name]) {
        const item = STORIES_DATA[name];
        setStory(item);
        setActiveLanguage("en");
        setSubTab("overview");
        setIsPlaying(false);
        setSpeed(1.0);
        setIsOpen(true);
        
        // check local storage wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const key = item.type === "Food" ? `food_${item.title}` : `attr_${item.title}`;
        setIsSaved(wishlist.some((w: any) => w.id === key));
      }
    };

    window.addEventListener("open_history", handleOpen);
    return () => {
      window.removeEventListener("open_history", handleOpen);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech synthesis when modal state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }
  };

  const handleVoicePlay = () => {
    if (!window.speechSynthesis || !story) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = activeLanguage === "en" ? story.english : story.hindi;
      const lang = activeLanguage === "en" ? "en-IN" : "hi-IN";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang;
      utterance.rate = speed;

      // Find appropriate voice accent
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) =>
        v.lang.toLowerCase().includes(lang.toLowerCase())
      ) || voices.find((v) => v.lang.toLowerCase().startsWith(activeLanguage));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Switch voice language automatically when switching languages while active
  useEffect(() => {
    if (isPlaying && story) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (window.speechSynthesis) {
          const textToSpeak = activeLanguage === "en" ? story.english : story.hindi;
          const lang = activeLanguage === "en" ? "en-IN" : "hi-IN";
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = lang;
          utterance.rate = speed;

          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find((v) =>
            v.lang.toLowerCase().includes(lang.toLowerCase())
          ) || voices.find((v) => v.lang.toLowerCase().startsWith(activeLanguage));
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onend = () => {
            setIsPlaying(false);
          };
          utterance.onerror = () => {
            setIsPlaying(false);
          };
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      }, 100);
    }
  }, [activeLanguage]);

  // Handle speed changes in real-time
  useEffect(() => {
    if (isPlaying && story) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (window.speechSynthesis) {
          const textToSpeak = activeLanguage === "en" ? story.english : story.hindi;
          const lang = activeLanguage === "en" ? "en-IN" : "hi-IN";
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = lang;
          utterance.rate = speed;

          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find((v) =>
            v.lang.toLowerCase().includes(lang.toLowerCase())
          ) || voices.find((v) => v.lang.toLowerCase().startsWith(activeLanguage));
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onend = () => {
            setIsPlaying(false);
          };
          utterance.onerror = () => {
            setIsPlaying(false);
          };
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      }, 100);
    }
  }, [speed]);

  const toggleSaveWishlist = () => {
    if (!story) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const key = story.type === "Food" ? `food_${story.title}` : `attr_${story.title}`;
    
    if (isSaved) {
      const updated = wishlist.filter((item: any) => item.id !== key);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const newItem = {
        id: key,
        title: story.title,
        itemType: story.type || "Attraction",
        imageUrl: story.image
      };
      wishlist.push(newItem);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsSaved(true);
    }
    // trigger custom event to reload wishlists instantly if any component is listening
    window.dispatchEvent(new Event("wishlist_updated"));
  };

  if (!story) return null;

  const isFoodType = story.type === "Food";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-0">
        
        {/* Banner Image */}
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a05] via-[#0f0a05]/40 to-transparent" />
          
          {/* Header Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30 backdrop-blur-md inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {story.type || "Attraction"} Guide
            </span>

            <button 
              onClick={toggleSaveWishlist}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center border border-white/10 text-primary cursor-pointer transition-transform active:scale-95"
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : "text-white"}`} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="px-6 pb-8 pt-2 text-left">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-serif text-3xl font-bold text-white flex items-center justify-between">
              {story.title}
            </DialogTitle>
            <div className="mt-1 text-sm text-[#8A7450] font-sans flex flex-col">
              <span className="font-medium text-[13px]">{story.subtitleEn}</span>
              <span className="text-xs text-amber-500/70 font-hindi mt-0.5">{story.subtitleHi}</span>
            </div>
          </DialogHeader>

          {/* Sub-tab selection row */}
          <div className="flex border-b border-white/5 mb-5 overflow-x-auto gap-4 pb-2" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setSubTab("overview")}
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                subTab === "overview" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
              }`}
            >
              📖 Overview & Audio
            </button>

            {!isFoodType ? (
              <>
                <button
                  onClick={() => setSubTab("architecture")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                    subTab === "architecture" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  🧱 Architecture
                </button>
                <button
                  onClick={() => setSubTab("rules")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                    subTab === "rules" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  📜 Visitor Rules
                </button>
                <button
                  onClick={() => setSubTab("prasad")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                    subTab === "prasad" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  🏵️ Worship & Prasad
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSubTab("ingredients")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                    subTab === "ingredients" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  🌿 Taste & Ingredients
                </button>
                <button
                  onClick={() => setSubTab("vendors")}
                  className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                    subTab === "vendors" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  🏪 Where to Buy
                </button>
              </>
            )}
            
            <button
              onClick={() => setSubTab("nearby")}
              className={`text-xs font-bold pb-2 transition-all cursor-pointer ${
                subTab === "nearby" ? "text-primary border-b-2 border-primary" : "text-white/60 hover:text-white"
              }`}
            >
              📍 Nearby Spots
            </button>
          </div>

          {/* Sub-tab Content Panels */}
          <AnimatePresence mode="wait">
            {subTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Language tab selector */}
                <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="w-full">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <TabsList className="grid grid-cols-2 bg-black/40 border border-[#C9A227]/10 p-1 rounded-xl w-[220px]">
                      <TabsTrigger value="en" className="rounded-lg text-xs font-bold py-1 flex items-center justify-center gap-1 data-[state=active]:bg-[#C9A227] data-[state=active]:text-black transition-all cursor-pointer">
                        <Languages className="w-3.5 h-3.5" /> English
                      </TabsTrigger>
                      <TabsTrigger value="hi" className="rounded-lg text-xs font-bold py-1 flex items-center justify-center gap-1 data-[state=active]:bg-[#C9A227] data-[state=active]:text-black font-hindi transition-all cursor-pointer">
                        <Languages className="w-3.5 h-3.5" /> हिन्दी
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                      {/* Speed selector */}
                      <select
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="bg-black/40 border border-[#C9A227]/25 text-[#C9A227] rounded-xl px-2 py-1.5 text-[11px] font-bold outline-none cursor-pointer"
                      >
                        <option value="0.75" className="bg-[#0f0a05]">0.75x</option>
                        <option value="1.0" className="bg-[#0f0a05]">1.0x</option>
                        <option value="1.25" className="bg-[#0f0a05]">1.25x</option>
                        <option value="1.5" className="bg-[#0f0a05]">1.5x</option>
                      </select>

                      <button
                        onClick={handleVoicePlay}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-[0.98] cursor-pointer"
                        style={{
                          borderColor: isPlaying ? "#EF4444" : "rgba(201,162,39,0.25)",
                          background: isPlaying ? "rgba(239,68,68,0.1)" : "rgba(201,162,39,0.05)",
                          color: isPlaying ? "#f87171" : "#C9A227"
                        }}
                      >
                        {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                        {isPlaying ? "Stop" : activeLanguage === "en" ? "Listen Guide" : "सुनें"}
                      </button>
                    </div>
                  </div>

                  <TabsContent value="en" className="mt-0 focus-visible:outline-none">
                    <p className="text-white/85 text-xs sm:text-[13px] leading-relaxed max-h-[180px] overflow-y-auto pr-1">
                      {story.english}
                    </p>
                  </TabsContent>

                  <TabsContent value="hi" className="mt-0 focus-visible:outline-none">
                    <p className="text-[#EADBB8] text-sm sm:text-base font-hindi leading-relaxed max-h-[180px] overflow-y-auto pr-1 tracking-wide">
                      {story.hindi}
                    </p>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {subTab === "architecture" && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-muted/20 border border-border/80 rounded-2xl"
              >
                <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2 flex items-center gap-1">
                  <Compass className="w-4 h-4" /> Architectural Style
                </h4>
                <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed">
                  {story.architecture || "Varanasi style heritage layout structured with local stone alignments, wide central courtyards, and ancient wooden entrances."}
                </p>
              </motion.div>
            )}

            {subTab === "rules" && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="p-4 bg-muted/25 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Timings
                  </span>
                  <p className="text-[13px] text-white font-semibold">{story.timings || "Open All Day"}</p>
                  <p className="text-[10px] text-primary/70 font-medium">Best hour: {story.bestTimeEn || "Morning hours"}</p>
                </div>

                <div className="p-4 bg-muted/25 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-primary" /> Dress Code
                  </span>
                  <p className="text-[13px] text-white font-semibold">{story.dressCode || "Modest attire recommended"}</p>
                </div>

                <div className="p-4 bg-muted/25 border border-border rounded-xl space-y-1 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-primary" /> Photography & Belongings
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed">{story.photoRules || "Photography is allowed in main public areas. Avoid taking pictures of private rituals."}</p>
                </div>
              </motion.div>
            )}

            {subTab === "prasad" && (
              <motion.div
                key="prasad"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-muted/20 border border-border/80 rounded-2xl"
              >
                <h4 className="text-xs uppercase tracking-wider font-bold text-primary mb-2 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> Sacred Prasad & Worship
                </h4>
                <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed">
                  {story.prasadInfo || "Standard floral baskets, sandalwood paste, and sugar laddoos can be obtained from stalls lined outside the security gate."}
                </p>
              </motion.div>
            )}

            {subTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gauges */}
                  <div className="p-4 bg-muted/25 border border-border rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Spice & Taste Level</span>
                    <div className="flex gap-1 text-primary mb-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`w-4 h-4 ${idx < (story.spiceLevel || 1) ? "fill-primary" : "text-white/20"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/60">Spice profile: {story.spiceLevel === 5 ? "Spicy Hot" : story.spiceLevel === 4 ? "Medium Spicy" : "Mild/None"}</span>
                  </div>

                  <div className="p-4 bg-muted/25 border border-border rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Sweetness Gauge</span>
                    <div className="flex gap-1 text-primary mb-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`w-4 h-4 ${idx < (story.sweetnessLevel || 1) ? "fill-primary" : "text-white/20"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/60">Sugar profile: {story.sweetnessLevel && story.sweetnessLevel >= 4 ? "Highly Sweet" : "Mild/None"}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Key Ingredients</span>
                  <div className="flex flex-wrap gap-2">
                    {story.ingredients?.map((ing, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-black/40 border border-white/5 text-white/90">
                        {ing}
                      </span>
                    )) || <span className="text-xs text-muted-foreground">Traditional recipe secrets.</span>}
                  </div>
                  <p className="text-[10px] text-[#C9A227] mt-3 font-semibold">🌿 Diet suitability: {story.vegOption || "Pure Vegetarian"}</p>
                </div>
              </motion.div>
            )}

            {subTab === "vendors" && (
              <motion.div
                key="vendors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/25 border border-border rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Average Price</span>
                    <p className="text-base font-bold text-primary">{story.priceRange || "₹40 - ₹80"}</p>
                  </div>
                  <div className="p-3 bg-muted/25 border border-border rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Est. Calories</span>
                    <p className="text-base font-bold text-white">{story.calories || "250 kcal"}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 border border-border rounded-2xl text-left">
                  <span className="text-[10px] uppercase font-bold text-[#C9A227] block mb-3 flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" /> Best Local Vendors in Kashi
                  </span>
                  
                  <div className="space-y-2">
                    {story.bestVendors?.map((ven, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-white/90 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{ven}</span>
                      </div>
                    )) || <p className="text-xs text-muted-foreground">Found at local stalls around Godowlia Chowk.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {subTab === "nearby" && (
              <motion.div
                key="nearby"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-muted/20 border border-border rounded-2xl space-y-3"
              >
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Recommended Nearby Stops
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {story.nearbySpots?.map((spot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (STORIES_DATA[spot]) {
                          setStory(STORIES_DATA[spot]);
                          setSubTab("overview");
                        }
                      }}
                      className="p-3 bg-black/40 border border-white/5 hover:border-primary/40 rounded-xl text-center cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-white leading-tight truncate">{spot}</p>
                      <span className="text-[9px] text-[#C9A227] mt-1 inline-block">Explore Guide ➔</span>
                    </div>
                  )) || <p className="text-xs text-muted-foreground">Explore streets near the Ganga riverbank.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function openHistory(name: string) {
  window.dispatchEvent(new CustomEvent("open_history", { detail: { name } }));
}
