import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGetStories } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, 
  Camera, MapPin, Sparkles, Info, Eye
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoItem {
  id: string;
  title: string;
  image: string;
  location: string;
  camera: string;
  story: string;
}

const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: "vishwanath-aerial",
    title: "Kashi Vishwanath Corridor",
    image: "/images/kashi-vishwanath-aerial.jpg",
    location: "Vishwanath Gali Corridor, Varanasi",
    camera: "Sony α7R V • 24-70mm GM II • 24mm • f/8 • 1/160s • ISO 100",
    story: "Captured at golden hour, this aerial view highlights the newly built corridor connecting the golden spire of Kashi Vishwanath temple directly down to the steps of the river Ganges."
  },
  {
    // Alaknanda cruise
    id: "alaknanda-jetty",
    title: "Alaknanda Luxury Jetty Cruise",
    image: "/images/alaknanda-jetty.jpg",
    location: "Ravidas Park Jetty, Assi",
    camera: "Hasselblad X2D 100C • XCD 38mm f/2.5 • f/5.6 • 1/250s • ISO 64",
    story: "The luxury double-decker Alaknanda catamaran cruise preparing to set sail for the evening Ganga Aarti tour from Ravidas Park ghat."
  },
  {
    id: "ganga-aarti-fire",
    title: "Maha Ganga Aarti Offering",
    image: "/images/ganga-aarti.png",
    location: "Dashashwamedh Ghat stairs",
    camera: "Sony α7R V • 70-200mm GM II • 105mm • f/2.8 • 1/200s • ISO 800",
    story: "Seven high priests performing the evening prayer ceremony with tiered brass multi-flame oil lamps, creating synchronized arcs of fire reflecting on the dark river water."
  },
  {
    id: "assi-sunrise",
    title: "Subah-e-Banaras Dawn",
    image: "/images/assi-ghat-aarti.jpg",
    location: "Assi Ghat steps",
    camera: "Canon EOS R5 • RF 50mm f/1.2 L • f/2 • 1/320s • ISO 200",
    story: "The divine silence of Varanasi at 5:15 AM as priests perform the morning Aarti on high wooden daises, while the sky turns orange-pink above the rising mist."
  },
  {
    id: "ghats-night",
    title: "Ancient Gali & Temple Glow",
    image: "/images/ghats-night.png",
    location: "Kashi Chowk lanes",
    camera: "Fujifilm X-T5 • XF 18mm f/1.4 WR • f/1.8 • 1/60s • ISO 1600",
    story: "Atmospheric street lamps outlining the ancient red brick temples and wet stone steps of Varanasi's core maze alleys at night."
  }
];

const STORY_CONTENTS: Record<string, string> = {
  "1": "Lord Shiva chose this sacred ground at the beginning of creation. According to ancient Puranic legends, when the universe was enveloped in darkness, Shiva stood here as a colossal pillar of light (Jyotirlinga). Brahma and Vishnu searched for its ends but could not find them. The city is built on Shiva's trident, keeping it suspended above the material realms of decay and destruction, which is why it is believed to survive cosmic dissolutions.",
  "2": "The legendary Banarasi silk weaving tradition originated during the Mughal era, bringing Persian designs together with Indian patterns. Master weavers use pure gold and silver threads (Zari) to weave elaborate floral patterns, jal work, and foliage on premium handlooms. A single saree can take months of synchronized hand weaving, passing skills down through seven generations of weavers. The craft remains a true symbol of cultural confluence.",
  "3": "Witnessing dawn (Subah-e-Banaras) is a transformative experience. As early morning Vedic chants echo across the river steps, pilgrims take a holy dip in the Ganges to wash away lifetimes of karma. The sun rising across the sandy opposite bank paints the old city temples in hues of gold, saffron, and crimson, while wooden rowboats drift silently through the morning river mist, creating an otherworldly, spiritual atmosphere.",
  "4": "The culinary legacy of Kashi is completely vegetarian, yet profoundly rich. It starts at dawn with spicy, aromatic Kachori Sabji served in leaf bowls, followed by hot Jalebi. In winter, mornings are incomplete without Malaiyyo, an ethereal milk foam flavored with saffron, cardamom, and topped with pistachios. Streets like Kachori Gali and Vishwanath Lane hold these secret tastes, passed down through secret family recipes.",
  "5": "The Evening Ganga Aarti at Dashashwamedh Ghat is a grand offering to Goddess Ganga. Seven young priests, dressed in silk dhotis and stoles, perform a highly synchronized ceremony with incense, peacock fans, and multi-tiered heavy brass oil lamps. The rhythmic sound of temple bells, conch shells, and Vedic prayers creates a mesmerizing aura reflecting off the dark, sacred river water. It is a spectacle of fire and devotion."
};

