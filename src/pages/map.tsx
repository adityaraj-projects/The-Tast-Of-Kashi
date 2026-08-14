import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, MapPin, Plus, Minus, Landmark, UtensilsCrossed, Building2, 
  Search, Star, Compass, ArrowRight, Heart, Share2, Navigation, Volume2, 
  VolumeX, Sparkles, X, Sun, Users, Flame, Wind, Clock, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useLocation } from "wouter";
import { STORIES_DATA } from "@/lib/stories-data";

interface MarkerData {
  id: string;
  name: string;
  type: "Temple" | "Food" | "Heritage" | "Events" | "Parks" | "Boat" | "Photo Spots" | "Facilities";
  lat: number;
  lng: number;
  sub: string;
  location: string;
  image: string;
  rating: number;
  timing: string;
  distance: string;
  crowdLevel: "Low" | "Moderate" | "High";
  queueTime?: string;
}

interface TrailData {
  name: string;
  desc: string;
  color: string;
  coordinates: [number, number][];
}

const MARKERS: MarkerData[] = [
  { id: "kashi-vishwanath", name: "Kashi Vishwanath Temple", type: "Temple", lat: 25.3108, lng: 83.0104, sub: "The sacred golden temple of Lord Shiva", location: "Vishwanath Gali", image: "/images/kashi-vishwanath-aerial.jpg", rating: 4.9, timing: "4 AM - 11 PM", distance: "0.2 km", crowdLevel: "High", queueTime: "35 min" },
  { id: "assi-ghat", name: "Assi Ghat", type: "Events", lat: 25.2895, lng: 83.0071, sub: "Peaceful riverside ghat for yoga & sunrise", location: "Assi, Varanasi", image: "/images/assi-ghat-aarti.jpg", rating: 4.7, timing: "Open All Day", distance: "2.4 km", crowdLevel: "Moderate" },
  { id: "dashashwamedh-ghat", name: "Dashashwamedh Ghat", type: "Events", lat: 25.3068, lng: 83.0101, sub: "Grand Ganga Aarti ceremony every evening", location: "Dashashwamedh", image: "/images/dashashwamedh-ghat-aarti.jpg", rating: 4.8, timing: "Open All Day", distance: "0.5 km", crowdLevel: "High" },
  { id: "sarnath", name: "Sarnath (Dhamek Stupa)", type: "Heritage", lat: 25.3761, lng: 83.0227, sub: "Where Buddha delivered his first sermon", location: "Sarnath", image: "/images/sarnath.png", rating: 4.6, timing: "9 AM - 5 PM", distance: "8.2 km", crowdLevel: "Low" },
  { id: "bhu-campus", name: "BHU Campus (VT)", type: "Heritage", lat: 25.2677, lng: 82.9904, sub: "Asia's largest residential campus & VT temple", location: "Lanka", image: "/images/ghats-night.png", rating: 4.7, timing: "Campus hours", distance: "4.8 km", crowdLevel: "Moderate" },
  { id: "kaal-bhairav", name: "Kaal Bhairav Temple", type: "Temple", lat: 25.3204, lng: 83.0141, sub: "The guardian commander (Kotwal) of Kashi", location: "Vishweshwarganj", image: "/images/kaal-bhairav.png", rating: 4.8, timing: "5 AM - 10 PM", distance: "1.2 km", crowdLevel: "High", queueTime: "15 min" },
  { id: "manikarnika-ghat", name: "Manikarnika Ghat", type: "Heritage", lat: 25.3113, lng: 83.0137, sub: "Sacred cremation ground for eternal salvation", location: "Manikarnika", image: "/images/manikarnika-ghat.png", rating: 4.8, timing: "Open All Day", distance: "0.6 km", crowdLevel: "Moderate" },
  { id: "ramnagar-fort", name: "Ramnagar Fort", type: "Heritage", lat: 25.2684, lng: 83.0252, sub: "18th-century royal sandstone fort on the Ganga", location: "Ramnagar", image: "/images/ramnagar-fort.png", rating: 4.6, timing: "10 AM - 5 PM", distance: "5.1 km", crowdLevel: "Low" },
  { id: "swarved-mahamandir", name: "Swarved Mahamandir", type: "Temple", lat: 25.3948, lng: 83.0567, sub: "Colossal multistory meditation temple structure", location: "Umaraha", image: "/images/swarved-mahamandir.png", rating: 4.9, timing: "6 AM - 7 PM", distance: "12.5 km", crowdLevel: "Low" },
  { id: "tamatar-chaat", name: "Kashi Chaat Bhandar", type: "Food", lat: 25.3094, lng: 83.0062, sub: "Legendary stall serving hot, savory Tamatar Chaat", location: "Godowlia Chowk", image: "/images/tamatar-chaat.png", rating: 4.8, timing: "3 PM - 10:30 PM", distance: "0.3 km", crowdLevel: "High" },
  { id: "ram-bhandar", name: "Ram Bhandar", type: "Food", lat: 25.3190, lng: 83.0108, sub: "Historic spot for Banarasi Kachori Sabji & Jalebi", location: "Chowk", image: "/images/kachori-sabji.png", rating: 4.7, timing: "7 AM - 1:30 PM", distance: "1.1 km", crowdLevel: "High" },
  { id: "blue-lassi", name: "Blue Lassi Shop", type: "Food", lat: 25.3120, lng: 83.0125, sub: "Famous creamy yogurt lassi in clay kulhads", location: "Kachori Gali", image: "/images/banarasi-lassi.png", rating: 4.6, timing: "9 AM - 10 PM", distance: "0.5 km", crowdLevel: "Moderate" },
  { id: "lakhania-dari", name: "Lakhaniya Hills Park", type: "Parks", lat: 25.0748, lng: 83.0988, sub: "Scenic park with waterfalls and hiking trails", location: "Chunar Range", image: "/images/custom-dashboard-bg.jpg", rating: 4.5, timing: "8 AM - 5 PM", distance: "45 km", crowdLevel: "Low" },
  { id: "alaknanda-jetty", name: "Alaknanda Jetty", type: "Boat", lat: 25.3032, lng: 83.0135, sub: "Luxury Ganga double-decker cruise liner", location: "Ravidas Ghat Jetty", image: "/images/alaknanda-jetty.jpg", rating: 4.8, timing: "5 AM - 9 PM", distance: "2.1 km", crowdLevel: "Moderate" },
  { id: "subah-e-banaras-spot", name: "Subah-e-Banaras Spot", type: "Photo Spots", lat: 25.2892, lng: 83.0075, sub: "Perfect photographic sunrise angle spot", location: "Assi Ghat steps", image: "/images/assi-ghat-aarti.jpg", rating: 4.9, timing: "5 AM - 8 AM", distance: "2.5 km", crowdLevel: "Moderate" },
  { id: "tourist-plaza", name: "Varanasi Tourist Help Desk", type: "Facilities", lat: 25.3082, lng: 83.0094, sub: "Government tourist support & clean washrooms", location: "Godowlia", image: "/images/ghats-night.png", rating: 4.4, timing: "9 AM - 6 PM", distance: "0.1 km", crowdLevel: "Low" }
];

