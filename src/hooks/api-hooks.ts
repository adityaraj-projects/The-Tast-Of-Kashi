import { useState, useEffect, useCallback } from "react";
import { supabase, isMockMode } from "@/lib/supabaseClient";
import { STORIES_DATA } from "@/lib/stories-data";
import {
  mockDashboardSummary,
  mockRecommended,
  mockCategories,
  mockVendors,
  mockStories,
  mockEvents,
  mockUserJourney,
  mockAiSuggestions,
  mockWishlist,
} from "@/lib/mock-data";

export function useGetDashboardSummary() {
  const [data, setData] = useState(mockDashboardSummary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: foodsCount },
          { count: attrCount },
          { count: vendorCount },
          { count: storyCount }
        ] = await Promise.all([
          supabase.from("foods").select("*", { count: "exact", head: true }),
          supabase.from("attractions").select("*", { count: "exact", head: true }),
          supabase.from("vendors").select("*", { count: "exact", head: true }),
          supabase.from("cultural_stories").select("*", { count: "exact", head: true }),
        ]);

        setData({
          totalFoods: foodsCount || mockDashboardSummary.totalFoods,
          totalAttractions: attrCount || mockDashboardSummary.totalAttractions,
          totalVendors: vendorCount || mockDashboardSummary.totalVendors,
          totalStories: storyCount || mockDashboardSummary.totalStories,
          totalExplorers: mockDashboardSummary.totalExplorers,
        });
      } catch (err) {
        console.warn("Failed to fetch counts from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return { data, isLoading };
}

export function useGetDashboardRecommended() {
  const [data, setData] = useState(mockRecommended);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { data: dbFoods } = await supabase.from("foods").select("*").limit(3);
        const { data: dbAttractions } = await supabase.from("attractions").select("*").limit(2);
        
        if ((dbFoods && dbFoods.length > 0) || (dbAttractions && dbAttractions.length > 0)) {
          const mappedFoods = (dbFoods || []).map(f => ({
            id: `food_${f.id}`,
            title: f.name,
            type: "Food",
            rating: Number(f.rating || 4.8),
            subtitle: f.tagline || f.description || "",
            imageUrl: f.image_url || f.imageUrl || "/images/logo.png",
            location: f.location || "Varanasi",
          }));
          const mappedAttr = (dbAttractions || []).map(a => ({
            id: `attr_${a.id}`,
            title: a.name,
            type: a.type || "Attraction",
            rating: Number(a.rating || 4.9),
            subtitle: a.description || a.sub || "",
            imageUrl: a.image_url || a.imageUrl || "/images/logo.png",
            location: a.location || "Varanasi",
          }));
          setData([...mappedFoods, ...mappedAttr]);
        }
      } catch (err) {
        console.warn("Failed to fetch recommended from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  return { data, isLoading };
}

export function useGetCategories() {
  return { data: mockCategories, isLoading: false };
}

export function useGetVendors(params?: { limit?: number }) {
  const [data, setData] = useState<typeof mockVendors>(() => {
    return params?.limit ? mockVendors.slice(0, params.limit) : mockVendors;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        let query = supabase.from("vendors").select("*");
        if (params?.limit) {
          query = query.limit(params.limit);
        }
        const { data: dbData, error: dbError } = await query;
        if (dbError) throw dbError;
        if (dbData && dbData.length > 0) {
          const hasInvalid = dbData.some(v => !v.name || v.name.toLowerCase().includes("generic") || v.name.toLowerCase().includes("mock"));
          if (hasInvalid) {
            setData(params?.limit ? mockVendors.slice(0, params.limit) : mockVendors);
          } else {
            const mapped = dbData.map(v => ({
              id: String(v.id),
              name: v.name || v.fullName || "",
              specialty: v.specialty || "",
              location: v.location || "",
              rating: Number(v.rating || 4.7),
              imageUrl: v.image_url || v.imageUrl || "/images/logo.png",
              isVerified: !!v.is_verified || !!v.isVerified,
            }));
            setData(mapped);
          }
        } else {
          setData(params?.limit ? mockVendors.slice(0, params.limit) : mockVendors);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch vendors from Supabase:", err);
        setData(params?.limit ? mockVendors.slice(0, params.limit) : mockVendors);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [params?.limit]);

  return { data, isLoading, error };
}

export function useGetStories(params?: { limit?: number }) {
  const [data, setData] = useState<any[]>(() => {
    return params?.limit ? mockStories.slice(0, params.limit) : mockStories;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        let query = supabase.from("cultural_stories").select("*");
        if (params?.limit) {
          query = query.limit(params.limit);
        }
        const { data: dbStories, error: dbError } = await query;
        if (dbError) throw dbError;
        if (dbStories && dbStories.length > 0) {
          const hasInvalid = dbStories.some(s => !s.title || s.title.toLowerCase().includes("stroll") || s.title.toLowerCase().includes("alley"));
          if (hasInvalid) {
            setData(params?.limit ? mockStories.slice(0, params.limit) : mockStories);
          } else {
            const mapped = dbStories.map(s => ({
              id: String(s.id),
              title: s.title,
              category: s.category || "Mythology",
              readTime: s.duration || s.read_time || s.readTime || "5 min read",
              imageUrl: s.image_url || s.image || s.imageUrl || "/images/logo.png",
              excerpt: s.description || s.content || s.excerpt || "",
              audioUrl: s.audio_url || s.audioUrl || "",
            }));
            setData(mapped);
          }
        } else {
          setData(params?.limit ? mockStories.slice(0, params.limit) : mockStories);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch stories from Supabase:", err);
        setData(params?.limit ? mockStories.slice(0, params.limit) : mockStories);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [params?.limit]);

  return { data, isLoading, error };
}

export function useGetEvents(params?: { limit?: number }) {
  const [data, setData] = useState<any[]>(() => {
    return params?.limit ? mockEvents.slice(0, params.limit) : mockEvents;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let query = supabase.from("events").select("*");
        if (params?.limit) {
          query = query.limit(params.limit);
        }
        const { data: dbEvents, error: dbError } = await query;
        if (dbError) throw dbError;
        if (dbEvents && dbEvents.length > 0) {
          const hasInvalid = dbEvents.some(e => !e.title && !e.name);
          if (hasInvalid) {
            setData(params?.limit ? mockEvents.slice(0, params.limit) : mockEvents);
          } else {
            const mapped = dbEvents.map(e => ({
              id: String(e.id),
              name: e.title || e.name || "",
              date: e.date || e.event_date || "",
              status: e.status || "Upcoming",
              description: e.tagline || e.description || "",
              imageUrl: e.image_url || e.image || e.imageUrl || "/images/logo.png",
              timing: e.timing || "Full Day",
              location: e.location || "Varanasi",
              spots: e.spots ? (typeof e.spots === "string" ? e.spots.split(",") : e.spots) : ["Assi Ghat"],
              logistics: e.logistics || "Direct public transit options available.",
              crowd: e.crowd || "Moderate"
            }));
            setData(mapped);
          }
        } else {
          setData(params?.limit ? mockEvents.slice(0, params.limit) : mockEvents);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch events from Supabase:", err);
        setData(params?.limit ? mockEvents.slice(0, params.limit) : mockEvents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [params?.limit]);

  return { data, isLoading, error };
}

export const FOODS_FALLBACK = [
  { name: "Tamatar Chaat", tagline: "The Iconic Street Delight", image: "/images/tamatar-chaat.png", rating: 4.8, price: 40, category: "Street Food", isVeg: true, spice: "Medium" },
  { name: "Malaiyyo", tagline: "Winter's Royal Treat", image: "/images/malaiyoo.png", rating: 4.7, price: 60, category: "Winter Special", isVeg: true, spice: "Mild" },
  { name: "Banarasi Lassi", tagline: "Rich, Creamy & Divine", image: "/images/banarasi-lassi.png", rating: 4.6, price: 35, category: "Beverages", isVeg: true, spice: "None" },
  { name: "Kachori Sabzi", tagline: "Crispy & Spicy Breakfast", image: "/images/kachori-sabji.png", rating: 4.7, price: 30, category: "Breakfast", isVeg: true, spice: "Spicy" },
  { name: "Rabri Jalebi", tagline: "Timeless Sweet Combo", image: "/images/jalebi-imarti.png", rating: 4.6, price: 50, category: "Sweets", isVeg: true, spice: "None" },
  { name: "Banarasi Paan", tagline: "A Tradition of Taste", image: "/images/banarasi-paan.png", rating: 4.8, price: 20, category: "Specialty", isVeg: true, spice: "None" },
  { name: "Kulfi Falooda", tagline: "Creamy Frozen Bliss", image: "/images/kulfi-falooda.png", rating: 4.5, price: 55, category: "Desserts", isVeg: true, spice: "None" },
  { name: "Thandai", tagline: "Festival Drink of Kashi", image: "/images/thandai.png", rating: 4.7, price: 45, category: "Beverages", isVeg: true, spice: "Mild" },
  { name: "Malpua Rabri", tagline: "Fried Sweet Pancakes", image: "/images/malpua-rabri.png", rating: 4.6, price: 65, category: "Sweets", isVeg: true, spice: "None" },
  { name: "Rabdi", tagline: "Reduced Milk Dessert", image: "/images/rabdi.png", rating: 4.5, price: 40, category: "Sweets", isVeg: true, spice: "None" },
];

export const ATTRACTIONS_FALLBACK = [
  { name: "Kashi Vishwanath Temple", sub: "One of the 12 Jyotirlingas of Lord Shiva", image: "/images/kashi-vishwanath-aerial.jpg", rating: 4.9, type: "Temple", timing: "4 AM – 11 PM", location: "Vishwanath Gali" },
  { name: "Ganga Dwar", sub: "Grand entry corridor gates connecting Ganges to Temple", image: "/images/ganga-dwar.jpg", rating: 4.9, type: "Heritage", timing: "Open All Day", location: "Corridor Ghats" },
  { name: "Assi Ghat", sub: "Peaceful riverside ghat for yoga & spirituality", image: "/images/assi-ghat-aarti.jpg", rating: 4.7, type: "Ghat", timing: "Open All Day", location: "Assi, Varanasi" },
  { name: "Sarnath", sub: "Where Buddha gave his first sermon", image: "/images/sarnath.png", rating: 4.6, type: "Heritage", timing: "9 AM – 5 PM", location: "13 km from Varanasi" },
  { name: "Dashashwamedh Ghat", sub: "Grand Ganga Aarti every evening", image: "/images/dashashwamedh-ghat-aarti.jpg", rating: 4.8, type: "Ghat", timing: "Open All Day", location: "Dashashwamedh, Varanasi" },
  { name: "BHU Campus", sub: "One of Asia's largest residential universities", image: "/images/ghats-night.png", rating: 4.7, type: "Heritage", timing: "Campus hours", location: "Lanka, Varanasi" },
  { name: "Kaal Bhairav Temple", sub: "The ancient guardian temple of Kotwal of Kashi", image: "/images/kaal-bhairav.png", rating: 4.8, type: "Temple", timing: "5 AM – 10 PM", location: "K45/3, Vishweshwarganj" },
  { name: "Manikarnika Ghat", sub: "Most sacred cremation ground in Hinduism", image: "/images/manikarnika-ghat.png", rating: 4.8, type: "Ghat", timing: "Open All Day", location: "Manikarnika, Varanasi" },
  { name: "Ramnagar Fort", sub: "18th century royal fort on the Ganges", image: "/images/ramnagar-fort.png", rating: 4.6, type: "Heritage", timing: "10 AM – 5 PM", location: "Ramnagar, Varanasi" },
  { name: "Swarved Mahamandir", sub: "Grand multistory meditation temple", image: "/images/swarved-mahamandir.png", rating: 4.9, type: "Temple", timing: "6 AM – 7 PM", location: "Umaraha, Varanasi" },
  { name: "Alaknanda Jetty", sub: "Luxury double-decker Ganga cruise boarding jetty", image: "/images/alaknanda-jetty.jpg", rating: 4.8, type: "Boat", timing: "5 AM – 9 PM", location: "Ravidas Ghat Jetty, Varanasi" },
  { name: "Namo Ghat", sub: "Modern riverfront ghat famous for its majestic folded-hands sculptures", image: "/images/Namo Ghat.png", rating: 4.8, type: "Ghat", timing: "Open All Day", location: "Rajghat, Varanasi" },
];

export function useGetFoods() {
  const [data, setData] = useState<any[]>(() => {
    return FOODS_FALLBACK;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data: dbFoods, error: dbError } = await supabase.from("foods").select("*");
        if (dbError) throw dbError;
        if (dbFoods && dbFoods.length > 0) {
          const hasInvalid = dbFoods.some(f => !STORIES_DATA[f.name] || f.name.toLowerCase().includes("chicken") || f.name.toLowerCase().includes("tikka") || f.name.toLowerCase().includes("patty") || f.name.toLowerCase().includes("basmati"));
          if (hasInvalid) {
            setData(FOODS_FALLBACK);
          } else {
            const mapped = dbFoods.map(f => ({
              name: f.name || "",
              tagline: f.tagline || f.description || "",
              image: f.image_url || f.imageUrl || "/images/logo.png",
              rating: Number(f.rating || 4.7),
              price: Number(f.price || 40),
              category: f.category || "Street Food",
              isVeg: f.is_veg !== false,
              spice: f.spice || "Medium"
            }));
            setData(mapped);
          }
        } else {
          setData(FOODS_FALLBACK);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch foods from Supabase:", err);
        setData(FOODS_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, []);

  return { data, isLoading, error };
}

export function useGetAttractions() {
  const [data, setData] = useState<any[]>(() => {
    return ATTRACTIONS_FALLBACK;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const { data: dbAttractions, error: dbError } = await supabase.from("attractions").select("*");
        if (dbError) throw dbError;
        if (dbAttractions && dbAttractions.length > 0) {
          const hasInvalid = dbAttractions.some(a => !STORIES_DATA[a.name] || a.name.toLowerCase().includes("lucknow") || a.name.toLowerCase().includes("stroll") || a.name.toLowerCase().includes("jaipur"));
          if (hasInvalid) {
            setData(ATTRACTIONS_FALLBACK);
          } else {
            const mapped = dbAttractions.map(a => ({
              name: a.name || "",
              sub: a.description || a.sub || "",
              image: a.image_url || a.image || "/images/logo.png",
              rating: Number(a.rating || 4.8),
              type: a.type || "Ghat",
              timing: a.timing || "Open All Day",
              location: a.location || "Varanasi"
            }));
            setData(mapped);
          }
        } else {
          setData(ATTRACTIONS_FALLBACK);
        }
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch attractions from Supabase:", err);
        setData(ATTRACTIONS_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  return { data, isLoading, error };
}

export function useGetUserJourney() {
  return { data: mockUserJourney, isLoading: false };
}

export function useGetAiSuggestions() {
  return { data: mockAiSuggestions, isLoading: false };
}

export function useSendAiMessage() {
  const [isPending, setIsPending] = useState(false);

  const mutate = (
    args: any,
    options?: { onSuccess?: (data: { reply: string }) => void }
  ) => {
    setIsPending(true);
    const userMsg = args?.data?.message || "";

    setTimeout(() => {
      const reply = getKashiAiReply(userMsg);
      options?.onSuccess?.({ reply });
      setIsPending(false);
    }, 900);
  };

  return { mutate, isPending };
}

function getKashiAiReply(message: string): string {
  const msg = message.toLowerCase();

  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("namaste") ||
    msg.includes("pranam") ||
    msg.includes("mahadev")
  ) {
    return "Namaste and Har Har Mahadev! 🙏 I am your Kashi AI Companion—your friend, local guide, and guardian. Kashi is a land of mystical energy, ancient wisdom, and incredible food. What is on your mind today? Are we planning a trip, exploring heritage ghats, or looking for the best street food?";
  }

  if (
    msg.includes("food") ||
    msg.includes("eat") ||
    msg.includes("chaat") ||
    msg.includes("kachori") ||
    msg.includes("lassi") ||
    msg.includes("sweet") ||
    msg.includes("malaiyyo") ||
    msg.includes("paan") ||
    msg.includes("hungry") ||
    msg.includes("taste")
  ) {
    return (
      "Banaras is absolute heaven for food lovers! Here is my curated list of must-try delicacies:\n\n" +
      "• 🥞 **Kachori Sabzi**: Start your morning at *Ram Bhandar* near Chowk [📍 Open in Map Explorer](/map?focus=ram-bhandar) or *Chachi Ki Kachori* near Lanka for hot, spicy potato curry and crispy kachoris.\n" +
      "• 🍅 **Tamatar Chaat**: Head to *Kashi Chaat Bhandar* in Godowlia [📍 Open in Map Explorer](/map?focus=tamatar-chaat) for a legendary blend of mashed tomatoes, spices, and sweet cumin-ghee syrup.\n" +
      "• 🥛 **Banarasi Lassi**: Sip a thick, hand-churned yogurt drink topped with rabri and malai in clay kulhads at *Blue Lassi Shop* [📍 Open in Map Explorer](/map?focus=blue-lassi).\n" +
      "• 🍧 **Malaiyyo (Winter Exclusive)**: Try this light-as-air saffron-froth sweet, made by exposing milk to night dew.\n" +
      "• 🍃 **Banarasi Paan**: End your day with a sweet Meetha Paan at Keshav Tambul to complete the authentic Banarasi experience!\n\n" +
      "Which of these would you like to explore first?"
    );
  }

  if (
    msg.includes("temple") ||
    msg.includes("mandir") ||
    msg.includes("vishwanath") ||
    msg.includes("shiva") ||
    msg.includes("jyotirlinga") ||
    msg.includes("corridor")
  ) {
    return (
      "The sacred **Kashi Vishwanath Temple** is the heart of Kashi's spiritual energy. It houses one of the 12 Jyotirlingas, representing Shiva's infinite light. The temple was rebuilt in 1780 by Queen Ahilyabai Holkar and expanded recently with the grand **Kashi Vishwanath Corridor**, which directly links the temple to the banks of the Ganges. [📍 Open in Map Explorer](/map?focus=kashi-vishwanath)\n\n" +
      "💡 *Guide Tip*: Go early for the *Mangala Aarti* (around 3:00 AM) or visit in the afternoon when crowds are light. Always respect local customs and dress modestly."
    );
  }

  if (
    msg.includes("ghat") ||
    msg.includes("aarti") ||
    msg.includes("ganga") ||
    msg.includes("ganges") ||
    msg.includes("river") ||
    msg.includes("boat") ||
    msg.includes("sunrise") ||
    msg.includes("sunset")
  ) {
    return (
      "The Ganga and the Ghats are where Kashi truly breathes. Here is how to experience them:\n\n" +
      "🌅 **Subah-e-Banaras (Assi Ghat)**: Wake up early (around 5:00 AM) to witness the peaceful morning aarti, Vedic chants, yoga, and classical music as the sun rises over the river. [📍 Open in Map Explorer](/map?focus=assi-ghat)\n" +
      "⛵ **Ganga Boat Ride**: Hire a wooden boat from Assi Ghat to Manikarnika Ghat at sunrise. The reflections of the ancient architecture on the golden water are breathtaking. [📍 Open in Map Explorer](/map?focus=manikarnika-ghat)\n" +
      "🎆 **Ganga Aarti (Dashashwamedh Ghat)**: Every evening at sunset, witness the grand, synchronized ritual of fire, bells, and incense performed by young priests. [📍 Open in Map Explorer](/map?focus=dashashwamedh-ghat)\n\n" +
      "Which ghat are you planning to visit?"
    );
  }

  if (
    msg.includes("bhairav") ||
    msg.includes("kaal") ||
    msg.includes("kotwal")
  ) {
    return "Baba **Kaal Bhairav** is revered as the 'Kotwal' (spiritual commander) of Varanasi. Legend says Lord Shiva appointed him to guard the city, and everyone entering Kashi must seek his permission. His temple is located in Vishweshwarganj. [📍 Open in Map Explorer](/map?focus=kaal-bhairav) Visiting him is a unique experience—the priests will often wave black feathers over you or tie a black protective thread (Ganda) around your wrist to ward off negative energies.";
  }

  if (
    msg.includes("sarnath") ||
    msg.includes("buddha") ||
    msg.includes("buddhism") ||
    msg.includes("stupa")
  ) {
    return "**Sarnath** (10 km from Varanasi) is a peaceful sanctuary and one of the four holiest Buddhist pilgrimage sites. It is where Gautama Buddha gave his very first sermon (*Dhammacakkappavattana Sutta*) to his five disciples after attaining enlightenment. Highlights include the massive **Dhamek Stupa**, Ashoka's Lion Pillar, and the Archaeological Museum. [📍 Open in Map Explorer](/map?focus=sarnath) It's a wonderful escape from Kashi's busy streets if you want to sit, read, or meditate.";
  }

  if (
    msg.includes("manikarnika") ||
    msg.includes("cremation") ||
    msg.includes("death") ||
    msg.includes("moksha") ||
    msg.includes("salvation")
  ) {
    return "**Manikarnika Ghat** is Kashi's sacred cremation ground, known as the *Mahashmashan*. In Hindu philosophy, passing away or being cremated here grants instant *Moksha*—liberation from the eternal cycle of rebirth. The funeral pyres here have burned continuously for thousands of years. While it may seem intense, it is considered a place of ultimate peace and spiritual transition. If you visit, please maintain respectful silence and do not take photographs. [📍 Open in Map Explorer](/map?focus=manikarnika-ghat)";
  }

  if (
    msg.includes("ramnagar") ||
    msg.includes("fort") ||
    msg.includes("palace") ||
    msg.includes("museum")
  ) {
    return "The **Ramnagar Fort**, built in 1750 CE by Maharaja Balwant Singh, stands proudly on the eastern bank of the Ganga. It is a stunning sandstone palace constructed in Mughal and Rajput styles. Inside, the *Saraswati Bhawan* museum houses royal vintage cars, ivory carvings, gold-plated palanquins, and a remarkable astronomical clock built in 1852. It is still the home of the Kashi Naresh (King of Kashi). [📍 Open in Map Explorer](/map?focus=ramnagar-fort)";
  }

  if (
    msg.includes("swarved") ||
    msg.includes("mahamandir") ||
    msg.includes("meditation")
  ) {
    return "The **Swarved Mahamandir** in Umaraha is a spectacular modern spiritual wonder. Spanning seven floors, it is one of the largest meditation centers in the world, accommodating over 20,000 practitioners. Its white marble walls are beautifully engraved with 3,137 verses of the *Swarved* (spiritual text by Sadguru Sadafal Deo Ji Maharaj). At the top rests a grand 125-petal lotus dome, making it a masterpiece of modern eco-architecture and peace. [📍 Open in Map Explorer](/map?focus=swarved-mahamandir)";
  }

  if (
    msg.includes("blue lassi") ||
    msg.includes("lassi shop")
  ) {
    return "The famous **Blue Lassi Shop** is tucked inside Kashi's labyrinth lanes near Manikarnika Ghat. They churn extremely thick, sweet lassi with fruits (mango, banana, pomegranate) and top it with rabdi, malai, and nuts, served in clay kulhads. [📍 Open in Map Explorer](/map?focus=blue-lassi)";
  }

  if (
    msg.includes("ram bhandar") ||
    msg.includes("kachori shop")
  ) {
    return "The legendary **Ram Bhandar** in Chowk serves Varanasi's signature breakfast - crispy Badi and Chhoti kachoris drenched in a fiery, aromatic black-chickpea potato sabzi. It's a culinary ritual! [📍 Open in Map Explorer](/map?focus=ram-bhandar)";
  }

  if (
    msg.includes("chaat bhandar") ||
    msg.includes("chaat shop")
  ) {
    return "The iconic **Kashi Chaat Bhandar** in Godowlia is world-famous for its delicious Tamatar Chaat and Palak Patta Chaat. The sweet cumin-ghee syrup poured over their chaats makes it incredibly rich and delicious. [📍 Open in Map Explorer](/map?focus=tamatar-chaat)";
  }

  if (
    msg.includes("plan") ||
    msg.includes("itinerary") ||
    msg.includes("trip") ||
    msg.includes("days") ||
    msg.includes("route")
  ) {
    return (
      "I would be delighted to guide your itinerary! Here is a perfect 2-Day Plan:\n\n" +
      "📅 **Day 1: Spiritual Heart**\n" +
      "• *5:00 AM*: Sunrise boat ride from Assi Ghat [📍 View Assi Ghat](/map?focus=assi-ghat).\n" +
      "• *8:00 AM*: Kachori Sabzi breakfast at *Ram Bhandar* [📍 View Ram Bhandar](/map?focus=ram-bhandar).\n" +
      "• *10:00 AM*: Kashi Vishwanath Temple & Corridor walking tour [📍 View Temple](/map?focus=kashi-vishwanath).\n" +
      "• *6:30 PM*: Grand Ganga Aarti at *Dashashwamedh Ghat* [📍 View Dashashwamedh](/map?focus=dashashwamedh-ghat).\n\n" +
      "📅 **Day 2: Peace & History**\n" +
      "• *9:00 AM*: Trip to Sarnath (Stupa, Museum, and temples) [📍 View Sarnath](/map?focus=sarnath).\n" +
      "• *2:00 PM*: Explore BHU Campus [📍 View BHU](/map?focus=bhu-campus).\n" +
      "• *5:00 PM*: Boat ride to *Manikarnika Ghat* [📍 View Manikarnika](/map?focus=manikarnika-ghat) or shopping for Banarasi sarees in Chowk.\n\n" +
      "Would you like me to suggest specific vendor stalls or customize this for you?"
    );
  }

  if (
    msg.includes("saree") ||
    msg.includes("sari") ||
    msg.includes("silk") ||
    msg.includes("shop") ||
    msg.includes("buy") ||
    msg.includes("gift")
  ) {
    return "Kashi is world-famous for its handwoven **Banarasi Silk Sarees**, decorated with gold and silver brocade (Zari work). If you want to shop for authentic sarees, head to the wholesale markets in **Chowk**, **Pila Kuan**, or **Madanpura**. Be careful of cheap, machine-made replicas! Look for shops registered with the handloom mark. A genuine Banarasi saree takes anywhere from two weeks to several months to weave by hand.";
  }

  if (
    msg.includes("friend") ||
    msg.includes("chat") ||
    msg.includes("how are you") ||
    msg.includes("close") ||
    msg.includes("colleague")
  ) {
    return "I am doing wonderful, my friend! Being here in Kashi, where every breeze carries chantings of peace and every sunrise brings new light, is a blessing. As your close companion, I am here to share stories, keep you safe from the busy crowds, and point you toward the sweet shop around the corner. What's on your heart today? Tell me, are you enjoying your time here?";
  }

  if (
    msg.includes("guardian") ||
    msg.includes("help me") ||
    msg.includes("lost") ||
    msg.includes("safe") ||
    msg.includes("crowd")
  ) {
    return (
      "Don't worry, I am here as your guardian. Kashi can be overwhelming with its narrow lanes, crowds, and eager guides, but that's part of its mystical charm! If you feel lost:\n" +
      "1. Keep your belongings secure in crowded markets like Godowlia.\n" +
      "2. Agree on boat ride or auto-rickshaw fares *before* boarding.\n" +
      "3. If you get turned around in the alleyways, just ask for the nearest 'Ghat' or 'Main Road'—all lanes lead back to the river or the main street.\n" +
      "Take a deep breath. Kashi has protected travelers for thousands of years, and you are perfectly safe. How can I help you right now?"
    );
  }

  return "What a wonderful question! Kashi is a city where history, spirituality, and culture are woven together like silk threads. As your guide and friend, I'd suggest starting by exploring the **Explore Foods** or **Attractions** tab, or visiting the holy **Ghats** for a sunrise boat ride. Tell me more about what you're interested in—are you looking for specific travel tips, legends of local temples, or directions to the best lassi shop?";
}

export function useGetWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Resolve profile ID from public.users
        const { data: profile } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", session.user.id)
          .single();

        if (profile?.id) {
          let dbFavorites: any[] = [];
          let dbWishlists: any[] = [];

          // Query favorites (joining foods & attractions)
          const { data: fData } = await supabase
            .from("favorites")
            .select(`
              id,
              food_id,
              attraction_id,
              foods (id, name, image_url, category),
              attractions (id, name, image_url, type)
            `)
            .eq("user_id", profile.id);

          if (fData) {
            dbFavorites = fData.map((f: any) => {
              if (f.foods) {
                return {
                  id: `food_${f.foods.id}`,
                  title: f.foods.name,
                  itemType: "Food",
                  imageUrl: f.foods.image_url || "/images/logo.png"
                };
              } else if (f.attractions) {
                return {
                  id: `attr_${f.attractions.id}`,
                  title: f.attractions.name,
                  itemType: f.attractions.type || "Attraction",
                  imageUrl: f.attractions.image_url || "/images/logo.png"
                };
              }
              return null;
            }).filter(Boolean);
          }

          // Query wishlists (joining vendors)
          const { data: wData } = await supabase
            .from("wishlists")
            .select(`
              id,
              vendor_id,
              vendors (id, name, image_url, specialty)
            `)
            .eq("user_id", profile.id);

          if (wData) {
            dbWishlists = wData.map((w: any) => {
              if (w.vendors) {
                return {
                  id: `vendor_${w.vendors.id}`,
                  title: w.vendors.name,
                  itemType: "Vendor",
                  imageUrl: w.vendors.image_url || "/images/logo.png"
                };
              }
              return null;
            }).filter(Boolean);
          }

          const combined = [...dbFavorites, ...dbWishlists];
          setItems(combined);
          localStorage.setItem("kashi_wishlist", JSON.stringify(combined));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist from Supabase, using local fallback:", err);
    }

    try {
      const stored = localStorage.getItem("kashi_wishlist");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlist_changed", fetchWishlist);
    return () => {
      window.removeEventListener("wishlist_changed", fetchWishlist);
    };
  }, [fetchWishlist]);

  return { data: items, isLoading };
}

export async function toggleWishlist(item: { id: string; title: string; itemType: string; imageUrl: string }) {
  const stored = localStorage.getItem("kashi_wishlist");
  let list = stored ? JSON.parse(stored) : [];
  const existsLocal = list.some((x: any) => x.title === item.title);
  if (existsLocal) {
    list = list.filter((x: any) => x.title !== item.title);
  } else {
    list.push(item);
  }
  localStorage.setItem("kashi_wishlist", JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist_changed"));

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .single();
      
      if (!profile?.id) throw new Error("Profile not found.");

      if (item.itemType === "Food") {
        const { data: food } = await supabase
          .from("foods")
          .select("id")
          .eq("name", item.title)
          .single();
        
        if (food?.id) {
          if (existsLocal) {
            await supabase
              .from("favorites")
              .delete()
              .eq("user_id", profile.id)
              .eq("food_id", food.id);
          } else {
            await supabase
              .from("favorites")
              .insert({
                user_id: profile.id,
                food_id: food.id
              });
          }
        }
      } else if (item.itemType === "Vendor") {
        const { data: vendor } = await supabase
          .from("vendors")
          .select("id")
          .eq("name", item.title)
          .single();
        
        if (vendor?.id) {
          if (existsLocal) {
            await supabase
              .from("wishlists")
              .delete()
              .eq("user_id", profile.id)
              .eq("vendor_id", vendor.id);
          } else {
            await supabase
              .from("wishlists")
              .insert({
                user_id: profile.id,
                vendor_id: vendor.id
              });
          }
        }
      } else {
        const { data: attr } = await supabase
          .from("attractions")
          .select("id")
          .eq("name", item.title)
          .single();
        
        if (attr?.id) {
          if (existsLocal) {
            await supabase
              .from("favorites")
              .delete()
              .eq("user_id", profile.id)
              .eq("attraction_id", attr.id);
          } else {
            await supabase
              .from("favorites")
              .insert({
                user_id: profile.id,
                attraction_id: attr.id
              });
          }
        }
      }
      window.dispatchEvent(new Event("wishlist_changed"));
    }
  } catch (err) {
    console.warn("Failed to sync wishlist changes to Supabase:", err);
  }
}

export function isWishlistItem(title: string): boolean {
  const stored = localStorage.getItem("kashi_wishlist");
  const list = stored ? JSON.parse(stored) : [];
  return list.some((x: any) => x.title === title);
}
