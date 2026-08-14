export const mockDashboardSummary = {
  totalFoods: 52,
  totalAttractions: 34,
  totalVendors: 28,
  totalStories: 47,
  totalExplorers: 12400,
};

export const mockRecommended = [
  {
    id: "1",
    title: "Kashi Vishwanath Temple",
    type: "Temple",
    rating: 4.9,
    subtitle: "The holiest Shiva temple in the universe",
    imageUrl: "/images/kashi-vishwanath.png",
    location: "Vishwanath Gali, Varanasi",
  },
  {
    id: "2",
    title: "Banarasi Kachori Sabji",
    type: "Food",
    rating: 4.8,
    subtitle: "Crispy kachori dipped in spiced sabji",
    imageUrl: "/images/kachori-sabji.png",
    location: "Godowlia Chowk",
  },
  {
    id: "3",
    title: "Ganga Aarti at Dashashwamedh",
    type: "Event",
    rating: 5.0,
    subtitle: "A divine spectacle every evening at dusk",
    imageUrl: "/images/ganga-aarti.png",
    location: "Dashashwamedh Ghat",
  },
  {
    id: "4",
    title: "Malaiyoo — Winter Delight",
    type: "Food",
    rating: 4.7,
    subtitle: "Feather-light sweetened cream, winter only",
    imageUrl: "/images/malaiyoo.png",
    location: "Chowk, Varanasi",
  },
  {
    id: "5",
    title: "Ghats at Night",
    type: "Experience",
    rating: 4.9,
    subtitle: "The ghats transform after sunset",
    imageUrl: "/images/ghats-night.png",
    location: "Manikarnika Ghat",
  },
];

export const mockCategories = [
  { id: "1", name: "Authentic Food", type: "food", count: 52 },
  { id: "2", name: "Sacred Temples", type: "temple", count: 34 },
  { id: "3", name: "Holy Ghats", type: "ghat", count: 18 },
  { id: "4", name: "Heritage Sites", type: "heritage", count: 22 },
  { id: "5", name: "Timeless Stories", type: "story", count: 47 },
  { id: "6", name: "Arts & Crafts", type: "craft", count: 15 },
];

export const mockVendors = [
  {
    id: "1",
    name: "Ram Bhandar",
    specialty: "Kachori & Sabji",
    location: "Godowlia",
    rating: 4.9,
    imageUrl: "/images/banarasi-paan.png",
    isVerified: true,
  },
  {
    id: "2",
    name: "Blue Lassi Shop",
    specialty: "Banarasi Lassi",
    location: "Vishwanath Gali",
    rating: 4.8,
    imageUrl: "/images/banarasi-lassi.png",
    isVerified: true,
  },
  {
    id: "3",
    name: "Deena Chaat Bhandar",
    specialty: "Tamatar Chaat",
    location: "Shivala",
    rating: 4.7,
    imageUrl: "/images/tamatar-chaat.png",
    isVerified: true,
  },
  {
    id: "4",
    name: "Raj Kulfi",
    specialty: "Kulfi Falooda",
    location: "Assi Ghat",
    rating: 4.6,
    imageUrl: "/images/kulfi-falooda.png",
    isVerified: false,
  },
  {
    id: "5",
    name: "Thandai Bhandar",
    specialty: "Thandai & Bhaang",
    location: "Maidagin",
    rating: 4.5,
    imageUrl: "/images/thandai.png",
    isVerified: true,
  },
];

