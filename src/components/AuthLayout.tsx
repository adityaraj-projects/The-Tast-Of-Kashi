import React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, BookOpen, MapPin, Users, Shield, Globe } from "lucide-react";

const logoPath = "/images/logo.png";
const bgPath = "/images/bg-login.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

const features = [
  { icon: Utensils, label: "Authentic\nFood" },
  { icon: BookOpen, label: "Timeless\nStories" },
  { icon: MapPin, label: "Sacred\nPlaces" },
  { icon: Users, label: "Local\nExperiences" },
];

export default function AuthLayout({ children, isLogin = true }: AuthLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen w-full flex text-white overflow-hidden" style={{ background: "#0f0a05" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between min-h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgPath})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>

        {isLogin ? (
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div className="flex flex-col items-center text-center">
              <motion.img
                src={logoPath}
                alt="The Taste of Kashi"
                className="h-36 w-auto object-contain mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h1 className="text-4xl lg:text-5xl font-serif font-medium leading-tight text-white drop-shadow-md">
                  The Taste of
                </h1>
                <h2 className="text-5xl lg:text-6xl font-serif font-bold text-amber-400 mt-1 drop-shadow-lg">
                  Kashi
                </h2>

                <div className="flex items-center justify-center gap-3 my-5">
                  <div className="h-px w-12 bg-amber-500/50" />
                  <span className="text-amber-500 text-lg">✦</span>
                  <div className="h-px w-12 bg-amber-500/50" />
                </div>

                <p className="text-base text-white/75 font-sans max-w-sm mx-auto leading-relaxed">
                  Discover Food. Culture. Stories. Experience the soul of the world's oldest living city.
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="w-full bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-5">
                <div className="flex justify-between items-start">
                  {features.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 text-center">
                      <div className="bg-amber-500/20 p-3 rounded-full">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-xs text-white/80 font-sans whitespace-pre-line leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 text-center">
                  <p className="font-serif italic text-sm text-white/80">
                    "Kashi is not just a city, it's a feeling, a blessing, a way of life."
                  </p>
                  <p className="mt-1 text-xs text-amber-400 font-sans">— Ancient Kashi Wisdom</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/40 font-sans">
                <Shield className="w-3 h-3" /><span>Secure & Private</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <Globe className="w-3 h-3" /><span>Trusted by Explorers</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Made with <span className="text-amber-500">♥</span> in India</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div className="flex flex-col items-center text-center">
              <motion.img
                src={logoPath}
                alt="The Taste of Kashi"
                className="h-36 w-auto object-contain mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h1 className="text-4xl lg:text-5xl font-serif font-medium leading-tight text-white drop-shadow-md">
                  Create Your Account
                </h1>
                <h2 className="text-3xl lg:text-4xl font-serif font-medium leading-tight mt-1 text-white">
                  Start Your Journey in
                </h2>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-amber-400 mt-1 drop-shadow-lg">
                  Kashi
                </h2>

                <div className="flex items-center justify-center gap-3 my-5">
                  <div className="h-px w-12 bg-amber-500/50" />
                  <span className="text-amber-500 text-lg">✦</span>
                  <div className="h-px w-12 bg-amber-500/50" />
                </div>

                <p className="text-base text-white/75 font-sans max-w-sm mx-auto leading-relaxed">
                  Join thousands of explorers discovering food, culture, stories & timeless experiences.
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="w-full bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-5">
                <div className="flex justify-between items-start">
                  {features.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 text-center">
                      <div className="bg-amber-500/20 p-3 rounded-full">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-xs text-white/80 font-sans whitespace-pre-line leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 text-center">
                  <p className="font-serif italic text-sm text-white/80">
                    "Kashi is not just a city, it's a feeling, a blessing, a way of life."
                  </p>
                  <p className="mt-1 text-xs text-amber-400 font-sans">— Ancient Kashi Wisdom</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/40 font-sans">
                <Shield className="w-3 h-3" /><span>Secure & Private</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <Globe className="w-3 h-3" /><span>Trusted by Explorers</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Made with <span className="text-amber-500">♥</span> in India</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img src={logoPath} alt="The Taste of Kashi" className="h-20 w-auto object-contain" />
          </div>

          {/* Form Card */}
          <div className="bg-[#1a1108]/90 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/5 relative">
              <Link
                href="/login"
                className={`flex-1 py-5 text-center font-medium text-sm transition-colors ${
                  location === "/login" ? "text-amber-500" : "text-white/50 hover:text-white/80"
                }`}
                data-testid="tab-login"
              >
                Welcome Back
              </Link>
              <Link
                href="/signup"
                className={`flex-1 py-5 text-center font-medium text-sm transition-colors ${
                  location === "/signup" ? "text-amber-500" : "text-white/50 hover:text-white/80"
                }`}
                data-testid="tab-signup"
              >
                Create Account
              </Link>
              <div
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 ease-in-out w-1/2"
                style={{ left: location === "/login" ? "0" : "50%" }}
              />
            </div>

            {/* Form Content */}
            <div className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location}
                  initial={{ opacity: 0, x: location === "/login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: location === "/login" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
