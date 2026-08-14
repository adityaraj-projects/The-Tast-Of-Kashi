import React, { useState, useEffect } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Phone Number is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState("");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setResendLoading(true);
    setErrorMsg("");
    setResendSuccessMsg("");
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: resendEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      setResendSuccessMsg("Verification link resent successfully! Check your inbox.");
      setResendCooldown(60);
      localStorage.setItem("kashi_pending_email", resendEmail);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await login(data.identifier, data.password);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout isLogin={true}>
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-medium flex items-center gap-2 mb-2">
          Namaste! <span className="text-2xl">🙏</span>
        </h2>
        <p className="text-sm text-white/60 font-sans">
          Login to continue your journey in Kashi
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs mb-4 font-medium animate-shake">
          {errorMsg}
        </div>
      )}

      {showResend ? (
        <form onSubmit={handleResendEmail} className="space-y-5">
          <p className="text-sm text-white/70 leading-relaxed">
            Didn't receive the verification email? Enter your email address below to resend the activation link.
          </p>
          {resendSuccessMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-xl text-xs mb-2 font-medium">
              {resendSuccessMsg}
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
            <Input
              type="email"
              placeholder="Email Address"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={resendLoading || resendCooldown > 0}
            className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-900/20 text-base flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setShowResend(false);
                setErrorMsg("");
                setResendSuccessMsg("");
              }}
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </form>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <FormControl>
                      <Input
                        placeholder="Email or Phone Number"
                        className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                        data-testid="input-identifier"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between mt-2">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 cursor-pointer"
                        data-testid="checkbox-remember"
                      />
                    </FormControl>
                    <label className="text-sm text-white/60 cursor-pointer" htmlFor={field.name}>
                      Remember me
                    </label>
                  </FormItem>
                )}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
                data-testid="link-forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-900/20 text-base flex items-center justify-center gap-2 group cursor-pointer"
              data-testid="button-login"
            >
              Login
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowResend(true);
                  setErrorMsg("");
                  setResendSuccessMsg("");
                  // Prefill if the user already typed an email
                  const val = form.getValues("identifier");
                  if (val && val.includes("@")) {
                    setResendEmail(val);
                  }
                }}
                className="text-xs text-white/50 hover:text-amber-500 transition-colors cursor-pointer"
              >
                Didn't receive the verification email? Resend verification email
              </button>
            </div>
          </form>
        </Form>
      )}

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#1a1108] px-2 text-white/40">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full bg-transparent border-white/10 hover:bg-white/5 hover:text-white h-11 flex items-center gap-3 cursor-pointer"
          data-testid="button-social-google"
        >
          <SiGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </Button>
      </div>

      <div className="mt-8 text-center text-sm text-white/60">
        New here?{" "}
        <Link
          href="/signup"
          className="text-amber-500 hover:text-amber-400 font-medium ml-1 cursor-pointer"
          data-testid="link-create-account"
        >
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
}