export const mockStories = [
  {
    id: "1",
    title: "The Legend of Kashi — Where Time Began",
    category: "Mythology",
    readTime: "8 min read",
    imageUrl: "/images/kashi-vishwanath.png",
    excerpt:
      "Varanasi is said to be as old as time itself. Lord Shiva chose this sacred land as his abode, and since then, the city has been a beacon for millions seeking moksha.",
  },
  {
    id: "2",
    title: "Banarasi Weaves — A Thread of Gold",
    category: "Culture",
    readTime: "6 min read",
    imageUrl: "/images/drone-view.png",
    excerpt:
      "For centuries, the weavers of Varanasi have crafted silk sarees that carry the city's soul in every thread. Each piece takes weeks, sometimes months, to complete.",
  },
  {
    id: "3",
    title: "The Ghats at Dawn — A Pilgrim's Journey",
    category: "Travel",
    readTime: "5 min read",
    imageUrl: "/images/evening-ghats.png",
    excerpt:
      "As the first light touches the Ganges, thousands of pilgrims descend the stone steps of the ghats. This ritual has continued unbroken for five thousand years.",
  },
  {
    id: "4",
    title: "Flavors of Kashi — A Culinary Heritage",
    category: "Food",
    readTime: "7 min read",
    imageUrl: "/images/kachori-sabji.png",
    excerpt:
      "From the crispy kachori to the ethereal malaiyoo, the food of Varanasi tells a story of tradition, spice, and an unrelenting love for life.",
  },
  {
    id: "5",
    title: "Ganga Aarti — The Fire That Never Dies",
    category: "Spirituality",
    readTime: "4 min read",
    imageUrl: "/images/ganga-aarti.png",
    excerpt:
      "Every evening at Dashashwamedh Ghat, the air fills with incense and chanting as priests perform the Ganga Aarti. It is not a ritual — it is a conversation with the divine.",
  },
];

export const mockEvents = [
  {
    id: "1",
    name: "Dev Deepawali",
    date: "Nov 15, 2025",
    location: "Dashashwamedh Ghat",
    description:
      "A million lamps illuminate the ghats as gods descend to bathe in the Ganga. The most spectacular sight in Varanasi.",
    imageUrl: "/images/ganga-aarti.png",
  },
  {
    id: "2",
    name: "Ganga Mahotsav",
    date: "Oct 30, 2025",
    location: "Assi Ghat",
    description:
      "Five-day festival celebrating the cultural heritage of Varanasi with music, art, and the sacred river.",
    imageUrl: "/images/evening-ghats.png",
  },
  {
    id: "3",
    name: "Kashi Vishwanath Corridor Festival",
    date: "Dec 13, 2025",
    location: "Vishwanath Temple",
    description:
      "Annual celebration marking the inauguration of the new temple corridor with special poojas and cultural programs.",
    imageUrl: "/images/kashi-vishwanath.png",
  },
  {
    id: "4",
    name: "Bundelkhandi Lok Festival",
    date: "Jan 14, 2026",
    location: "Ramnagar Fort",
    description:
      "A vibrant folk music and dance festival on the eastern banks of the Ganga showcasing regional cultural heritage.",
    imageUrl: "/images/drone-view.png",
  },
];

export const mockUserJourney = {
  level: 7,
  levelName: "Kashi Explorer",
  xp: 3420,
  xpToNext: 5000,
  placesExplored: 14,
  foodsTasted: 23,
  storiesRead: 31,
  eventsJoined: 5,
};

export const mockAiSuggestions = [
  { id: "1", text: "Best ghats to visit at sunrise?" },
  { id: "2", text: "Where to eat authentic kachori?" },
  { id: "3", text: "What is the history of Kashi Vishwanath?" },
  { id: "4", text: "Plan a 3-day itinerary for Varanasi" },
  { id: "5", text: "Tell me about the Ganga Aarti" },
];

export const mockWishlist = [
  {
    id: "1",
    title: "Kashi Vishwanath Temple",
    itemType: "Temple",
    imageUrl: "/images/kashi-vishwanath.png",
  },
  {
    id: "2",
    title: "Banarasi Lassi",
    itemType: "Food",
    imageUrl: "/images/banarasi-lassi.png",
  },
  {
    id: "3",
    title: "Ganga Aarti",
    itemType: "Event",
    imageUrl: "/images/ganga-aarti.png",
  },
  {
    id: "4",
    title: "Evening at the Ghats",
    itemType: "Experience",
    imageUrl: "/images/evening-ghats.png",
  },
];
