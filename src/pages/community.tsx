import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Heart, MessageSquare, Bookmark, Share2, Plus, Search, 
  MapPin, Tag, Image as ImageIcon, CheckCircle, Sparkles, Send,
  ChevronRight, Calendar, Compass, Star, Award, X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  isVerified: boolean;
  category: "Temple" | "Food" | "Festival" | "Hidden Gem" | "Story";
  time: string;
  location: string;
  title: string;
  story: string;
  images: string[];
  likes: number;
  hasLiked: boolean;
  comments: PostComment[];
  bookmarks: number;
  hasBookmarked: boolean;
  tags: string[];
  isFollowing: boolean;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "p1",
    author: "Elena Rostova",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    isVerified: true,
    category: "Hidden Gem",
    time: "2 hours ago",
    location: "Swarved Mahamandir",
    title: "Meditation at the World's Largest Meditation Center",
    story: "Walking into Swarved Mahamandir was like stepping into absolute silence. The 125-petal lotus dome is an architectural masterwork. Visited early morning and sat under the white marble pillars for an hour of quiet reflection. It feels so peaceful compared to the central ghat streets!",
    images: [
      "/images/swarved-mahamandir.png",
      "/images/ghats-night.png"
    ],
    likes: 42,
    hasLiked: false,
    comments: [
      { id: "c1", author: "Rajesh Mishra", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh", text: "Truly serene! Next time, check out the laser light show in the gardens.", time: "1 hour ago" }
    ],
    bookmarks: 12,
    hasBookmarked: false,
    tags: ["#Meditation", "#SwarvedMahamandir", "#PeacefulKashi"],
    isFollowing: false
  },
  {
    id: "p2",
    author: "Kabir Das",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
    isVerified: true,
    category: "Food",
    time: "4 hours ago",
    location: "Ram Bhandar, Chowk",
    title: "Varanasi Morning Ritual: Spicy Kachoris",
    story: "Woke up at 7:00 AM specifically for Ram Bhandar's hot kachoris. The spicy potato and chickpea curry served in eco-friendly leaf bowls (dona) combined with crispy hot jalebis is pure magic. There is always a crowd, but standing on the lane side eating this is an essential Banaras vibe!",
    images: [
      "/images/kachori-sabji.png",
      "/images/tamatar-chaat.png"
    ],
    likes: 89,
    hasLiked: false,
    comments: [
      { id: "c2", author: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", text: "Wow, that looks delicious! Added to my food wishlist.", time: "3 hours ago" }
    ],
    bookmarks: 24,
    hasBookmarked: false,
    tags: ["#StreetFood", "#RamBhandar", "#Breakfast"],
    isFollowing: true
  },
  {
    id: "p3",
    author: "Aditya Roy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
    isVerified: false,
    category: "Festival",
    time: "1 day ago",
    location: "Dashashwamedh Ghat",
    title: "A Golden Sea of Lit Diyas during Dev Deepawali",
    story: "Throwback to last year's Kartik Poornima. Standing on a boat in the middle of the river, watching the entire crescent riverfront light up with one million clay lamps. It looked like a galaxy of fire gold. An unforgettable experience of divine energy.",
    images: [
      "/images/dashashwamedh-ghat-aarti.jpg",
      "/images/assi-ghat-aarti.jpg"
    ],
    likes: 124,
    hasLiked: true,
    comments: [
      { id: "c3", author: "Elena Rostova", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", text: "Incredible shot! The fire lights reflecting on the water look stunning.", time: "18 hours ago" }
    ],
    bookmarks: 45,
    hasBookmarked: false,
    tags: ["#DevDeepawali", "#GangaAarti", "#SpiritualKashi"],
    isFollowing: false
  }
];

const COMMUNITY_CHALLENGES = [
  { id: "ch1", title: "🌅 Assi Dawn Check-in", points: "+100 XP", desc: "Visit Assi Ghat for Subah-e-Banaras before 6:00 AM.", active: true },
  { id: "ch2", title: "🍛 Chaat Explorer Badge", points: "+70 XP", desc: "Try Tamatar Chaat at Kashi Chaat & Ram Bhandar.", active: true },
  { id: "ch3", title: "🚤 Sunrise Crossing", points: "+120 XP", desc: "Take a wooden boat ride from Assi to Dashashwamedh at dawn.", active: false }
];

const MEETUPS = [
  { title: "Morning Chai & Walk Meetup", time: "Tomorrow, 6:00 AM", location: "Assi Ghat steps (near Pappu Chai)", members: 14 },
  { title: "Street Photography Excursion", time: "Saturday, 4:30 PM", location: "Chowk lanes & Corridor entry", members: 8 }
];

const TOP_EXPLORERS = [
  { name: "Rajesh K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshK", level: "Lvl 12 Corridor Sage", posts: 48 },
  { name: "Sarah J.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ", level: "Lvl 9 Ghat Master", posts: 32 }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newStory, setNewStory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState<"Temple" | "Food" | "Festival" | "Hidden Gem" | "Story">("Story");
  const [newTagInput, setNewTagInput] = useState("");
  const [uploadedMockImages, setUploadedMockImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Interactive Comments Dialog State
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleFollow = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isFollowing: !p.isFollowing
        };
      }
      return p;
    }));
  };

  const handleBookmark = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          bookmarks: p.hasBookmarked ? p.bookmarks - 1 : p.bookmarks + 1,
          hasBookmarked: !p.hasBookmarked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `comment_${Date.now()}`,
              author: "Aditya Roy (You)",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
              text: newCommentText.trim(),
              time: "Just now"
            }
          ]
        };
      }
      return p;
    }));
    setNewCommentText("");
  };

  const handleMockImageUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockList = [
        "/images/tamatar-chaat.png",
        "/images/banarasi-lassi.png",
        "/images/kashi-vishwanath-aerial.jpg"
      ];
      const selected = mockList[Math.floor(Math.random() * mockList.length)];
      setUploadedMockImages(prev => [...prev, selected]);
      setIsUploading(false);
    }, 800);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) return;

    const tagsArray = newTagInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith("#") ? t : `#${t}`));

    const newPostItem: CommunityPost = {
      id: `post_${Date.now()}`,
      author: "Aditya Roy (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
      isVerified: false,
      category: newCategory,
      time: "Just now",
      location: newLocation.trim() || "Varanasi",
      title: newTitle.trim(),
      story: newStory.trim(),
      images: uploadedMockImages.length > 0 ? uploadedMockImages : ["/images/ghats-night.png"],
      likes: 0,
      hasLiked: false,
      comments: [],
      bookmarks: 0,
      hasBookmarked: false,
      tags: tagsArray.length > 0 ? tagsArray : ["#ExploreKashi", "#TravelerClub"],
      isFollowing: false
    };

    setPosts(prev => [newPostItem, ...prev]);

    // Reset Form
    setNewTitle("");
    setNewStory("");
    setNewLocation("");
    setNewCategory("Story");
    setNewTagInput("");
    setUploadedMockImages([]);
    setShowCreateModal(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen text-left">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2 text-white tracking-wide">
              Kashi <span className="bg-gradient-to-r from-[#E8C84A] to-[#A07820] bg-clip-text text-transparent">Travelers Club</span>
            </h1>
            <p className="text-muted-foreground text-sm">Connect, share street food reviews, temple journeys, and hidden gems.</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#C9A227]/10 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Share My Experience
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-3 rounded-2xl bg-[#0d0b08]/85 border border-[#C9A227]/15">
              
              <div className="overflow-x-auto flex gap-1.5 scrollbar-none pr-2" style={{ scrollbarWidth: "none" }}>
                {["All", "Temple", "Food", "Festival", "Hidden Gem", "Story"].map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                        isActive 
                          ? "bg-[#C9A227] text-black border-[#C9A227]" 
                          : "bg-black/20 border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="relative md:w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search club posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-full py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-[#C9A227]/40 placeholder:text-white/20"
                />
              </div>

            </div>

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  className="bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-5 shadow-xl flex flex-col space-y-4"
                >
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-[#C9A227]/25">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>TC</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white">{post.author}</span>
                          {post.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-[#C9A227] fill-black" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground block">{post.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollow(post.id)}
                      className={`text-[10px] px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                        post.isFollowing 
                          ? "bg-white/5 border-white/10 text-white/70" 
                          : "bg-[#C9A227]/10 border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/20"
                      }`}
                    >
                      {post.isFollowing ? "Following" : "+ Follow"}
                    </button>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#C9A227] font-bold">
                        <MapPin className="w-3 h-3 text-[#C9A227]" /> {post.location}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white leading-snug">{post.title}</h3>
                    <p className="text-[12px] text-white/70 leading-relaxed">{post.story}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] text-[#C9A227]/80 hover:underline cursor-pointer">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 h-[180px] rounded-2xl overflow-hidden border border-white/5 bg-black/10">
                      {post.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full relative overflow-hidden group">
                          <img 
                            src={img} 
                            alt={`Post snap ${idx}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/5 pt-3.5 text-white/60 text-xs">
                    
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${
                        post.hasLiked ? "text-red-500 hover:text-red-400 font-bold" : ""
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-red-500 text-red-500 animate-heartbeat" : ""}`} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button
                      onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${
                        post.hasBookmarked ? "text-[#C9A227] font-bold" : ""
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${post.hasBookmarked ? "fill-[#C9A227] text-[#C9A227]" : ""}`} />
                      <span>{post.bookmarks} Saved</span>
                    </button>

                    <button
                      onClick={() => alert("Copied experience post link to clipboard!")}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                  </div>

                  {commentingPostId === post.id && (
                    <div className="border-t border-white/5 pt-4 space-y-4 text-left">
                      
                      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start bg-black/20 p-2.5 rounded-2xl border border-white/5">
                            <Avatar className="w-6 h-6 border border-white/10 flex-shrink-0">
                              <AvatarImage src={comment.avatar} />
                              <AvatarFallback>CM</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-white">{comment.author}</span>
                                <span className="text-[9px] text-muted-foreground">{comment.time}</span>
                              </div>
                              <p className="text-white/80 leading-relaxed">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                        {post.comments.length === 0 && (
                          <p className="text-[10px] text-muted-foreground text-center py-2">No comments yet. Be the first to share your thoughts!</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]/40"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 bg-[#C9A227] text-black rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  )}

                </motion.div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="text-center py-16 bg-[#0f0a05]/95 border border-white/5 rounded-3xl">
                  <Users className="w-12 h-12 text-[#C9A227]/40 mx-auto mb-2.5 animate-pulse" />
                  <p className="text-muted-foreground text-xs font-semibold">No club experiences matched your search criteria.</p>
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-4.5 space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5 text-left">
                <Award className="w-4.5 h-4.5 text-[#C9A227]" />
                <span className="font-serif font-bold text-xs text-white">Active Club Challenges</span>
              </div>
              <div className="space-y-3 text-left">
                {COMMUNITY_CHALLENGES.map((ch) => (
                  <div 
                    key={ch.id} 
                    className="p-3 bg-black/20 border border-white/5 rounded-2xl space-y-1 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[11px] text-white">{ch.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227]">{ch.points}</span>
                    </div>
                    <p className="text-[10px] text-white/50">{ch.desc}</p>
                    <button
                      onClick={() => alert("Navigate to map explorer to perform challenge!")}
                      className="text-[9px] font-bold text-[#C9A227] flex items-center gap-0.5 hover:underline mt-1 cursor-pointer"
                    >
                      Perform Challenge <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-4.5 space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5 text-left">
                <Calendar className="w-4.5 h-4.5 text-[#C9A227]" />
                <span className="font-serif font-bold text-xs text-white">Nearby Traveler Meetups</span>
              </div>
              <div className="space-y-3 text-left">
                {MEETUPS.map((meet, idx) => (
                  <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded-2xl space-y-2">
                    <div>
                      <span className="font-bold text-[11px] text-white leading-tight block">{meet.title}</span>
                      <span className="text-[9px] text-[#C9A227] mt-0.5 block">🕒 {meet.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-white/60">
                      <span>📍 {meet.location}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{meet.members} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f0a05]/95 border border-[#C9A227]/15 rounded-3xl p-4.5 space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-white/5 text-left">
                <Compass className="w-4.5 h-4.5 text-[#C9A227]" />
                <span className="font-serif font-bold text-xs text-white">Top Explorers This Week</span>
              </div>
              <div className="space-y-3 text-left">
                {TOP_EXPLORERS.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center p-1.5 rounded-xl hover:bg-white/[0.01]">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7 border border-[#C9A227]/20">
                        <AvatarImage src={exp.avatar} />
                        <AvatarFallback>TE</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-white block leading-tight">{exp.name}</span>
                        <span className="text-[9px] text-muted-foreground">{exp.level}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#C9A227]">{exp.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={() => setShowCreateModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="relative w-full max-w-lg bg-[#0f0a05] border border-[#C9A227]/30 text-white rounded-3xl p-6 shadow-2xl z-10"
              >
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 w-7 h-7 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <h2 className="font-serif text-2xl font-bold text-white mb-1.5 text-left flex items-center gap-2">
                  <Sparkles className="w-5.5 h-5.5 text-primary" /> Post Traveler Experience
                </h2>
                <p className="text-muted-foreground text-xs text-left mb-5">Share your local guides, dining reviews, or temple processes with fellow visitors.</p>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-black/45 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]/40 cursor-pointer"
                      >
                        <option value="Story" className="bg-[#0f0a05]">Travel Story</option>
                        <option value="Food" className="bg-[#0f0a05]">Food Review</option>
                        <option value="Temple" className="bg-[#0f0a05]">Temple Experience</option>
                        <option value="Festival" className="bg-[#0f0a05]">Festival Moment</option>
                        <option value="Hidden Gem" className="bg-[#0f0a05]">Hidden Gem</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Location Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Assi Ghat steps"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-black/45 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Experience Title</label>
                    <input
                      type="text"
                      placeholder="Give your story a catchy name..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full bg-black/45 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]/40"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Story (Notes & Diary)</label>
                    <textarea
                      rows={4}
                      placeholder="Write your emotional travel details here..."
                      value={newStory}
                      onChange={(e) => setNewStory(e.target.value)}
                      required
                      className="w-full bg-black/45 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]/40 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Hashtag Tags</label>
                      <input
                        type="text"
                        placeholder="e.g. food, lassi (comma split)"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className="w-full bg-black/45 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block">Upload Images</label>
                      <button
                        type="button"
                        onClick={handleMockImageUpload}
                        disabled={isUploading}
                        className="w-full py-2 bg-white/5 border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                        {isUploading ? "Uploading..." : `Mock Upload Images (${uploadedMockImages.length})`}
                      </button>
                    </div>
                  </div>

                  {uploadedMockImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {uploadedMockImages.map((img, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 relative">
                          <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 text-right">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#A07820] text-black font-bold text-xs rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      Publish Experience
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
