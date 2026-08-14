import React, { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Mail, ArrowRight, ArrowLeft, RefreshCw, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Retrieve the pending email from local/session storage
    const pendingEmail = localStorage.getItem("kashi_pending_email");
    if (!pendingEmail) {
      // If no email is pending verification, redirect to login
      navigate("/login");
      return;
    }
    setEmail(pendingEmail);

    // Retrieve active cooldown timer if any
    const storedCooldown = localStorage.getItem("kashi_resend_cooldown");
    if (storedCooldown) {
      const remaining = Math.ceil((Number(storedCooldown) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem("kashi_resend_cooldown");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || loading || !email) return;

    setLoading(true);
    setMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setMessage({
        text: "Verification email resent successfully! Please check your inbox.",
        type: "success",
      });

      // Set 60 seconds cooldown
      const targetTime = Date.now() + 60000;
      localStorage.setItem("kashi_resend_cooldown", String(targetTime));
      setCooldown(60);
    } catch (err: any) {
      console.error("Resend error:", err);
      setMessage({
        text: err.message || "Failed to resend verification email. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const openMailClient = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div
      className="min-h-screen w-full flex text-white overflow-hidden"
      style={{ background: "#0f0a05" }}
    >
      {/* Left Panel - Hero/Visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center min-h-screen p-12">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/bg-login.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <img src="/images/logo.png" alt="The Taste of Kashi" className="h-36 w-auto object-contain mb-8" />
          <h1 className="text-4xl font-serif font-medium leading-tight text-white drop-shadow-md">
            The Taste of
          </h1>
          <h2 className="text-5xl font-serif font-bold text-amber-400 mt-1 drop-shadow-lg">Kashi</h2>
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-12 bg-amber-500/50" />
            <span className="text-amber-500 text-lg">✦</span>
            <div className="h-px w-12 bg-amber-500/50" />
          </div>
          <p className="text-base text-white/75 font-sans max-w-sm mx-auto leading-relaxed">
            Verify your identity to experience the spiritual heart and timeless culinary heritage of Kashi.
          </p>
        </div>
      </div>

      {/* Right Panel - Form / Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center min-h-screen p-6 sm:p-12 relative z-10 bg-[#0f0a05]/95 border-l border-white/5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-medium flex items-center justify-center lg:justify-start gap-2 mb-2 text-white">
              Verify Your Email <Mail className="h-7 w-7 text-amber-400" />
            </h2>
            <p className="text-sm text-white/60 font-sans mt-2">
              Your account has been created successfully. We've sent a verification link to:
            </p>
            <p className="text-base text-amber-400 font-medium font-sans mt-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 inline-block">
              {email}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-center bg-amber-500/10 border border-amber-500/20 w-16 h-16 rounded-full mx-auto">
              <Mail className="h-8 w-8 text-amber-400" />
            </div>

            <p className="text-sm text-white/70 text-center leading-relaxed">
              Please open your email inbox and click the verification link to activate your account. Links expire after 24 hours.
            </p>

            {message && (
              <div
                className={`text-xs p-3 rounded-xl border font-medium ${
                  message.type === "success"
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button
                onClick={openMailClient}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/20"
              >
                Open Gmail / Inbox
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                variant="outline"
                className="w-full h-11 bg-transparent border-white/10 hover:bg-white/5 text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                ) : (
                  <Send className="h-4 w-4 text-amber-400" />
                )}
                {cooldown > 0 ? `Resend Email in ${cooldown}s` : "Resend Verification Email"}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
