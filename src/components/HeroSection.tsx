import { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-living-room.jpg";
import { apiPost } from "@/lib/api";

const HeroSection = () => {
  const [activeAuthForm, setActiveAuthForm] = useState<"login" | "register" | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury living room with premium sofa and Arabian-inspired design in Addis Ababa"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-accent text-lg tracking-[0.3em] uppercase text-gold-light mb-6 block">
              Addis Ababa's Finest
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-foreground">Where Luxury</span>
            <br />
            <span className="text-gold-gradient">Meets Tradition</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
          >
            Handcrafted luxury sofas and authentic Arabian Majlis seating —
            designed for those who refuse to compromise on elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="tel:0911288820"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              Book a Private Viewing
            </a>
            <a
              href="#collections"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold-dark text-foreground font-body font-medium text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-primary/10"
            >
              Explore Collections
            </a>
            <div className="flex gap-3 mt-2 sm:mt-0 sm:ml-auto">
              <button
                type="button"
                onClick={() => setActiveAuthForm("login")}
                className="inline-flex items-center justify-center px-5 py-3 border border-primary/60 text-primary-foreground bg-primary/90 font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-primary hover:shadow-gold"
             >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveAuthForm("register")}
                className="inline-flex items-center justify-center px-5 py-3 border border-primary/40 text-foreground font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-primary/10"
              >
                Register
              </button>
            </div>
          </motion.div>

          {/* Product Category Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { label: "Sofas", href: "/luxury-sofas" },
              { label: "Majlis", href: "/arabian-majlis" },
              { label: "TV Stand", href: "/luxury-tv-stands" },
              { label: "More", href: "#collections" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                className="px-5 py-2 border border-primary/30 text-sm font-body tracking-[0.1em] uppercase text-foreground/80 hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all duration-300 backdrop-blur-sm bg-background/10"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {activeAuthForm && (
        <div className="fixed top-4 right-4 z-50 w-80 rounded-xl border border-gold-dark bg-background/95 shadow-xl backdrop-blur-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {activeAuthForm === "login" ? "Login" : "Register"}
            </h2>
            <button
              type="button"
              onClick={() => setActiveAuthForm(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setMessage(null);
              setError(null);

              if (activeAuthForm === "register") {
                if (!fullName || !email || !password) {
                  setError("Please fill in all fields.");
                  return;
                }

                try {
                  setSubmitting(true);
                  await apiPost("/users", {
                    email,
                    passwordHash: password, // TODO: hash on backend in a real auth flow
                    name: fullName,
                    role: "customer",
                  });
                  setMessage("Account created successfully.");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                } catch (err: any) {
                  setError(err?.message || "Failed to register. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              } else {
                if (!email || !password) {
                  setError("Please enter your email and password.");
                  return;
                }

                try {
                  setSubmitting(true);
                  const user = await apiPost("/users/login", {
                    email,
                    password,
                  });
                  setMessage(`Welcome back, ${user.name || "guest"}.`);
                  setPassword("");
                } catch (err: any) {
                  setError(err?.message || "Failed to login. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }
            }}
          >
            {activeAuthForm === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-body text-xs font-semibold tracking-[0.16em] uppercase rounded-md hover:bg-gold-light transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting
                ? activeAuthForm === "login"
                  ? "Logging in..."
                  : "Creating Account..."
                : activeAuthForm === "login"
                ? "Login"
                : "Create Account"}
            </button>
            {message && (
              <p className="text-xs text-emerald-600 mt-1">{message}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </form>
        </div>
      )}

      {/* Decorative gold line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </section>
  );
};

export default HeroSection;
