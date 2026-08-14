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

type QueryResult<T> = { data: T; isLoading: false };
type MutationResult = { mutate: (args: unknown, options?: { onSuccess?: (data: { reply: string }) => void }) => void; isPending: false };

function mockQuery<T>(data: T): QueryResult<T> {
  return { data, isLoading: false };
}

export function useGetDashboardSummary(): QueryResult<typeof mockDashboardSummary> {
  return mockQuery(mockDashboardSummary);
}

export function useGetDashboardRecommended(): QueryResult<typeof mockRecommended> {
  return mockQuery(mockRecommended);
}

export function useGetCategories(): QueryResult<typeof mockCategories> {
  return mockQuery(mockCategories);
}

export function useGetVendors(_params?: { limit?: number }): QueryResult<typeof mockVendors> {
  const limit = _params?.limit;
  const data = limit ? mockVendors.slice(0, limit) : mockVendors;
  return mockQuery(data);
}

export function useGetStories(_params?: { limit?: number }): QueryResult<typeof mockStories> {
  const limit = _params?.limit;
  const data = limit ? mockStories.slice(0, limit) : mockStories;
  return mockQuery(data);
}

export function useGetEvents(_params?: { limit?: number }): QueryResult<typeof mockEvents> {
  const limit = _params?.limit;
  const data = limit ? mockEvents.slice(0, limit) : mockEvents;
  return mockQuery(data);
}

export function useGetUserJourney(): QueryResult<typeof mockUserJourney> {
  return mockQuery(mockUserJourney);
}

export function useGetAiSuggestions(): QueryResult<typeof mockAiSuggestions> {
  return mockQuery(mockAiSuggestions);
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

import { useState, useEffect } from "react";

export function useGetWishlist() {
  const [items, setItems] = useState<typeof mockWishlist>(() => {
    const stored = localStorage.getItem("kashi_wishlist");
    if (stored) return JSON.parse(stored);
    // Seed with mock data if not set yet
    localStorage.setItem("kashi_wishlist", JSON.stringify(mockWishlist));
    return mockWishlist;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("kashi_wishlist");
      if (stored) setItems(JSON.parse(stored));
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("wishlist_changed", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wishlist_changed", handleStorage);
    };
  }, []);

  return { data: items, isLoading: false };
}

export function toggleWishlist(item: { id: string; title: string; itemType: string; imageUrl: string }) {
  const stored = localStorage.getItem("kashi_wishlist");
  let list = stored ? JSON.parse(stored) : [...mockWishlist];
  const exists = list.some((x: any) => x.title === item.title);
  if (exists) {
    list = list.filter((x: any) => x.title !== item.title);
  } else {
    list.push(item);
  }
  localStorage.setItem("kashi_wishlist", JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist_changed"));
}

export function isWishlistItem(title: string): boolean {
  const stored = localStorage.getItem("kashi_wishlist");
  const list = stored ? JSON.parse(stored) : mockWishlist;
  return list.some((x: any) => x.title === title);
}
