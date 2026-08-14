import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { User, Bell, Shield, Paintbrush, LogOut, Moon, Sun, CheckCircle, BarChart3, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

type TabType = "profile" | "notifications" | "privacy" | "appearance" | "analytics";

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [theme, setTheme] = useState(() => localStorage.getItem("kashi_theme") || "dark");

  // Profile fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState(() => localStorage.getItem("kashi_user_bio") || "Explorer of ancient cities. Food enthusiast.");

  // Notifications state
  const [aartiAlerts, setAartiAlerts] = useState(() => localStorage.getItem("kashi_prefs_aarti") !== "false");
  const [weatherAdvisories, setWeatherAdvisories] = useState(() => localStorage.getItem("kashi_prefs_weather") !== "false");
  const [devotionalUpdates, setDevotionalUpdates] = useState(() => localStorage.getItem("kashi_prefs_devotional") === "true");

  // Privacy state
  const [showJourney, setShowJourney] = useState(() => localStorage.getItem("kashi_prefs_journey") !== "false");
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem("kashi_prefs_tfa") === "true");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("kashi_theme") || "dark");
    };
    window.addEventListener("kashi_theme_change", handleThemeChange);
    return () => window.removeEventListener("kashi_theme_change", handleThemeChange);
  }, []);

  useEffect(() => {
    if (user) {
      const parts = user.fullName.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const selectTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("kashi_theme", newTheme);
    window.dispatchEvent(new Event("kashi_theme_change"));
  };

  const handleSaveProfile = () => {
    if (updateUser) {
      updateUser({
        fullName: `${firstName} ${lastName}`.trim(),
        email: email
      });
      localStorage.setItem("kashi_user_bio", bio);
      alert("Profile details updated successfully! / प्रोफाइल विवरण सफलतापूर्वक सहेज लिए गए हैं!");
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("kashi_prefs_aarti", String(aartiAlerts));
    localStorage.setItem("kashi_prefs_weather", String(weatherAdvisories));
    localStorage.setItem("kashi_prefs_devotional", String(devotionalUpdates));
    alert("Notification preferences updated! / अधिसूचना प्राथमिकताएं सहेज ली गई हैं!");
  };

  const handleSavePrivacy = () => {
    localStorage.setItem("kashi_prefs_journey", String(showJourney));
    localStorage.setItem("kashi_prefs_tfa", String(twoFactor));
    alert("Privacy and security settings updated! / गोपनीयता और सुरक्षा सेटिंग्स अपडेट हो गई हैं!");
  };

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto min-h-screen">
        <h1 className="font-serif text-4xl font-bold mb-2 text-foreground">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your Kashi explorer profile and preferences.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Tab buttons */}
          <div className="md:col-span-1 space-y-2">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy & Security", icon: Shield },
              { id: "appearance", label: "Appearance", icon: Paintbrush },
              { id: "analytics", label: "Admin Analytics", icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-medium ${
                    isActive 
                      ? "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/25" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {tab.label}
                </button>
              );
            })}
            
            <div className="pt-8">
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to log out? / क्या आप वाकई लॉग आउट करना चाहते हैं?")) {
                    logout();
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>
          </div>

          {/* Settings Cards container */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <div className="bg-card border border-card-border rounded-3xl p-6" style={{ background: "var(--app-card-bg)" }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Profile Details</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <Avatar className="w-24 h-24 border-2 border-[#C9A227]/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Aditya'}`} />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <button 
                      onClick={() => alert("Photo uploads are disabled in demo mode.")}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg text-sm font-medium transition-colors border border-white/10 mb-2 cursor-pointer"
                    >
                      Change Avatar
                    </button>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-foreground/80">First Name</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-[#C9A227]/50" 
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-medium text-foreground/80">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-[#C9A227]/50" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-foreground/80">Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-[#C9A227]/50" 
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-foreground/80">Bio</label>
                    <textarea 
                      rows={3} 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-[#C9A227]/50 resize-none" 
                    />
                  </div>
                  
                  <div className="pt-4 text-left">
                    <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-[#C9A227] text-black font-semibold rounded-xl hover:opacity-90 transition-colors shadow-[0_0_15px_rgba(201,162,39,0.2)] cursor-pointer">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-card border border-card-border rounded-3xl p-6" style={{ background: "var(--app-card-bg)" }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Notifications</h2>
                
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-semibold">Evening Aarti Alerts</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Receive daily notifications for Ganga Aarti timings</p>
                    </div>
                    <Switch checked={aartiAlerts} onCheckedChange={setAartiAlerts} />
                  </div>
                  
                  <div className="w-full h-px bg-border/20" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-semibold">Weather push advisories</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Notify me on morning wind or storm alerts</p>
                    </div>
                    <Switch checked={weatherAdvisories} onCheckedChange={setWeatherAdvisories} />
                  </div>
                  
                  <div className="w-full h-px bg-border/20" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-semibold">Devotional updates</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Alert me about temple festivals and holy days</p>
                    </div>
                    <Switch checked={devotionalUpdates} onCheckedChange={setDevotionalUpdates} />
                  </div>

                  <div className="pt-4">
                    <button onClick={handleSaveNotifications} className="px-6 py-2.5 bg-[#C9A227] text-black font-semibold rounded-xl hover:opacity-90 transition-colors cursor-pointer">
                      Save Notification Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-card border border-card-border rounded-3xl p-6" style={{ background: "var(--app-card-bg)" }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Privacy & Security</h2>
                
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-semibold">Show Journey Progress</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Display your explorer level to others on social boards</p>
                    </div>
                    <Switch checked={showJourney} onCheckedChange={setShowJourney} />
                  </div>
                  
                  <div className="w-full h-px bg-border/20" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-semibold">Two-Factor Authentication</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Secure your travel account with SMS codes</p>
                    </div>
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </div>

                  <div className="pt-4">
                    <button onClick={handleSavePrivacy} className="px-6 py-2.5 bg-[#C9A227] text-black font-semibold rounded-xl hover:opacity-90 transition-colors cursor-pointer">
                      Update Security Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-card border border-card-border rounded-3xl p-6" style={{ background: "var(--app-card-bg)" }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Appearance Preferences</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose your theme background for exploring Kashi.</p>

                <div className="grid grid-cols-2 gap-4 text-left">
                  {/* Dark Theme choice */}
                  <div 
                    onClick={() => selectTheme("dark")}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all hover:scale-[1.01] ${
                      theme === "dark" ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-[#7A6A4A]" />
                      </div>
                      {theme === "dark" && (
                        <CheckCircle className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">Varanasi Dark Sunset</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">Default dark theme, highlighting lights, lamps, and aarti glows.</p>
                  </div>

                  {/* Light Theme choice */}
                  <div 
                    onClick={() => selectTheme("light")}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all hover:scale-[1.01] ${
                      theme === "light" ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white border border-black/10 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-[#C9A227]" />
                      </div>
                      {theme === "light" && (
                        <CheckCircle className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">Sleek Kashi Parchment</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">Light parchment theme, with warm cream background details.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-card border border-card-border rounded-3xl p-6 text-left animate-fade-in" style={{ background: "var(--app-card-bg)" }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#C9A227]" /> Admin Analytics Dashboard
                </h2>
                <p className="text-xs text-muted-foreground mb-6">Real-time visitor patterns, footprint metrics, and AI platform telemetry for Varanasi.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-muted/20 border border-border/85 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Active AI Chats</span>
                    <span className="text-2xl font-bold text-white font-mono">247</span>
                    <span className="text-[9px] text-[#C9A227] font-semibold block mt-1">▲ 14% vs yesterday</span>
                  </div>
                  <div className="p-4 bg-muted/20 border border-border/85 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Itineraries Planned</span>
                    <span className="text-2xl font-bold text-white font-mono">1,894</span>
                    <span className="text-[9px] text-[#C9A227] font-semibold block mt-1">▲ 22% this week</span>
                  </div>
                  <div className="p-4 bg-muted/20 border border-border/85 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">XP Claims Handled</span>
                    <span className="text-2xl font-bold text-white font-mono">8,412</span>
                    <span className="text-[9px] text-green-400 font-semibold block mt-1">✓ Live engine active</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Footprint share */}
                  <div className="p-5 bg-muted/15 border border-border/85 rounded-2xl space-y-3">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5 uppercase">
                      <TrendingUp className="w-4 h-4 text-[#C9A227]" /> Destination Visitor Share
                    </span>
                    <div className="space-y-3">
                      {[
                        { name: "Dashashwamedh Ghat", percentage: 42, color: "#A855F7" },
                        { name: "Kashi Vishwanath Corridor", percentage: 35, color: "#D4AF37" },
                        { name: "Assi Ghat steps", percentage: 18, color: "#EC4899" },
                        { name: "Sarnath & Stupas", percentage: 5, color: "#3B82F6" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-white/90">
                            <span>{item.name}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hourly peak graph description */}
                  <div className="p-5 bg-muted/15 border border-border/85 rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-[#C9A227] uppercase">⏰ Hourly Peak Transit Analysis</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                      <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                        <span className="block text-muted-foreground">Morning (5A-8A)</span>
                        <span className="font-bold text-yellow-500">🌅 HIGH DIP TRAFFIC</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                        <span className="block text-muted-foreground">Afternoon (12P-3P)</span>
                        <span className="font-bold text-white/50">🍲 MIDDAY LOW</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                        <span className="font-bold block text-red-500">🔥 EXTREME AARTI CROWD</span>
                        <span className="text-muted-foreground">Evening (6P-8P)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}