import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Layout } from "@/components/layout";
import { useGetEvents } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, ArrowRight, BookOpen, Clock, AlertTriangle, 
  Map, Sparkles, ChevronRight, X, Info, Flame, Eye, Landmark, Check
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FestivalDetail {
  id: string;
  name: string;
  date: string;
  image: string;
  history: string;
  schedule: string[];
  viewingSpot: string;
  parking: string;
  crowdLevel: "Low" | "Moderate" | "High" | "Extreme";
  tips: string[];
}

const FESTIVALS: FestivalDetail[] = [
  {
    id: "mahashivratri",
    name: "Mahashivratri",
    date: "March 6, 2027",
    image: "/images/kashi-vishwanath-aerial.jpg",
    history: "Mahashivratri marks the divine wedding celebration of Lord Shiva and Goddess Parvati. In Kashi, Shiva's eternal home, the entire city erupts in supreme spiritual ecstasy. Millions of pilgrims carry water from the Ganges to offer at the Shiva Jyotirlinga, and the Shiv Shobhayatra marriage procession travels through the historic lanes of Varanasi.",
    schedule: [
      "04:00 AM - Holy dip in Ganga and temple gates open.",
      "12:00 PM - Grand Shiva marriage procession starting from Maha Mrityunjay Temple.",
      "07:00 PM - Special four-prahar night anointment (Abhishek) rituals."
    ],
    viewingSpot: "Godowlia Chowk crossings or Kashi Corridor exit steps.",
    parking: "Maidagin Multi-level Parking (1.2 km walk)",
    crowdLevel: "Extreme",
    tips: [
      "Queue waits can exceed 4 hours; VIP booking is highly recommended.",
      "Carry minimal items; phones and leather items are restricted inside the sanctorum.",
      "Dress in comfortable traditional attire."
    ]
  },
  {
    id: "dev-deepawali",
    name: "Dev Deepawali",
    date: "November 23, 2026",
    image: "/images/assi-ghat-aarti.jpg",
    history: "Celebrated on Kartik Poornima, Dev Deepawali represents the day Gods descend to celebrate Lord Shiva's victory over the demon Tripurasura. All 84 ghats of Varanasi are decorated with over one million lit clay lamps (diyas), transforming the crescent-shaped riverbank into a spectacular galaxy of golden lights.",
    schedule: [
      "05:00 PM - Lighting of first clay diya at Dashashwamedh stairs.",
      "06:30 PM - Synchronized Maha Ganga Aarti with brass flame lamps.",
      "08:00 PM - Traditional cultural dance and laser sky display at Chet Singh Ghat."
    ],
    viewingSpot: "Middle of the Ganges River from a wooden catamaran boat.",
    parking: "Sigra Sports Stadium Ground (take shuttle autos)",
    crowdLevel: "Extreme",
    tips: [
      "Book boat tickets at least 1 month in advance.",
      "Roads near Godowlia and Assi are closed for vehicles from 02:00 PM onwards.",
      "Be prepared for heavy pedestrian flow on the narrow streets."
    ]
  },
  {
    id: "ganga-dussehra",
    name: "Ganga Dussehra",
    date: "June 4, 2026",
    image: "/images/ganga-aarti.png",
    history: "Ganga Dussehra commemorates the auspicious day when the holy river Goddess Ganga descended to Earth from the heavens through Lord Shiva's locks. Devotees take a purificatory holy bath in the river and offer clay lamps to wash away ten types of sins accumulated over lifetimes.",
    schedule: [
      "05:00 AM - Holy bath ceremonies and sunrise prayers.",
      "04:00 PM - Distribution of cooling seasonal melon sharbat at local ghat stalls.",
      "07:00 PM - Special flower garland offering to River Goddess Ganga."
    ],
    viewingSpot: "Dashashwamedh Ghat or Rajendra Prasad Ghat steps.",
    parking: "Godowlia Multi-level Parking (10-minute walk)",
    crowdLevel: "High",
    tips: [
      "Hydrate well as summer temperatures can touch 42 degrees Celsius.",
      "Avoid swimming far into the river current during the crowd rush.",
      "Buy fresh clay lamps from local vendors lined on the walkways."
    ]
  },
  {
    id: "nag-nathaiya",
    name: "Nag Nathaiya",
    date: "November 12, 2026",
    image: "/images/evening-ghats.png",
    history: "Nag Nathaiya is a unique historical ritual recreating Lord Krishna's victory over Kaliya Naag. An actor representing Krishna jumps from a high Kadamba tree branch into the Ganges River, returning balanced on top of a floating wooden snake replica, cheered by thousands of spectators.",
    schedule: [
      "03:00 PM - Vedic musical recitals at Tulsi Ghat steps.",
      "04:30 PM - High-jump recreation of Krishna diving into the Ganga.",
      "05:00 PM - Special prayers at Tulsi Akhada temple."
    ],
    viewingSpot: "Tulsi Ghat steps or nearby Shivala Ghat rooftops.",
    parking: "Bhadaini crossing street parking (limited spaces)",
    crowdLevel: "High",
    tips: [
      "Arrive at least 2 hours early to secure spot near the Kadamba tree.",
      "Bring binoculars for clean observation of the river performance.",
      "Respect local residents' rooftops when climbing for views."
    ]
  },
  {
    id: "makar-sankranti",
    name: "Makar Sankranti",
    date: "January 14, 2027",
    image: "/images/custom-dashboard-bg.jpg",
    history: "Makar Sankranti marks the sun's transition into Capricorn, celebrating harvest and winter wind downs. In Varanasi, the skies are filled with millions of colourful kites, and families eat traditional sesame sweets (Til-Laddoo) and warm lentil-rice Khichdi dishes.",
    schedule: [
      "06:00 AM - Holy bath in the cold winter waters of the Ganges.",
      "10:00 AM - Kite flying duels start across all old city rooftops.",
      "01:00 PM - Special temple charity kitchens (Bhandaras) serving warm Khichdi."
    ],
    viewingSpot: "Rooftops of old heritage guest houses near Dashashwamedh.",
    parking: "Sigra and Godowlia multi-levels.",
    crowdLevel: "Moderate",
    tips: [
      "Watch out for sharp kite string glass coatings (Manjha) on open lanes.",
      "Try local winter sweet Malaiyyo foam in the mornings.",
      "Wrap warm; morning river winds are chilly."
    ]
  },
  {
    id: "ganga-mahotsav",
    name: "Ganga Mahotsav",
    date: "Oct 30, 2025",
    image: "/images/evening-ghats.png",
    history: "Ganga Mahotsav is a grand celebration of the cultural heritage, classical music, and spiritual essence of Varanasi. Over five days, the crescent ghats of Varanasi come alive with performances by legendary classical musicians, traditional dancers, and Vedic recitals, concluding in the spectacular lit Dev Deepawali.",
    schedule: [
      "05:30 PM - Traditional classical dance inaugurals.",
      "07:00 PM - Classical sitar performance by Indian masters.",
      "09:30 PM - Group chants and lamps floating offering."
    ],
    viewingSpot: "Assi Ghat open-air amphitheater.",
    parking: "Assi Ghat parking area (100 meters walk)",
    crowdLevel: "High",
    tips: [
      "Arrive early to get seats closer to the stage.",
      "Wear warm layers as autumn evenings are cool near the river water.",
      "Taste local snacks from the food stalls nearby."
    ]
  }
];

