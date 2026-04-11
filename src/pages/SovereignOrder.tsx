import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, CreditCard, Phone, CheckCircle2, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Gallery images — main + 3 alternates using existing sofa assets
import img1 from "@/assets/luxury-sofa.jpg";
import img2 from "@/assets/sofa-navy-velvet.jpg";
import img3 from "@/assets/sofa-cream-leather.jpg";
import img4 from "@/assets/sofa-emerald.jpg";
import { apiPost } from "@/lib/api";

const gallery = [img1, img2, img3, img4];

const colorOptions = [
    "Italian Navy Velvet",
    "Deep Charcoal Velvet",
    "Ivory Cream Velvet",
    "Emerald Green Velvet",
    "Burgundy Velvet",
];

type Step = "details" | "payment" | "confirmed";

const SovereignOrder = () => {
    /* ── Gallery ── */
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const prev = () => setActiveImg((p) => (p === 0 ? gallery.length - 1 : p - 1));
    const next = () => setActiveImg((p) => (p === gallery.length - 1 ? 0 : p + 1));

    /* ── Form ── */
    const [step, setStep] = useState<Step>("details");
    const [payMethod, setPayMethod] = useState<"chapa" | "bank">("chapa");
    const [bankSub, setBankSub] = useState<"other" | "mine">("other");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        delivery: "",
        color: colorOptions[0],
        qty: 1,
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await apiPost("/orders", {
                customerName: form.name,
                phone: form.phone,
                address: form.address,
                productName: "The Sovereign",
                productId: "sovereign",
                quantity: form.qty,
                totalAmount: total,
                notes: form.notes,
                paymentMethod: payMethod,
            });
            setStep("confirmed");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            console.error("Failed to place order", err);
            setError("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const price = 285000;
    const total = price * form.qty;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <button
                            className="absolute top-5 right-5 text-white hover:text-primary transition-colors"
                            onClick={() => setLightbox(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <motion.img
                            key={activeImg}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={gallery[activeImg]}
                            alt="The Sovereign"
                            className="max-h-[85vh] max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 text-white hover:text-primary transition-colors"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 text-white hover:text-primary transition-colors"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Hero breadcrumb ── */}
            <section className="pt-32 pb-8 bg-charcoal-gradient">
                <div className="container mx-auto px-6 lg:px-16">
                    <Link
                        to="/luxury-sofas"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Luxury Sofas
                    </Link>
                    <span className="font-accent text-sm tracking-[0.3em] uppercase text-primary block mb-2">
                        Order Your Piece
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                        The <span className="text-gold-gradient">Sovereign</span>
                    </h1>
                    <p className="font-body text-muted-foreground mt-3 max-w-xl">
                        Italian Navy Velvet · Hand-tufted · Brushed Gold Legs
                    </p>
                </div>
            </section>

            {/* ── Step indicator ── */}
            {step !== "confirmed" && (
                <div className="bg-charcoal-gradient border-b border-border py-4">
                    <div className="container mx-auto px-6 lg:px-16 flex items-center gap-6">
                        {[
                            { id: "details", label: "Your Details" },
                            { id: "payment", label: "Payment" },
                        ].map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${step === s.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : i === 0 && step === "payment"
                                            ? "bg-primary/20 text-primary border-primary"
                                            : "bg-muted text-muted-foreground border-border"
                                        }`}
                                >
                                    {i === 0 && step === "payment" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`font-body text-sm ${step === s.id ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                    {s.label}
                                </span>
                                {i < 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Main content ── */}
            <section className="py-16 bg-charcoal-gradient">
                <div className="container mx-auto px-6 lg:px-16">

                    {/* ══ CONFIRMED ══ */}
                    {step === "confirmed" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-lg mx-auto text-center py-16"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                                Order Received!
                            </h2>
                            <p className="font-body text-muted-foreground mb-2">
                                Thank you, <span className="text-foreground font-semibold">{form.name}</span>. Your order for{" "}
                                <span className="text-primary font-semibold">The Sovereign</span> is confirmed.
                            </p>
                            <p className="font-body text-muted-foreground mb-8">
                                Our team will contact you on <span className="text-foreground">{form.phone}</span> within 24 hours to finalise delivery details.
                            </p>
                            <div className="border border-border p-6 text-left mb-8 space-y-2">
                                <p className="font-body text-sm text-muted-foreground">Colour: <span className="text-foreground">{form.color}</span></p>
                                <p className="font-body text-sm text-muted-foreground">Quantity: <span className="text-foreground">{form.qty}</span></p>
                                <p className="font-body text-sm text-muted-foreground">Delivery to: <span className="text-foreground">{form.address}</span></p>
                                <p className="font-body text-sm text-muted-foreground">Total Paid: <span className="text-primary font-bold">ETB {total.toLocaleString()}</span></p>
                                <p className="font-body text-sm text-muted-foreground">Payment: <span className="text-foreground capitalize">{payMethod === "chapa" ? "Chapa (Online)" : "Bank Transfer"}</span></p>
                            </div>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300"
                            >
                                Back to Home
                            </Link>
                        </motion.div>
                    )}

                    {/* ══ DETAILS + GALLERY (two-column) ══ */}
                    {step !== "confirmed" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                            {/* ── Left: gallery ── */}
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                {/* Main image */}
                                <div
                                    className="relative overflow-hidden cursor-zoom-in group mb-4"
                                    onClick={() => setLightbox(true)}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeImg}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            src={gallery[activeImg]}
                                            alt="The Sovereign"
                                            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </AnimatePresence>
                                    {/* Arrows */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prev(); }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); next(); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-body px-2 py-1 rounded">
                                        Click to zoom
                                    </div>
                                    <div className="absolute inset-0 border border-primary/10 pointer-events-none" />
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-2">
                                    {gallery.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={`relative overflow-hidden aspect-square border-2 transition-all duration-200 ${activeImg === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>

                                {/* Product summary */}
                                <div className="mt-8 border border-border p-6 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm text-muted-foreground">Base Price</span>
                                        <span className="font-display font-bold text-foreground">ETB {price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm text-muted-foreground">Material</span>
                                        <span className="font-body text-sm text-foreground">Italian Velvet</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm text-muted-foreground">Frame</span>
                                        <span className="font-body text-sm text-foreground">Kiln-Dried Hardwood</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm text-muted-foreground">Legs</span>
                                        <span className="font-body text-sm text-foreground">Brushed Gold</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-body text-sm text-muted-foreground">Warranty</span>
                                        <span className="font-body text-sm text-foreground">10 Years (Frame)</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between items-center">
                                        <span className="font-body text-sm font-semibold text-foreground">Order Total</span>
                                        <span className="font-display font-bold text-primary text-lg">
                                            ETB {total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Right: form ── */}
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

                                {/* ── STEP 1: Details ── */}
                                {step === "details" && (
                                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                                        <h2 className="font-display text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                                            <ShoppingBag className="w-6 h-6 text-primary" />
                                            Your Details
                                        </h2>
                                        <p className="font-body text-sm text-muted-foreground mb-6">
                                            Fill in the information below and we'll confirm your order within 24 hours.
                                        </p>

                                        {/* Name */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="e.g. 0911 288 820"
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Delivery Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder="Street, Sub-city, Woreda"
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                            />
                                        </div>

                                        {/* Delivery date */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Preferred Delivery Date
                                            </label>
                                            <input
                                                type="date"
                                                name="delivery"
                                                value={form.delivery}
                                                onChange={handleChange}
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>

                                        {/* Colour */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Colour / Fabric *
                                            </label>
                                            <select
                                                name="color"
                                                required
                                                value={form.color}
                                                onChange={handleChange}
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            >
                                                {colorOptions.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="qty"
                                                min={1}
                                                max={10}
                                                value={form.qty}
                                                onChange={handleChange}
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                                                Special Requests
                                            </label>
                                            <textarea
                                                name="notes"
                                                rows={3}
                                                value={form.notes}
                                                onChange={handleChange}
                                                placeholder="Custom dimensions, fabric swatches, etc."
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/50"
                                            />
                                        </div>

                                        {/* Total */}
                                        <div className="border-t border-border pt-5 flex items-center justify-between">
                                            <div>
                                                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Order Total</p>
                                                <p className="font-display text-2xl font-bold text-primary">
                                                    ETB {total.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300"
                                            >
                                                Continue to Payment
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* ── STEP 2: Payment ── */}
                                {step === "payment" && (
                                    <form onSubmit={handlePaySubmit} className="space-y-6">
                                        <h2 className="font-display text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-primary" />
                                            Payment
                                        </h2>

                                        {/* Order summary */}
                                        <div className="bg-muted/10 border border-border p-5 space-y-2">
                                            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Order Summary</p>
                                            <div className="flex justify-between text-sm font-body">
                                                <span className="text-muted-foreground">The Sovereign × {form.qty}</span>
                                                <span className="text-foreground">ETB {total.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-body">
                                                <span className="text-muted-foreground">Colour</span>
                                                <span className="text-foreground">{form.color}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-body">
                                                <span className="text-muted-foreground">Delivery to</span>
                                                <span className="text-foreground">{form.address}</span>
                                            </div>
                                            <div className="border-t border-border pt-2 flex justify-between font-bold">
                                                <span className="font-body text-foreground">Total</span>
                                                <span className="font-display text-primary text-lg">ETB {total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Payment method selector */}
                                        <div>
                                            <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                                                Choose Payment Method
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: "chapa", label: "Chapa Online", icon: "💳", desc: "Pay securely via Chapa — CBE Birr, Telebirr, cards" },
                                                    { id: "bank", label: "Bank Transfer", icon: "🏦", desc: "Direct transfer to our CBE or Awash Bank account" },
                                                ].map((m) => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => setPayMethod(m.id as "chapa" | "bank")}
                                                        className={`border p-4 text-left transition-all duration-200 ${payMethod === m.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border hover:border-primary/40"
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-2">{m.icon}</div>
                                                        <p className="font-body font-semibold text-sm text-foreground">{m.label}</p>
                                                        <p className="font-body text-xs text-muted-foreground mt-1">{m.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chapa instructions */}
                                        {payMethod === "chapa" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-muted/10 border border-primary/30 p-5 space-y-3"
                                            >
                                                <p className="font-body text-sm font-semibold text-foreground">Pay via Chapa</p>
                                                <p className="font-body text-xs text-muted-foreground">
                                                    After clicking <strong>Confirm Order</strong>, you will be redirected to Chapa's secure
                                                    checkout where you can pay using <strong>Telebirr, CBE Birr, or card</strong>.
                                                </p>
                                                <div className="flex items-center gap-3 pt-2">
                                                    <div className="flex gap-2 flex-wrap">
                                                        {["Telebirr", "CBE Birr", "Visa", "Mastercard"].map((b) => (
                                                            <span key={b} className="font-body text-xs border border-border px-2 py-1 text-muted-foreground">
                                                                {b}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Chapa checkout fields (UI demo) */}
                                                <div className="space-y-3 pt-2">
                                                    <input
                                                        placeholder="Full name on account"
                                                        className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                    />
                                                    <input
                                                        placeholder="Email address (receipt)"
                                                        type="email"
                                                        className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Bank transfer instructions */}
                                        {payMethod === "bank" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-muted/10 border border-primary/30 p-5 space-y-4"
                                            >
                                                <p className="font-body text-sm font-semibold text-foreground">Bank Transfer — Choose How You'll Pay</p>

                                                {/* Sub-choice buttons */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { id: "other", icon: "👤", label: "Another Person's CBE", desc: "Pay from someone else's CBE account on your behalf" },
                                                        { id: "mine", icon: "🏦", label: "My Own CBE Account", desc: "Transfer directly from your own CBE account" },
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            onClick={() => setBankSub(opt.id as "other" | "mine")}
                                                            className={`border p-3 text-left transition-all duration-200 ${bankSub === opt.id
                                                                    ? "border-primary bg-primary/10"
                                                                    : "border-border hover:border-primary/40"
                                                                }`}
                                                        >
                                                            <div className="text-xl mb-1">{opt.icon}</div>
                                                            <p className="font-body font-semibold text-xs text-foreground">{opt.label}</p>
                                                            <p className="font-body text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* ── Other person's CBE ── */}
                                                {bankSub === "other" && (
                                                    <motion.div
                                                        key="other"
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-3 pt-1"
                                                    >
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            Ask the other person to transfer to our CBE account below using your phone number as the reference.
                                                        </p>
                                                        <div className="space-y-2">
                                                            {[
                                                                ["Bank", "Commercial Bank of Ethiopia (CBE)"],
                                                                ["Account Name", "Addis Majlis Glory Trading"],
                                                                ["Account No.", "1000123456789"],
                                                                ["Amount", `ETB ${total.toLocaleString()}`],
                                                                ["Reference", `SOVEREIGN-${form.phone.replace(/\s/g, "").slice(-4)}`],
                                                            ].map(([k, v]) => (
                                                                <div key={k} className="flex justify-between text-sm font-body border-b border-border/40 pb-1">
                                                                    <span className="text-muted-foreground">{k}</span>
                                                                    <span className="text-foreground font-semibold">{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                                                                Sender's Full Name *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Name of the person making the payment"
                                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                                                                Upload Transfer Receipt (optional)
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*,application/pdf"
                                                                className="w-full font-body text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-primary-foreground file:font-body file:text-xs file:font-semibold file:uppercase file:tracking-widest cursor-pointer"
                                                            />
                                                        </div>
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            After transfer, send the receipt to <strong>0911 288 820</strong> on WhatsApp.
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {/* ── My own CBE ── */}
                                                {bankSub === "mine" && (
                                                    <motion.div
                                                        key="mine"
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-3 pt-1"
                                                    >
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            Transfer from your own CBE account to our account below. Use your phone number as the reference so we can match your payment.
                                                        </p>
                                                        <div className="space-y-2">
                                                            {[
                                                                ["Bank", "Commercial Bank of Ethiopia (CBE)"],
                                                                ["Account Name", "Addis Majlis Glory Trading"],
                                                                ["Account No.", "1000123456789"],
                                                                ["Amount", `ETB ${total.toLocaleString()}`],
                                                                ["Reference", `SOVEREIGN-${form.phone.replace(/\s/g, "").slice(-4)}`],
                                                            ].map(([k, v]) => (
                                                                <div key={k} className="flex justify-between text-sm font-body border-b border-border/40 pb-1">
                                                                    <span className="text-muted-foreground">{k}</span>
                                                                    <span className="text-foreground font-semibold">{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                                                                Your CBE Account Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. 1000XXXXXXXXX"
                                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                                                                Upload Transfer Receipt (optional)
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*,application/pdf"
                                                                className="w-full font-body text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-primary-foreground file:font-body file:text-xs file:font-semibold file:uppercase file:tracking-widest cursor-pointer"
                                                            />
                                                        </div>
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            You can also transfer via <strong>CBE mobile app</strong> or <strong>online banking</strong>. Send the receipt to <strong>0911 288 820</strong> on WhatsApp.
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Phone fallback */}
                                        <div className="border border-border/40 p-4 flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <p className="font-body text-xs text-muted-foreground">
                                                Prefer to order by phone?{" "}
                                                <a href="tel:0995871152" className="text-primary underline">Call 0995 871 152</a>
                                                {" "}and our team will assist you directly.
                                            </p>
                                        </div>

                                        {error && (
                                            <p className="font-body text-xs text-red-500">{error}</p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setStep("details")}
                                                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                                            >
                                                <ChevronLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                {submitting ? "Placing Order..." : "Confirm Order"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SovereignOrder;
