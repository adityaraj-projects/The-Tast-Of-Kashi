import React, { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

const logoPath = "/images/logo.png";
const bgPath = "/images/bg-login.png";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(_data: ForgotFormValues) {
    setSent(true);
  }

  return (
    <div
      className="min-h-screen w-full flex text-white overflow-hidden"
      style={{ background: "#0f0a05" }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center min-h-screen p-12">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgPath})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <img src={logoPath} alt="The Taste of Kashi" className="h-36 w-auto object-contain mb-8" />
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
            We'll help you get back to exploring the soul of the world's oldest living city.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img src={logoPath} alt="The Taste of Kashi" className="h-20 w-auto object-contain" />
          </div>

          <div className="bg-[#1a1108]/90 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-8 sm:p-10">
            {!sent ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-medium mb-2">Reset Password</h2>
                  <p className="text-sm text-white/60 font-sans">
                    Enter your email and we'll send you a link to reset your password.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                            <FormControl>
                              <Input
                                placeholder="Your Email Address"
                                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-900/20 text-base flex items-center justify-center gap-2 group"
                    >
                      Send Reset Link
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-5">
                  <CheckCircle2 className="w-16 h-16 text-amber-500" />
                </div>
                <h2 className="text-2xl font-serif font-medium mb-3">Check Your Email</h2>
                <p className="text-sm text-white/60 font-sans mb-8 leading-relaxed">
                  We've sent a password reset link to{" "}
                  <span className="text-amber-400 font-medium">{form.getValues("email")}</span>.
                  Please check your inbox.
                </p>
                <p className="text-xs text-white/40 mb-6">
                  Didn't receive it? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className="w-full bg-transparent border-white/10 hover:bg-white/5 hover:text-white h-11"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
