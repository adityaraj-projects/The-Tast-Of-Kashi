import React, { useState } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from "lucide-react";
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

const signupSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, navigate] = useLocation();
  const { register, isAuthenticated } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  async function onSubmit(data: SignupFormValues) {
    await register({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    navigate("/");
  }

  return (
    <AuthLayout isLogin={false}>
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-medium flex items-center gap-2 mb-2">
          Namaste! <span className="text-2xl">🙏</span>
        </h2>
        <p className="text-sm text-white/60 font-sans">
          Create your account to explore the soul of Kashi.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                        data-testid="input-fullname"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-white/40 font-medium">@</span>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="pl-8 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                        data-testid="input-username"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                      data-testid="input-email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                      data-testid="input-phone"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-xs" />
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
                    className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/30 h-11 focus-visible:ring-amber-500"
                      data-testid="input-confirm-password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/20 mt-0.5 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      data-testid="checkbox-terms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <label className="text-sm text-white/60 cursor-pointer" htmlFor={field.name}>
                      I agree to the{" "}
                      <a href="#" className="text-amber-500 hover:underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-amber-500 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </FormItem>
              )}
            />
            {form.formState.errors.agreeTerms && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.agreeTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-900/20 text-base flex items-center justify-center gap-2 group mt-6"
            data-testid="button-signup"
          >
            Create Account
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </Form>

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
          className="w-full bg-transparent border-white/10 hover:bg-white/5 hover:text-white h-11 flex items-center gap-3"
          data-testid="button-social-google"
        >
          <SiGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-white/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-amber-500 hover:text-amber-400 font-medium ml-1"
          data-testid="link-login"
        >
          Login here
        </Link>
      </div>
    </AuthLayout>
  );
}