const CATEGORIES = ["All", "Mythology", "Culture", "Travel", "Food", "Spirituality"];

export default function Stories() {
  const { data: stories = [], isLoading, error } = useGetStories();
  const [activeTab, setActiveTab] = useState<"stories" | "gallery">("stories");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setZoomScale(1);
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % GALLERY_PHOTOS.length);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setZoomScale(1);
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 1));
  };

  const currentPhoto = selectedPhotoIndex !== null ? GALLERY_PHOTOS[selectedPhotoIndex] : null;

  // Filter legends list based on selectedCategory chip
  const filteredStories = stories?.filter(story => 
    selectedCategory === "All" || story.category.toLowerCase() === selectedCategory.toLowerCase()
  ) || [];

  const handleStoryClick = (story: any) => {
    setSelectedStory({
      ...story,
      content: STORY_CONTENTS[story.id] || story.excerpt
    });
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen text-left">
        <h1 className="font-serif text-4xl font-bold mb-2 text-foreground">Stories & Gallery</h1>
        <p className="text-muted-foreground mb-8">Timeless tales and visual aesthetics from the oldest living city.</p>

        {/* Tab Selection */}
        <div className="flex border-b border-border mb-8 gap-6 justify-start">
          <button
            onClick={() => setActiveTab("stories")}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "stories" 
                ? "border-[#C9A227] text-[#C9A227]" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📖 Spiritual Legends
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "gallery" 
                ? "border-[#C9A227] text-[#C9A227]" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📸 Divine Photo Gallery
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {/* Category Filter Chips for Legends */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#C9A227] border-[#C9A227] text-black shadow-lg shadow-[#C9A227]/10"
                        : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat === "All" ? "🗺️ All" : cat === "Mythology" ? "🔱 Mythology" : cat === "Culture" ? "🌸 Culture" : cat === "Travel" ? "📍 Travel" : cat === "Food" ? "🍛 Food" : "📿 Spirituality"}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-red-500/5 border border-red-500/10">
                  <p className="text-red-400 font-medium mb-3">Failed to load spiritual legends</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 text-xs font-bold rounded-lg text-black bg-[#C9A227]"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[240px] rounded-2xl" />
                  ))}
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl" style={{ background: "var(--app-card-bg)" }}>
                  <p className="text-muted-foreground">No legends found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleStoryClick(story)}
                      className="flex flex-col sm:flex-row gap-5 bg-card border border-border p-5 rounded-2xl group cursor-pointer hover:border-[#C9A227]/45 transition-colors hover:scale-[1.01]"
                      style={{ background: "var(--app-card-bg)" }}
                    >
                      <div className="w-full sm:w-40 h-48 sm:h-auto rounded-xl overflow-hidden bg-muted flex-shrink-0 relative border border-white/5">
                        <img 
                          src={story.imageUrl} 
                          alt={story.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center py-2 text-left">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-bold bg-[#C9A227]/10 px-2 py-1 rounded">
                            {story.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground">• {story.readTime}</span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                          {story.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-xs text-[#C9A227] font-bold">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          Read Legend
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {GALLERY_PHOTOS.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedPhotoIndex(index);
                    setZoomScale(1);
                  }}
                  className="group relative h-[250px] rounded-2xl overflow-hidden border border-border hover:border-[#C9A227]/50 cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: "var(--app-card-bg)" }}
                >
                  <div className="absolute inset-0 bg-muted">
                    <img 
                      src={photo.image} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-black/60 border border-[#C9A227]/25 text-[#C9A227] px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Photo Spec Exif
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                    <h3 className="font-serif font-bold text-white text-lg mb-1">{photo.title}</h3>
                    <p className="text-[#C9A227]/80 text-[10px] font-bold flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" /> {photo.location.split(",")[0]}
                    </p>
                    <span className="text-[10px] font-bold text-white/50 flex items-center gap-1">View High-Res Lightbox <Eye className="w-3.5 h-3.5 text-[#C9A227]" /></span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full-Screen Lightbox Dialog View */}
        <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open: boolean) => !open && setSelectedPhotoIndex(null)}>
          <DialogContent className="max-w-4xl bg-black/95 border border-white/10 text-white rounded-3xl overflow-hidden shadow-2xl p-0 flex flex-col md:flex-row h-[90vh] md:h-[550px] max-h-[90vh] md:max-h-[550px]">
            {currentPhoto && (
              <>
                {/* Left Photo Viewport Panel */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/5 h-[260px] md:h-full">
                  {/* Photo itself */}
                  <motion.div
                    animate={{ scale: zoomScale }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="w-full h-full p-6 flex items-center justify-center select-none"
                  >
                    <img
                      src={currentPhoto.image}
                      alt={currentPhoto.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                  </motion.div>

                  {/* Top Zoom Controls */}
                  <div className="absolute top-4 left-4 flex gap-1.5 bg-black/60 border border-white/10 p-1 rounded-xl backdrop-blur-md">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono font-bold flex items-center px-1 text-white/70">
                      {zoomScale.toFixed(2)}x
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Left / Right Slide triggers */}
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center border border-white/10 text-white cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center border border-white/10 text-white cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Right Metadata/Legends Info Panel */}
                <div className="w-full md:w-[280px] p-6 flex flex-col justify-between bg-[#070503]/90 text-left shrink-0 overflow-y-auto flex-1 md:flex-none">
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl font-bold tracking-wide text-white leading-tight">
                        {currentPhoto.title}
                      </h3>
                      <button 
                        onClick={() => setSelectedPhotoIndex(null)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-white cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs text-white/80">
                      <div className="flex gap-2 items-start">
                        <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[9px] text-muted-foreground font-semibold uppercase">LOCATION</span>
                          <span>{currentPhoto.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-start">
                        <Camera className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[9px] text-muted-foreground font-semibold uppercase">EXIF CAMERA DETAILS</span>
                          <span className="font-mono text-[10px] text-white/90 leading-tight block">{currentPhoto.camera}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-start">
                        <Info className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[9px] text-muted-foreground font-semibold uppercase">BEHIND THE LENS STORY</span>
                          <p className="text-[11px] text-white/70 leading-relaxed mt-0.5">{currentPhoto.story}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>EXIF Verified</span>
                    <span>Photo {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0} of {GALLERY_PHOTOS.length}</span>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Selected Legend Story Detail Dialog */}
        <Dialog open={selectedStory !== null} onOpenChange={(open: boolean) => !open && setSelectedStory(null)}>
          <DialogContent className="max-w-2xl bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-0">
            {selectedStory && (
              <div className="text-left">
                {/* Banner Image */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <img
                    src={selectedStory.imageUrl}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a05] via-[#0f0a05]/40 to-transparent" />
                  
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center border border-white/10 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-4 left-6">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30 backdrop-blur-md">
                      📖 {selectedStory.category} • {selectedStory.readTime}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                  <h2 className="font-serif text-2xl font-bold text-white mb-2">
                    {selectedStory.title}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#C9A227]/80 italic leading-relaxed border-l-2 border-[#C9A227] pl-3">
                    "{selectedStory.excerpt}"
                  </p>
                  <p className="text-xs sm:text-[13.5px] text-white/95 leading-relaxed pt-2">
                    {selectedStory.content}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}