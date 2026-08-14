import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        // 1. Check for errors in URL search params or hash
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        
        // Check query param errors
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        if (error) {
          throw new Error(errorDescription || error || "Email verification failed or link expired.");
        }

        // Check hash params errors (e.g., #error=access_denied&error_code=otp_expired)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hashError = hashParams.get("error");
          const hashErrorDesc = hashParams.get("error_description");
          if (hashError) {
            throw new Error(hashErrorDesc || hashError || "Email verification link has expired or is invalid.");
          }
        }

        // 2. Handle PKCE code exchange if present (?code=...)
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        // 3. Handle token_hash verification if present (?token_hash=...&type=email)
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        if (tokenHash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type || "email",
          });
          if (verifyError) {
            throw verifyError;
          }
        }

        // 4. Retrieve or wait for established session
        let session = null;
        const { data: sessionData } = await supabase.auth.getSession();
        session = sessionData.session;

        // If not immediately available, retry briefly as Supabase client processes the hash
        if (!session) {
          for (let i = 0; i < 5; i++) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData.session) {
              session = retryData.session;
              break;
            }
          }
        }

        if (!session || !session.user) {
          throw new Error("No active session detected. Please sign in with your email and password.");
        }

        if (!session.user.email_confirmed_at) {
          localStorage.setItem("kashi_pending_email", session.user.email || "");
          if (isMounted) {
            navigate("/verify-email");
          }
          return;
        }

        // 5. Query user profile from public.users to ensure sync
        let profile = null;
        for (let i = 0; i < 3; i++) {
          const { data: p } = await supabase
            .from("users")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single();
          if (p) {
            profile = p;
            break;
          }
          await new Promise((r) => setTimeout(r, 300));
        }

        const mappedUser = {
          id: String(profile?.id || session.user.id),
          auth_user_id: session.user.id,
          fullName: profile?.display_name || profile?.fullName || session.user.user_metadata?.fullName || "Aditya Rai",
          username: profile?.username || session.user.user_metadata?.username || "aditya",
          email: session.user.email || "",
          phone: profile?.phone || session.user.user_metadata?.phone || "",
          role: profile?.role || "user",
        };

        localStorage.setItem("kashi_user", JSON.stringify(mappedUser));

        if (isMounted) {
          setStatus("success");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (err: any) {
        console.error("Auth callback verification error:", err);
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "Failed to verify email confirmation link.");
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0B0907] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-black to-black/80 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#16120D]/90 border border-amber-500/20 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
        {status === "loading" && (
          <div className="space-y-6 py-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-white font-medium">Verifying Your Email</h2>
              <p className="text-sm text-white/60">
                Please wait while we confirm your account and set up your Kashi journey...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white font-medium">Email Confirmed!</h2>
              <p className="text-sm text-white/70">
                Welcome to The Taste of Kashi. Redirecting you to your dashboard...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 py-4 animate-in fade-in duration-300">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-white font-medium">Verification Failed</h2>
              <p className="text-sm text-red-300/90 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-11 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/20"
              >
                Go to Login
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-white/40">
                If the link expired, please log in or sign up again to receive a fresh verification email.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