const MOCK_DIRECTIONS: Record<string, string[]> = {
  "kashi-vishwanath": [
    "🏁 Start from Godowlia Chowk walking junction.",
    "➡️ Turn right into the main corridor gateway street (Vishwanath Gali) - 150m.",
    "⛩️ Pass through the security checkpoints. Keep bag deposits in lockers.",
    "🔱 Walk past local shops selling fresh marigolds and milk offerings - 100m.",
    "📍 Reach Entry Gate 4 (Dundhiraj Ganesh entrance) of the temple corridor."
  ],
  "assi-ghat": [
    "🏁 Start from Lanka crossing near BHU entry gate.",
    "➡️ Walk East along the Assi Road canopy trees - 1.2 km.",
    "☕ Pass Pappu Chai Stall on your left. Stop for ginger lemon tea if you have time!",
    "🔄 Turn right at the Assi crossing lane towards the river steps.",
    "📍 Arrive at the wide stone steps of Assi Ghat."
  ],
  "dashashwamedh-ghat": [
    "🏁 Start from Godowlia Chowk junction.",
    "⬇️ Walk straight down the main marketplace road (Dashashwamedh Road) - 400m.",
    "🛍️ Walk past shops selling Banarasi silk sarees and wood crafts.",
    "🌊 Step down the central stone ghat stairs facing the river Ganges.",
    "📍 Arrive at the main Aarti performance stage platform."
  ],
  "alaknanda-jetty": [
    "🏁 Start from Ravidas Park entry gate.",
    "⬇️ Walk down towards the river bank steps - 150m.",
    "🚤 Walk left along the sandy bank towards the metal gangway boarding ramp.",
    "📍 Arrive at the Alaknanda luxury double-decker cruise boarding jetty."
  ]
};