export default function Events() {
  const { data: events = [], isLoading, error } = useGetEvents();
  const [activeTab, setActiveTab] = useState<"upcoming" | "guide">("upcoming");
  const [selectedFestival, setSelectedFestival] = useState<FestivalDetail | null>(null);

  // Live LocalStorage Booking State
  const [bookings, setBookings] = useState<string[]>(() => {
    const stored = localStorage.getItem("kashi_event_bookings");
    return stored ? JSON.parse(stored) : [];
  });
  const [profileId, setProfileId] = useState<string | null>(null);

  // Sync profile & bookings from database
  useEffect(() => {
    const syncBookings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("id")
            .eq("auth_user_id", session.user.id)
            .single();

          if (profile?.id) {
            setProfileId(profile.id);
            const { data: dbBookings, error } = await supabase
              .from("event_bookings")
              .select("event_id")
              .eq("user_id", profile.id);

            if (error) throw error;
            if (dbBookings) {
              const ids = dbBookings.map((b: any) => b.event_id);
              setBookings(ids);
              localStorage.setItem("kashi_event_bookings", JSON.stringify(ids));
            }
          }
        }
      } catch (err) {
        console.warn("Supabase event_bookings query failed. Operating in offline local storage mode:", err);
      }
    };
    syncBookings();
  }, []);

  const handleBookEvent = async (id: string) => {
    const updated = [...bookings, id];
    setBookings(updated);
    localStorage.setItem("kashi_event_bookings", JSON.stringify(updated));

    if (profileId) {
      try {
        await supabase.from("event_bookings").insert({
          user_id: profileId,
          event_id: id
        });
      } catch (err) {
        console.warn("Could not sync new event booking to Supabase (table may not exist):", err);
      }
    }
  };

  const handleCancelBooking = async (id: string) => {
    const updated = bookings.filter(b => b !== id);
    setBookings(updated);
    localStorage.setItem("kashi_event_bookings", JSON.stringify(updated));

    if (profileId) {
      try {
        await supabase.from("event_bookings")
          .delete()
          .eq("user_id", profileId)
          .eq("event_id", id);
      } catch (err) {
        console.warn("Could not sync event booking cancellation to Supabase:", err);
      }
    }
  };

  const handleEventClick = (event: any) => {
    const found = FESTIVALS.find(f => f.name.toLowerCase().includes(event.name.toLowerCase()) || event.name.toLowerCase().includes(f.name.toLowerCase()));
    if (found) {
      setSelectedFestival(found);
    } else {
      setSelectedFestival({
        id: event.id,
        name: event.name,
        date: event.date,
        image: event.imageUrl,
        history: event.description + " This sacred event gathers thousands of devotees at " + event.location + " in Varanasi to experience spiritual energy, local music, and cultural ceremonies.",
        schedule: [
          "05:00 PM - Assembling and prayers at venue.",
          "06:30 PM - Main celebration ceremonies.",
          "08:00 PM - Cultural dance & music recitals."
        ],
        viewingSpot: event.location + " main seating areas.",
        parking: "Godowlia Multi-level Parking (approx 15 min walk)",
        crowdLevel: "High",
        tips: [
          "Arrive early to avoid heavy pedestrian lane congestion.",
          "Dress appropriately for spiritual premises.",
          "Keep dynamic map guide active for locating entrances."
        ]
      });
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen text-left">
        <h1 className="font-serif text-4xl font-bold mb-2 text-foreground">Festivals & Events</h1>
        <p className="text-muted-foreground mb-8">Experience the vibrant celebrations of Kashi.</p>

        {/* Tab selection */}
        <div className="flex border-b border-border mb-8 gap-6 justify-start">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "upcoming" 
                ? "border-[#C9A227] text-[#C9A227]" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🗓️ Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "guide" 
                ? "border-[#C9A227] text-[#C9A227]" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🎆 Kashi Festival Guide
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "upcoming" && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {error ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-red-500/5 border border-red-500/10">
                  <p className="text-red-400 font-medium mb-3">Failed to load upcoming events</p>
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
                    <Skeleton key={i} className="h-[280px] rounded-2xl" />
                  ))}
                </div>
              ) : !events || events.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl" style={{ background: "var(--app-card-bg)" }}>
                  <p className="text-muted-foreground">No upcoming events found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleEventClick(event)}
                      className="group relative h-[280px] rounded-2xl overflow-hidden border border-border hover:border-[#C9A227]/50 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{ background: "var(--app-card-bg)" }}
                    >
                      <div className="absolute inset-0 bg-muted">
                        <img 
                          src={event.imageUrl} 
                          alt={event.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-[#C9A227] text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                        <h3 className="font-serif font-bold text-white mb-2 text-2xl">
                          {event.name}
                        </h3>
                        
                        <p className="text-white/80 mb-4 line-clamp-2 text-xs leading-relaxed">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-[#C9A227] font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                          
                          <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary hover:text-black text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "guide" && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {FESTIVALS.map((fest, index) => (
                <motion.div
                  key={fest.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFestival(fest)}
                  className="group relative h-[250px] rounded-2xl overflow-hidden border border-border hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: "var(--app-card-bg)" }}
                >
                  <div className="absolute inset-0 bg-muted">
                    <img 
                      src={fest.image} 
                      alt={fest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-primary/20 border border-primary/30 text-primary px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {fest.date}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif font-bold text-white text-xl mb-1">{fest.name}</h3>
                    <p className="text-white/60 text-[10px] leading-relaxed line-clamp-2 mb-3">{fest.history}</p>
                    <span className="text-[10px] font-bold text-[#C9A227] flex items-center gap-1">Explore Festival Details <ChevronRight className="w-3.5 h-3.5" /></span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Festival Dialog Popup */}
        <Dialog open={selectedFestival !== null} onOpenChange={(open: boolean) => !open && setSelectedFestival(null)}>
          <DialogContent className="max-w-2xl bg-[#0f0a05]/95 backdrop-blur-xl border border-[#C9A227]/20 text-white rounded-3xl overflow-hidden shadow-2xl p-0">
            {selectedFestival && (
              <div className="text-left">
                {/* Banner Image */}
                <div className="relative h-[220px] w-full overflow-hidden">
                  <img
                    src={selectedFestival.image}
                    alt={selectedFestival.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a05] via-[#0f0a05]/40 to-transparent" />
                  
                  <button 
                    onClick={() => setSelectedFestival(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center border border-white/10 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-4 left-6">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30 backdrop-blur-md">
                      📅 Celebrating: {selectedFestival.date}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 space-y-6 max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-white flex items-center gap-2 mb-2">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" /> {selectedFestival.name}
                    </h2>
                    <p className="text-white/80 text-xs sm:text-[13px] leading-relaxed">
                      {selectedFestival.history}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Schedule */}
                    <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
                      <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" /> Ritual Schedule
                      </span>
                      <div className="space-y-2">
                        {selectedFestival.schedule.map((sch, idx) => (
                          <div key={idx} className="text-xs text-white/95 leading-normal flex gap-1.5">
                            <span className="text-[#C9A227] font-bold shrink-0">•</span>
                            <span>{sch}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Proximity mapping */}
                    <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
                      <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1.5">
                        <Map className="w-3.5 h-3.5 text-primary" /> Logistics & Proximity
                      </span>
                      <div className="space-y-2.5 text-xs text-white/90">
                        <div>
                          <span className="block text-[10px] text-muted-foreground font-semibold">👀 BEST VIEWING SPOT</span>
                          <span className="font-medium text-white">{selectedFestival.viewingSpot}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground font-semibold">🚗 NEAREST PARKING</span>
                          <span className="font-medium text-white">{selectedFestival.parking}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crowd Level Alerts & Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl flex flex-col justify-center items-center text-center">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-2">Crowd Prediction</span>
                      <span className={`text-base font-bold uppercase px-3 py-1 rounded-full ${
                        selectedFestival.crowdLevel === "Extreme" 
                          ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" 
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        🔥 {selectedFestival.crowdLevel}
                      </span>
                    </div>

                    <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl sm:col-span-2 text-left space-y-2">
                      <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-primary" /> Key Travel Tips
                      </span>
                      <div className="space-y-1">
                        {selectedFestival.tips.map((tip, idx) => (
                          <div key={idx} className="text-xs text-white/80 leading-normal flex gap-1.5">
                            <span className="text-[#C9A227] font-bold">✓</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Premium Booking Registry Component */}
                  <div className="pt-4 border-t border-[#C9A227]/15 text-left space-y-3">
                    <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-primary" /> Event Pass Registration
                    </span>
                    
                    {bookings.includes(selectedFestival.id) ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-green-500/10 border border-green-500/35 text-white/90">
                        <div>
                          <p className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Pass Confirmed
                          </p>
                          <p className="text-[10px] text-white/60 mt-0.5">Your e-pass and VIP entry details have been sent to your registered profile.</p>
                        </div>
                        <button
                          onClick={() => handleCancelBooking(selectedFestival.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/25 text-red-400 text-[10.5px] font-bold cursor-pointer transition-all"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/45 border border-white/5">
                        <div className="text-left">
                          <p className="text-xs font-bold text-white">Varanasi Pilgrim Pass</p>
                          <p className="text-[10px] text-white/50 mt-0.5">Complimentary registration including crowd guidance map details.</p>
                        </div>
                        <button
                          onClick={() => handleBookEvent(selectedFestival.id)}
                          className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-900/10 transition-all active:scale-95 cursor-pointer"
                        >
                          Book Free Entry Pass
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}