const SUGGESTED_ROUTES: TrailData[] = [
  {
    name: "🛕 Temple Trail",
    desc: "Kaal Bhairav ➔ Kashi Vishwanath ➔ Swarved Mahamandir",
    color: "#D4AF37",
    coordinates: [
      [25.3204, 83.0141],
      [25.3108, 83.0104],
      [25.3948, 83.0567]
    ]
  },
  {
    name: "🍛 Food Trail",
    desc: "Kashi Chaat ➔ Ram Bhandar ➔ Blue Lassi",
    color: "#E8750A",
    coordinates: [
      [25.3094, 83.0062],
      [25.3190, 83.0108],
      [25.3120, 83.0125]
    ]
  },
  {
    name: "📸 Photo Trail",
    desc: "Assi Ghat steps ➔ Subah-e-Banaras Spot ➔ Dashashwamedh",
    color: "#EC4899",
    coordinates: [
      [25.2895, 83.0071],
      [25.2892, 83.0075],
      [25.3068, 83.0101]
    ]
  },
  {
    name: "🚤 Boat Trail",
    desc: "Assi Ghat ➔ Alaknanda Jetty ➔ Dashashwamedh",
    color: "#06B6D4",
    coordinates: [
      [25.2895, 83.0071],
      [25.3032, 83.0135],
      [25.3068, 83.0101]
    ]
  },
  {
    name: "🎆 Aarti Trail",
    desc: "Kashi Vishwanath ➔ Dashashwamedh Ghat Aarti ➔ Manikarnika",
    color: "#A855F7",
    coordinates: [
      [25.3108, 83.0104],
      [25.3068, 83.0101],
      [25.3113, 83.0137]
    ]
  }
];

const FILTER_CHIPS = [
  { id: "All", label: "All Pins", emoji: "🗺️", color: "#D4AF37" },
  { id: "Temple", label: "Temples", emoji: "🛕", color: "#D4AF37" },
  { id: "Food", label: "Street Food", emoji: "🍛", color: "#E8750A" },
  { id: "Events", label: "Ganga Aarti", emoji: "🔥", color: "#A855F7" },
  { id: "Heritage", label: "Heritage", emoji: "🏛️", color: "#3B82F6" },
  { id: "Boat", label: "Boat Ride", emoji: "🚤", color: "#06B6D4" },
  { id: "Photo Spots", label: "Photo Spots", emoji: "📸", color: "#EC4899" },
  { id: "Facilities", label: "Facilities", emoji: "🚻", color: "#6B7280" }
];

const AI_COMPANION_RESPONSES: Record<string, { reply: string; focusId?: string }> = {
  "kachori": { reply: "You can find legendary Banarasi Kachori Sabji at Ram Bhandar, located in Chowk. They serve it fresh in the mornings!", focusId: "ram-bhandar" },
  "temple": { reply: "The holy heart of Kashi is the Kashi Vishwanath Temple. I recommend taking the Kashi Holy Walk trail.", focusId: "kashi-vishwanath" },
  "lassi": { reply: "For authentic, thick yogurt lassi topped with malai in clay kulhads, visit the historic Blue Lassi Shop near Manikarnika.", focusId: "blue-lassi" },
  "aarti": { reply: "The grandest Ganga Aarti occurs at Dashashwamedh Ghat starting at 6:45 PM daily. Secure a boat seat early!", focusId: "dashashwamedh-ghat" }
};

const getColorForType = (type: string) => {
  switch (type) {
    case "Temple": return "#D4AF37"; // Gold
    case "Food": return "#E8750A"; // Orange
    case "Heritage": return "#3B82F6"; // Blue
    case "Events": return "#A855F7"; // Purple
    case "Parks": return "#22C55E"; // Green
    case "Boat": return "#06B6D4"; // Cyan
    case "Photo Spots": return "#EC4899"; // Pink
    case "Facilities": return "#6B7280"; // Gray
    default: return "#D4AF37";
  }
};

const PLACEHOLDER_PROMPTS = [
  "Find the best lassi near Kashi Vishwanath",
  "Plan a 3-hour spiritual walk",
  "Show evening Ganga Aarti",
  "Where to find authentic kachori?"
];

export default function MapExplorerPage() {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFocusId, setActiveFocusId] = useState<string | null>(null);
  const [activeTrail, setActiveTrail] = useState<string | null>(null);
  
  // Collapsible overlay UI elements
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<MarkerData | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  
  // Search Bar rotating placeholder prompts
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Audio guide controls
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLang, setAudioLang] = useState<"en" | "hi">("en");
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  
  // Custom Wishlist & Share controls
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Floating AI companion assistant
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string; focusId?: string }>>([
    { sender: "ai", text: "Namaste! I am your Kashi AI guide. Ask me where to find the best lassi, the most peaceful temples, or how to see the Ganga Aarti!" }
  ]);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersGroup = useRef<any>(null);
  const activeMarkers = useRef<Record<string, any>>({});
  const activePolyline = useRef<any>(null);

  // Filter markers list based on search or category
  const filteredMarkers = MARKERS.filter(m => {
    const matchesFilter = filter === "All" || m.type === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Rotate placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || leafletMap.current) return;

    const isLightMode = document.documentElement.classList.contains("light");
    const tileUrl = isLightMode
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    leafletMap.current = L.map(mapRef.current, {
      center: [25.3176, 83.0062],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(leafletMap.current);
    markersGroup.current = L.layerGroup().addTo(leafletMap.current);

    renderMarkers();

    // Focus link helper
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const focusId = searchParams.get("focus");
      if (focusId) {
        setActiveFocusId(focusId);
        const markerObj = MARKERS.find(m => m.id === focusId);
        if (markerObj) setSelectedPlace(markerObj);
        focusLocation(focusId);
      }
    }, 500);
  }, []);

  // Change theme layer dynamically
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMap.current) return;

    const observer = new MutationObserver(() => {
      const isLightMode = document.documentElement.classList.contains("light");
      const newTileUrl = isLightMode
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

      leafletMap.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          leafletMap.current.removeLayer(layer);
        }
      });

      L.tileLayer(newTileUrl, { maxZoom: 19 }).addTo(leafletMap.current);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Re-draw markers on filter/search change
  useEffect(() => {
    renderMarkers();
  }, [filter, searchQuery]);

  // Handle active routes/trails polyline drawing
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMap.current) return;

    if (activePolyline.current) {
      leafletMap.current.removeLayer(activePolyline.current);
      activePolyline.current = null;
    }

    if (activeTrail) {
      const trail = SUGGESTED_ROUTES.find(t => t.name === activeTrail);
      if (trail) {
        activePolyline.current = L.polyline(trail.coordinates, {
          color: trail.color,
          weight: 4,
          dashArray: "8, 8",
          opacity: 0.85
        }).addTo(leafletMap.current);

        leafletMap.current.fitBounds(activePolyline.current.getBounds(), { padding: [40, 40] });
      }
    }
  }, [activeTrail]);

  // Cleanup speech synthesis on place change
  useEffect(() => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setShowDirections(false);
  }, [selectedPlace]);

  const renderMarkers = () => {
    const L = (window as any).L;
    if (!L || !markersGroup.current) return;

    markersGroup.current.clearLayers();
    activeMarkers.current = {};

    filteredMarkers.forEach(m => {
      const pinColor = getColorForType(m.type);
      
      const customIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center cursor-pointer">
                 <div class="absolute w-8.5 h-8.5 rounded-full animate-ping opacity-25" style="background-color: ${pinColor};"></div>
                 <div class="relative w-5 h-5 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110" style="background: linear-gradient(135deg, ${pinColor} 0%, #0d0b08 100%);">
                   <div class="w-1.5 h-1.5 rounded-full bg-[#FFF5DF]" style="box-shadow: 0 0 5px ${pinColor};"></div>
                 </div>
               </div>`,
        className: "custom-marker-div",
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const popupContent = `
        <div style="font-family: inherit; color: #fff; padding: 4px;">
          <div style="height: 100px; width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 8px; border: 1px solid rgba(212, 175, 55, 0.15);">
            <img src="${m.image}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: ${pinColor}; border: 1px solid ${pinColor}30; background: ${pinColor}15; padding: 2.5px 8px; border-radius: 99px; display: inline-block; margin-bottom: 6px;">${m.type}</span>
          <h4 style="margin: 2px 0; font-size: 13px; font-weight: bold; color: #fff; font-family: Playfair Display, serif;">${m.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 10.5px; color: rgba(255,255,255,0.7); line-height: 1.35;">${m.sub}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #D4AF37; border-top: 1px solid rgba(212, 175, 55, 0.1); padding-top: 6px; margin-top: 2px;">
            <span>📍 ${m.location}</span>
            <span style="color: #D4AF37; font-weight: bold;">⭐ ${m.rating}</span>
          </div>
        </div>
      `;

      const marker = L.marker([m.lat, m.lng], { icon: customIcon })
        .bindPopup(popupContent, { closeButton: false, offset: [0, -5] });

      // Custom popup click mapping to UI Side Drawer
      marker.on("click", () => {
        setSelectedPlace(m);
        setActiveFocusId(m.id);
      });

      markersGroup.current.addLayer(marker);
      activeMarkers.current[m.id] = marker;
    });
  };

  const focusLocation = (id: string) => {
    const marker = activeMarkers.current[id];
    const markerData = MARKERS.find(m => m.id === id);
    if (marker && markerData && leafletMap.current) {
      leafletMap.current.setView([markerData.lat, markerData.lng], 16, { animate: true, duration: 1.2 });
      setTimeout(() => {
        marker.openPopup();
      }, 1200);
    }
  };

  const handleZoomIn = () => {
    if (leafletMap.current) leafletMap.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (leafletMap.current) leafletMap.current.zoomOut();
  };

  // AI companion chatbot submission handler
  const handleAIChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim()) return;

    const userText = aiChatQuery.trim();
    setAiChatHistory(prev => [...prev, { sender: "user", text: userText }]);
    setAiChatQuery("");

    setTimeout(() => {
      let matchedResponse = "I can help you navigate to any historical site or street food stall in Varanasi. Try asking about 'lassi', 'kachori', 'temple', or 'aarti'!";
      let focusId: string | undefined;

      const lower = userText.toLowerCase();
      for (const [key, val] of Object.entries(AI_COMPANION_RESPONSES)) {
        if (lower.includes(key)) {
          matchedResponse = val.reply;
          focusId = val.focusId;
          break;
        }
      }

      setAiChatHistory(prev => [...prev, { sender: "ai", text: matchedResponse, focusId }]);
    }, 800);
  };

  // Premim search trigger from prompt rotation
  const handleAISearchTrigger = (query: string) => {
    setSearchQuery(query);
    const lower = query.toLowerCase();
    if (lower.includes("lassi")) {
      setFilter("Food");
      setActiveFocusId("blue-lassi");
      const place = MARKERS.find(m => m.id === "blue-lassi");
      if (place) setSelectedPlace(place);
      focusLocation("blue-lassi");
    } else if (lower.includes("spiritual walk")) {
      setActiveTrail("🌸 Spiritual Walk");
    } else if (lower.includes("aarti")) {
      setFilter("Events");
      setActiveFocusId("dashashwamedh-ghat");
      const place = MARKERS.find(m => m.id === "dashashwamedh-ghat");
      if (place) setSelectedPlace(place);
      focusLocation("dashashwamedh-ghat");
    } else if (lower.includes("kachori")) {
      setFilter("Food");
      setActiveFocusId("ram-bhandar");
      const place = MARKERS.find(m => m.id === "ram-bhandar");
      if (place) setSelectedPlace(place);
      focusLocation("ram-bhandar");
    }
  };

  // Audio guide voice playback trigger
  const handleToggleAudioGuide = () => {
    if (!selectedPlace) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Get story text details from database
    const cleanName = selectedPlace.name.replace(" Temple", "").replace(" (Dhamek Stupa)", "").replace(" (VT)", "");
    const storyKey = Object.keys(STORIES_DATA).find(k => k.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(k.toLowerCase()));
    
    let textToSpeak = selectedPlace.sub;
    if (storyKey) {
      const storyObj = STORIES_DATA[storyKey];
      textToSpeak = audioLang === "hi" ? storyObj.hindi : storyObj.english;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = audioLang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = audioSpeed;
    utterance.onend = () => setIsPlayingAudio(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Wishlist toggle helper
  const handleToggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Share link copier helper
  const handleShareClick = (id: string) => {
    const shareUrl = `${window.location.origin}/map?focus=${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  return (
    <Layout>
      {/* Styles for Leaflet Custom Popups and Map Tint Filter */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(13, 11, 8, 0.96) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(212, 175, 55, 0.25) !important;
          border-radius: 24px !important;
          color: white !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.7) !important;
        }
        .leaflet-popup-tip {
          background: rgba(13, 11, 8, 0.96) !important;
          border: 1px solid rgba(212, 175, 55, 0.25) !important;
        }
        .leaflet-popup-content {
          margin: 12px 14px !important;
          font-family: 'Inter', sans-serif;
        }
        .leaflet-tile-container {
          filter: saturate(1.05) contrast(1.05) brightness(0.9) !important;
        }
        .light .leaflet-tile-container {
          filter: none !important;
        }
      `}</style>

      <div className="w-full h-[calc(100vh-64px)] relative flex overflow-hidden bg-[#0d0b08]">
        
        {/* The Leaflet interactive map */}
        <div ref={mapRef} className="w-full h-full z-0 absolute inset-0" style={{ background: "#080502" }} />

        {/* Collapsible Floating Left Panel (Apple Maps style overlay) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="absolute top-4 left-4 z-10 w-[350px] max-h-[calc(100%-32px)] bg-[#0d0b08]/92 backdrop-blur-xl border border-[#D4AF37]/20 rounded-3xl p-4 shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Sidebar Header with Gold Logo branding */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2.5 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#D4AF37] animate-spin-slow" />
                  <span className="font-serif font-bold text-sm text-[#D4AF37] tracking-wide uppercase">Kashi Navigator</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="text-[#D4AF37] hover:text-[#fff] cursor-pointer p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Premium AI Search input with rotating placeholder prompt */}
              <div className="relative mb-3.5 flex-shrink-0">
                <div className="absolute left-3 top-3 flex items-center gap-1 text-[#D4AF37]/65 pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <input
                  type="text"
                  placeholder={PLACEHOLDER_PROMPTS[placeholderIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/45 border border-[#D4AF37]/20 rounded-xl py-2.5 pl-9 pr-8 text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all font-medium"
                />
                {searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-3 top-2.5 text-[#D4AF37] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAISearchTrigger(PLACEHOLDER_PROMPTS[placeholderIndex])}
                    className="absolute right-3 top-2.5 text-[10px] text-[#D4AF37] font-bold hover:underline hover:text-white"
                  >
                    Ask
                  </button>
                )}
              </div>

              {/* Suggested AI Trails routes */}
              <div className="mb-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-xs text-white">AI Suggested Trails</h4>
                </div>
                <div className="overflow-x-auto flex gap-2 pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
                  {SUGGESTED_ROUTES.map(trail => {
                    const isSelected = activeTrail === trail.name;
                    return (
                      <button
                        key={trail.name}
                        onClick={() => {
                          setActiveTrail(isSelected ? null : trail.name);
                          setSelectedPlace(null);
                          setActiveFocusId(null);
                        }}
                        className="text-[10px] py-1.5 px-3 rounded-full border shrink-0 text-left cursor-pointer transition-all duration-300 font-semibold bg-black/25 flex items-center gap-1.5"
                        style={{
                          borderColor: isSelected ? trail.color : "rgba(212,175,55,0.15)",
                          color: isSelected ? trail.color : "rgba(255,255,255,0.6)"
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: trail.color }}></span>
                        {trail.name.split(" ")[1] || trail.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Place Listing directory */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin" style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-xs text-white">Pilgrimage Locations ({filteredMarkers.length})</h4>
                </div>

                {filteredMarkers.map(m => {
                  const pinColor = getColorForType(m.type);
                  const isActive = activeFocusId === m.id;
                  return (
                    <motion.div
                      key={m.id}
                      onClick={() => {
                        setSelectedPlace(m);
                        setActiveFocusId(m.id);
                        focusLocation(m.id);
                      }}
                      whileHover={{ scale: 1.01 }}
                      className={`flex gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border ${
                        isActive
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/45"
                          : "bg-black/25 border-white/5 hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/5">
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[8px] bg-black/75 px-1.5 py-0.5 rounded-md font-bold" style={{ color: pinColor }}>
                          {m.type}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-[11px] text-white leading-snug truncate">{m.name}</h4>
                          <span className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-0.5 shrink-0">⭐ {m.rating}</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-normal line-clamp-2 mt-0.5">{m.sub}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[9px] text-[#D4AF37]/75 font-semibold">📍 {m.location}</span>
                          <span className="text-[9px] text-white/40">{m.distance} away</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredMarkers.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No matching locations found.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Sidebar Toggle Button when Closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 bg-[#0d0b08]/92 backdrop-blur-xl border border-[#D4AF37]/25 text-[#D4AF37] p-2.5 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-5 h-5" />
            <span className="text-xs font-bold font-serif hidden md:inline">Open Directory</span>
          </button>
        )}

        {/* Floating Category Filter Chips (top panel style) */}
        <div className="absolute top-4 left-[80px] md:left-[380px] right-[240px] z-10 flex gap-2 overflow-x-auto pb-2 select-none scrollbar-none pointer-events-auto pr-4" style={{ scrollbarWidth: "none" }}>
          {FILTER_CHIPS.map(chip => {
            const isActive = filter === chip.id;
            return (
              <motion.button
                key={chip.id}
                onClick={() => {
                  setFilter(chip.id);
                  setActiveFocusId(null);
                  setActiveTrail(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[10px] md:text-xs font-semibold cursor-pointer border backdrop-blur-md shadow-sm transition-all duration-300 shrink-0"
                style={{
                  borderColor: isActive ? chip.color : "rgba(212, 175, 55, 0.15)",
                  background: isActive ? `${chip.color}15` : "rgba(13, 11, 8, 0.85)",
                  color: isActive ? chip.color : "rgba(255, 255, 255, 0.6)"
                }}
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Floating Live Telemetry Widgets (Airbnb inspired top right stack) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 max-w-[200px] pointer-events-none md:pointer-events-auto">
          {/* Weather & AQI */}
          <div className="bg-[#0d0b08]/85 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#D4AF37] animate-spin-slow flex-shrink-0" />
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-wider font-bold">Varanasi Live</p>
              <p className="text-[10px] text-white font-bold">31°C • AQI 85</p>
            </div>
          </div>

          {/* Ganga Aarti Live countdown */}
          <div className="bg-[#0d0b08]/85 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#E8750A] animate-pulse flex-shrink-0" />
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-wider font-bold">Ganga Aarti</p>
              <p className="text-[10px] text-white font-bold">Starts in 2h 15m</p>
            </div>
          </div>

          {/* Temple queue and crowd level stats */}
          <div className="bg-[#0d0b08]/85 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
            <div>
              <p className="text-[8px] text-white/50 uppercase tracking-wider font-bold">Queue status</p>
              <p className="text-[10px] text-white font-bold">KVT: 35 min wait</p>
            </div>
          </div>
        </div>

        {/* Zoom Controls & Floating Sparkles AI Assistant (bottom right) */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2.5 z-10 items-end">
          <div className="flex flex-col gap-1 bg-[#0d0b08]/92 backdrop-blur-xl border border-[#D4AF37]/20 p-1 rounded-2xl shadow-lg">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0d0b08] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0d0b08] transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            onClick={() => setAiCompanionOpen(!aiCompanionOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-tr from-[#D4AF37] to-[#E8750A] rounded-2xl flex items-center justify-center shadow-lg text-[#0d0b08] hover:scale-105 transition-all cursor-pointer relative group"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute right-14 bg-[#0d0b08]/95 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              Ask Kashi AI
            </span>
          </motion.button>
        </div>

        {/* Sliding Bottom Sheet Drawer (Airbnb inspired info sheets) */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 250, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[410px] bg-[#0d0b08]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl overflow-hidden z-20 shadow-2xl flex flex-col max-h-[70vh] md:max-h-[520px] pointer-events-auto"
            >
              {/* Card Image Banner */}
              <div className="h-[170px] w-full relative overflow-hidden flex-shrink-0">
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] to-transparent" />
                
                {/* Badge tags overlay */}
                <span 
                  className="absolute top-3 left-3 text-[9px] font-bold text-white tracking-wide uppercase px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md"
                  style={{ backgroundColor: `${getColorForType(selectedPlace.type)}30` }}
                >
                  {selectedPlace.type}
                </span>

                {/* Close sheet button */}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:text-black cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Places Details area */}
              <div className="p-4 flex-1 overflow-y-auto scrollbar-none text-left" style={{ scrollbarWidth: "none" }}>
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide leading-snug">{selectedPlace.name}</h3>
                  <div className="flex items-center gap-1 shrink-0 bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg border border-[#D4AF37]/25">
                    <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-xs text-[#D4AF37] font-bold">{selectedPlace.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-white/50 mb-3 border-b border-[#D4AF37]/10 pb-2">
                  <span className="flex items-center gap-1">📍 {selectedPlace.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#D4AF37]" /> {selectedPlace.timing}</span>
                  <span>•</span>
                  <span>{selectedPlace.distance} away</span>
                </div>

                {/* Narrative legends / stories text container or directions */}
                <div className="mb-4">
                  {showDirections ? (
                    <div>
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">🧭 AI Live Directions</span>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {(MOCK_DIRECTIONS[selectedPlace.id] || [
                          "🏁 Start from Godowlia main junction in center Varanasi.",
                          `🧭 Head towards ${selectedPlace.location} coordinates (${selectedPlace.lat}, ${selectedPlace.lng}).`,
                          `🚶 Distance is approximately ${selectedPlace.distance} - travel via walking or rickshaw.`,
                          "📍 Arrive at your destination."
                        ]).map((step, idx) => (
                          <div key={idx} className="flex gap-2 text-[10.5px] text-white/80 items-start bg-black/35 p-2 rounded-xl border border-white/5">
                            <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Historical Legend</span>
                        
                        {/* Bilingual Language & Speed Selector */}
                        <div className="flex gap-1.5 items-center">
                          <div className="flex border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-black/35 text-[9px] font-bold">
                            <button 
                              onClick={() => setAudioLang("en")}
                              className={`px-2 py-0.5 cursor-pointer ${audioLang === "en" ? "bg-[#D4AF37] text-black" : "text-white/60"}`}
                            >
                              EN
                            </button>
                            <button 
                              onClick={() => setAudioLang("hi")}
                              className={`px-2 py-0.5 cursor-pointer ${audioLang === "hi" ? "bg-[#D4AF37] text-black" : "text-white/60"}`}
                            >
                              हिन्दी
                            </button>
                          </div>

                          <div className="flex border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-black/35 text-[9px] font-bold">
                            <button 
                              onClick={() => {
                                setAudioSpeed(0.8);
                                if (isPlayingAudio) {
                                  window.speechSynthesis.cancel();
                                  setIsPlayingAudio(false);
                                }
                              }}
                              className={`px-1.5 py-0.5 cursor-pointer ${audioSpeed === 0.8 ? "bg-[#D4AF37] text-black" : "text-white/60"}`}
                              title="Slow Speed"
                            >
                              0.8x
                            </button>
                            <button 
                              onClick={() => {
                                setAudioSpeed(1.0);
                                if (isPlayingAudio) {
                                  window.speechSynthesis.cancel();
                                  setIsPlayingAudio(false);
                                }
                              }}
                              className={`px-1.5 py-0.5 cursor-pointer ${audioSpeed === 1.0 ? "bg-[#D4AF37] text-black" : "text-white/60"}`}
                              title="Normal Speed"
                            >
                              1.0x
                            </button>
                            <button 
                              onClick={() => {
                                setAudioSpeed(1.2);
                                if (isPlayingAudio) {
                                  window.speechSynthesis.cancel();
                                  setIsPlayingAudio(false);
                                }
                              }}
                              className={`px-1.5 py-0.5 cursor-pointer ${audioSpeed === 1.2 ? "bg-[#D4AF37] text-black" : "text-white/60"}`}
                              title="Fast Speed"
                            >
                              1.2x
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-white/70 leading-relaxed max-h-[100px] overflow-y-auto scrollbar-none pr-1">
                        {(() => {
                          const cleanName = selectedPlace.name.replace(" Temple", "").replace(" (Dhamek Stupa)", "").replace(" (VT)", "");
                          const storyKey = Object.keys(STORIES_DATA).find(k => k.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(k.toLowerCase()));
                          if (storyKey) {
                            return audioLang === "hi" ? STORIES_DATA[storyKey].hindi : STORIES_DATA[storyKey].english;
                          }
                          return selectedPlace.sub;
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Grid Panel (Airbnb & Apple style widgets) */}
                <div className="grid grid-cols-2 gap-2 border-t border-[#D4AF37]/10 pt-3">
                  
                  {/* Listen Guide TTS button */}
                  <button
                    onClick={handleToggleAudioGuide}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer hover:bg-[#D4AF37]/90 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/10"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4 animate-bounce" />
                        <span>Mute Guide</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Listen Guide</span>
                      </>
                    )}
                  </button>

                  {/* Directions Toggle Trigger */}
                  <button
                    onClick={() => {
                      setShowDirections(prev => !prev);
                      focusLocation(selectedPlace.id);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-all ${
                      showDirections 
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                        : "bg-black/45 border-[#D4AF37]/35 text-[#D4AF37] hover:bg-white/[0.02]"
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{showDirections ? "Hide Route" : "Directions"}</span>
                  </button>

                  {/* Wishlist toggle click */}
                  <button
                    onClick={() => handleToggleWishlist(selectedPlace.id)}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-black/45 border border-[#D4AF37]/10 text-white/80 font-bold text-xs rounded-xl cursor-pointer hover:bg-white/[0.02] active:scale-95 transition-all"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-transform ${
                        wishlist.includes(selectedPlace.id) ? "text-[#E8750A] fill-[#E8750A] scale-110" : "text-white/60"
                      }`} 
                    />
                    <span>Wishlist</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShareClick(selectedPlace.id)}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-black/45 border border-[#D4AF37]/10 text-white/80 font-bold text-xs rounded-xl cursor-pointer hover:bg-white/[0.02] active:scale-95 transition-all relative"
                  >
                    <Share2 className="w-4 h-4 text-white/60" />
                    <span>{shareCopied ? "Copied!" : "Share"}</span>
                  </button>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chatbot Dialogue Companion window */}
        <AnimatePresence>
          {aiCompanionOpen && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 50 }}
              className="absolute bottom-20 right-6 z-20 w-[330px] max-h-[400px] bg-card/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-3xl p-4 shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-serif font-bold text-xs text-foreground">Kashi AI Travel Companion</span>
                </div>
                <button onClick={() => setAiCompanionOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat history list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 mb-3 pr-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
                {aiChatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-2.5 text-[11px] leading-relaxed text-left ${
                      msg.sender === "user"
                        ? "bg-[#D4AF37]/20 border border-[#D4AF37]/45 text-foreground font-medium"
                        : "bg-muted/70 border border-border text-foreground/85"
                    }`}>
                      {msg.text}
                      {msg.focusId && (
                        <button
                          onClick={() => {
                            const found = MARKERS.find(m => m.id === msg.focusId);
                            if (found) {
                              setSelectedPlace(found);
                              setActiveFocusId(msg.focusId!);
                            }
                            focusLocation(msg.focusId!);
                          }}
                          className="mt-2 flex items-center gap-1 text-[10px] text-[#D4AF37] font-bold hover:underline cursor-pointer"
                        >
                          Show on Map <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input form */}
              <form onSubmit={handleAIChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={aiChatQuery}
                  onChange={(e) => setAiChatQuery(e.target.value)}
                  placeholder="Ask: best lassi, kachori, etc..."
                  className="flex-1 bg-muted border border-border rounded-xl py-2 px-3 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#D4AF37] font-medium"
                />
                <button type="submit" className="bg-[#D4AF37] text-black text-[11px] font-bold rounded-xl px-3 hover:bg-[#D4AF37]/90 active:scale-95 cursor-pointer">
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}