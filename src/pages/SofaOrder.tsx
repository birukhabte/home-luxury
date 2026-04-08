import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ChevronLeft, ChevronRight,
    ShoppingBag, CreditCard, Phone, CheckCircle2, X,
} from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import luxurySofa from "@/assets/luxury-sofa.jpg";
import sofaNavy from "@/assets/sofa-navy-velvet.jpg";
import sofaCream from "@/assets/sofa-cream-leather.jpg";
import sofaEmerald from "@/assets/sofa-emerald.jpg";
import sofaBurgundy from "@/assets/sofa-burgundy.jpg";
import sofaCharcoal from "@/assets/sofa-charcoal.jpg";
import sofaCamel from "@/assets/sofa-camel.jpg";
import { apiPost } from "@/lib/api";

/* ─────────────────────────────────────────────── product catalogue ── */
const SOFAS: Record<string, {
    name: string;
    subtitle: string;
    material: string;
    price: number;
    gallery: string[];
    colors: string[];
}> = {
    "the-sovereign": {
        name: "The Sovereign",
        subtitle: "Italian Navy Velvet · Hand-tufted · Brushed Gold Legs",
        material: "Italian Navy Velvet",
        price: 285_000,
        gallery: [luxurySofa, sofaNavy, sofaCream, sofaEmerald],
        colors: ["Italian Navy Velvet", "Deep Charcoal Velvet", "Ivory Cream Velvet", "Emerald Green Velvet", "Burgundy Velvet"],
    },
    "the-midnight-royal": {
        name: "The Midnight Royal",
        subtitle: "Deep Blue Velvet · Kiln-Dried Frame · Gold Trim",
        material: "Deep Blue Velvet",
        price: 265_000,
        gallery: [sofaNavy, sofaCharcoal, sofaBurgundy, luxurySofa],
        colors: ["Deep Blue Velvet", "Midnight Charcoal Velvet", "Ink Black Velvet", "Teal Velvet"],
    },
    "the-ivory-empress": {
        name: "The Ivory Empress",
        subtitle: "Premium Italian Leather · Nailhead Detail · Gold Base",
        material: "Premium Italian Leather",
        price: 310_000,
        gallery: [sofaCream, luxurySofa, sofaCamel, sofaEmerald],
        colors: ["Ivory Cream Leather", "Camel Leather", "Blush Pink Leather", "Snow White Leather"],
    },
    "the-emerald-crown": {
        name: "The Emerald Crown",
        subtitle: "Emerald Chesterfield · Curved · Brass Legs",
        material: "Emerald Tufted Velvet",
        price: 295_000,
        gallery: [sofaEmerald, sofaCream, sofaNavy, sofaBurgundy],
        colors: ["Emerald Green Velvet", "Forest Green Velvet", "Sage Green Velvet", "Teal Velvet"],
    },
    "the-bordeaux-classic": {
        name: "The Bordeaux Classic",
        subtitle: "Burgundy Chesterfield · Button-Tufted · Gold Feet",
        material: "Burgundy Velvet",
        price: 275_000,
        gallery: [sofaBurgundy, sofaEmerald, sofaCharcoal, luxurySofa],
        colors: ["Burgundy Velvet", "Wine Red Velvet", "Claret Velvet", "Deep Rose Velvet"],
    },
    "the-metropolitan": {
        name: "The Metropolitan",
        subtitle: "L-Shape Sectional · Charcoal Linen · Clean Modern Lines",
        material: "Charcoal Linen Blend",
        price: 320_000,
        gallery: [sofaCharcoal, sofaBurgundy, sofaNavy, sofaCamel],
        colors: ["Charcoal Linen", "Slate Grey Linen", "Warm Taupe Linen", "Ash White Linen"],
    },
    "the-sahara": {
        name: "The Sahara",
        subtitle: "Camel Italian Leather · Tufted Back · Gold Legs",
        material: "Camel Italian Leather",
        price: 270_000,
        gallery: [sofaCamel, sofaCream, sofaCharcoal, luxurySofa],
        colors: ["Camel Leather", "Tan Leather", "Cognac Leather", "Honey Leather"],
    },
};

type Step = "details" | "payment" | "confirmed";

/* ─────────────────────────────────────────────────────── component ── */
const SofaOrder = () => {
    const { sofaId = "" } = useParams<{ sofaId: string }>();
    const sofa = SOFAS[sofaId];
    if (!sofa) return <Navigate to="/luxury-sofas" replace />;

    /* gallery */
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const prev = () => setActiveImg((p) => (p === 0 ? sofa.gallery.length - 1 : p - 1));
    const next = () => setActiveImg((p) => (p === sofa.gallery.length - 1 ? 0 : p + 1));

    /* form */
    const [step, setStep] = useState<Step>("details");
    const [payMethod, setPayMethod] = useState<"chapa" | "bank">("chapa");
    const [bankSub, setBankSub] = useState<"other" | "mine">("other");
    const [form, setForm] = useState({
        name: "", phone: "", address: "", delivery: "",
        color: sofa.colors[0], qty: 1, notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const total = sofa.price * form.qty;
    const ref = `${sofaId.toUpperCase().slice(0, 8)}-${form.phone.replace(/\s/g, "").slice(-4) || "XXXX"}`;

    /* ── bank details rows ── */
    const bankRows = [
        ["Bank", "Commercial Bank of Ethiopia (CBE)"],
        ["Account Name", "Addis Majlis Glory Trading"],
        ["Account No.", "1000123456789"],
        ["Amount", `ETB ${total.toLocaleString()}`],
        ["Reference", ref],
    ];

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await apiPost("/orders", {
                customerName: form.name,
                phone: form.phone,
                address: form.address,
                productName: sofa.name,
                productId: sofaId,
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <button className="absolute top-5 right-5 text-white hover:text-primary" onClick={() => setLightbox(false)}>
                            <X className="w-8 h-8" />
                        </button>
                        <motion.img
                            key={activeImg}
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            src={sofa.gallery[activeImg]} alt={sofa.name}
                            className="max-h-[85vh] max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white hover:text-primary">
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white hover:text-primary">
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Hero ── */}
            <section className="pt-32 pb-8 bg-charcoal-gradient">
                <div className="container mx-auto px-6 lg:px-16">
                    <Link to="/luxury-sofas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to Luxury Sofas
                    </Link>
                    <span className="font-accent text-sm tracking-[0.3em] uppercase text-primary block mb-2">Order Your Piece</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                        <span className="text-gold-gradient">{sofa.name}</span>
                    </h1>
                    <p className="font-body text-muted-foreground mt-3 max-w-xl">{sofa.subtitle}</p>
                </div>
            </section>

            {/* ── Step bar ── */}
            {step !== "confirmed" && (
                <div className="bg-charcoal-gradient border-b border-border py-4">
                    <div className="container mx-auto px-6 lg:px-16 flex items-center gap-6">
                        {[{ id: "details", label: "Your Details" }, { id: "payment", label: "Payment" }].map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${step === s.id ? "bg-primary text-primary-foreground border-primary"
                                        : i === 0 && step === "payment" ? "bg-primary/20 text-primary border-primary"
                                            : "bg-muted text-muted-foreground border-border"}`}>
                                    {i === 0 && step === "payment" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`font-body text-sm ${step === s.id ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
                                {i < 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Main ── */}
            <section className="py-16 bg-charcoal-gradient">
                <div className="container mx-auto px-6 lg:px-16">

                    {/* ══ CONFIRMED ══ */}
                    {step === "confirmed" && (
                        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                            className="max-w-lg mx-auto text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Order Received!</h2>
                            <p className="font-body text-muted-foreground mb-2">
                                Thank you, <span className="text-foreground font-semibold">{form.name}</span>. Your order for{" "}
                                <span className="text-primary font-semibold">{sofa.name}</span> is confirmed.
                            </p>
                            <p className="font-body text-muted-foreground mb-8">
                                Our team will contact you on <span className="text-foreground">{form.phone}</span> within 24 hours.
                            </p>
                            <div className="border border-border p-6 text-left mb-8 space-y-2">
                                {[
                                    ["Colour", form.color],
                                    ["Quantity", String(form.qty)],
                                    ["Delivery to", form.address],
                                    ["Total", `ETB ${total.toLocaleString()}`],
                                    ["Payment", payMethod === "chapa" ? "Chapa (Online)" : `Bank Transfer — ${bankSub === "other" ? "Another Person's CBE" : "My CBE Account"}`],
                                ].map(([k, v]) => (
                                    <p key={k} className="font-body text-sm text-muted-foreground">
                                        {k}: <span className={k === "Total" ? "text-primary font-bold" : "text-foreground"}>{v}</span>
                                    </p>
                                ))}
                            </div>
                            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300">
                                Back to Home
                            </Link>
                        </motion.div>
                    )}

                    {/* ══ GALLERY + FORM ══ */}
                    {step !== "confirmed" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                                {/* ── Gallery ── */}
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                <div className="relative overflow-hidden cursor-zoom-in group mb-4" onClick={() => setLightbox(true)}>
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeImg}
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                                            src={sofa.gallery[activeImg]} alt={sofa.name}
                                            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </AnimatePresence>
                                    <button onClick={(e) => { e.stopPropagation(); prev(); }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); next(); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-body px-2 py-1 rounded">Click to zoom</div>
                                    <div className="absolute inset-0 border border-primary/10 pointer-events-none" />
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-2">
                                    {sofa.gallery.map((img, i) => (
                                        <button key={i} onClick={() => setActiveImg(i)}
                                            className={`relative overflow-hidden aspect-square border-2 transition-all duration-200 ${activeImg === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>

                                {/* Product card */}
                                <div className="mt-8 border border-border p-6 space-y-3">
                                    {[
                                        ["Base Price", `ETB ${sofa.price.toLocaleString()}`],
                                        ["Material", sofa.material],
                                        ["Frame", "Kiln-Dried Hardwood"],
                                        ["Warranty", "10 Years (Frame)"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between items-center">
                                            <span className="font-body text-sm text-muted-foreground">{k}</span>
                                            <span className="font-body text-sm text-foreground">{v}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-border pt-3 flex justify-between items-center">
                                        <span className="font-body text-sm font-semibold text-foreground">Order Total</span>
                                        <span className="font-display font-bold text-primary text-lg">ETB {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Form ── */}
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

                                {/* ─ Step 1: Details ─ */}
                                {step === "details" && (
                                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                                        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                                            <ShoppingBag className="w-6 h-6 text-primary" /> Your Details
                                        </h2>
                                        <p className="font-body text-sm text-muted-foreground">Fill in below and we'll confirm your order within 24 hours.</p>

                                        {[
                                            { label: "Full Name *", name: "name", type: "text", placeholder: "Your full name", required: true },
                                            { label: "Phone Number *", name: "phone", type: "tel", placeholder: "e.g. 0911 288 820", required: true },
                                            { label: "Delivery Address *", name: "address", type: "text", placeholder: "Street, Sub-city, Woreda", required: true },
                                            { label: "Preferred Delivery Date", name: "delivery", type: "date", placeholder: "", required: false },
                                        ].map((f) => (
                                            <div key={f.name}>
                                                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">{f.label}</label>
                                                <input type={f.type} name={f.name} required={f.required}
                                                    value={form[f.name as keyof typeof form] as string}
                                                    onChange={handleChange} placeholder={f.placeholder}
                                                    className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" />
                                            </div>
                                        ))}

                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">Colour / Fabric *</label>
                                            <select name="color" required value={form.color} onChange={handleChange}
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors">
                                                {sofa.colors.map((c) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">Quantity</label>
                                            <input type="number" name="qty" min={1} max={10} value={form.qty} onChange={handleChange}
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                        </div>

                                        <div>
                                            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">Special Requests</label>
                                            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
                                                placeholder="Custom dimensions, fabric swatches, etc."
                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/50" />
                                        </div>

                                        <div className="border-t border-border pt-5 flex items-center justify-between">
                                            <div>
                                                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Order Total</p>
                                                <p className="font-display text-2xl font-bold text-primary">ETB {total.toLocaleString()}</p>
                                            </div>
                                            <button type="submit"
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300">
                                                Continue to Payment <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* ─ Step 2: Payment ─ */}
                                {step === "payment" && (
                                    <form onSubmit={handlePaySubmit} className="space-y-6">
                                        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-primary" /> Payment
                                        </h2>

                                        {/* Summary */}
                                        <div className="bg-muted/10 border border-border p-5 space-y-2">
                                            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Order Summary</p>
                                            {[
                                                [`${sofa.name} × ${form.qty}`, `ETB ${total.toLocaleString()}`],
                                                ["Colour", form.color],
                                                ["Delivery to", form.address],
                                            ].map(([k, v]) => (
                                                <div key={k} className="flex justify-between text-sm font-body">
                                                    <span className="text-muted-foreground">{k}</span>
                                                    <span className="text-foreground">{v}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-border pt-2 flex justify-between font-bold">
                                                <span className="font-body text-foreground">Total</span>
                                                <span className="font-display text-primary text-lg">ETB {total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Payment method */}
                                        <div>
                                            <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Choose Payment Method</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: "chapa", icon: "💳", label: "Chapa Online", desc: "Telebirr, CBE Birr, cards" },
                                                    { id: "bank", icon: "🏦", label: "Bank Transfer", desc: "Direct CBE transfer" },
                                                ].map((m) => (
                                                    <button key={m.id} type="button" onClick={() => setPayMethod(m.id as "chapa" | "bank")}
                                                        className={`border p-4 text-left transition-all duration-200 ${payMethod === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                                                        <div className="text-2xl mb-2">{m.icon}</div>
                                                        <p className="font-body font-semibold text-sm text-foreground">{m.label}</p>
                                                        <p className="font-body text-xs text-muted-foreground mt-1">{m.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chapa */}
                                        {payMethod === "chapa" && (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-muted/10 border border-primary/30 p-5 space-y-3">
                                                <p className="font-body text-sm font-semibold text-foreground">Pay via Chapa</p>
                                                <p className="font-body text-xs text-muted-foreground">
                                                    After clicking <strong>Confirm Order</strong> you'll be redirected to Chapa's secure checkout (Telebirr, CBE Birr, or card).
                                                </p>
                                                <div className="flex gap-2 flex-wrap pt-1">
                                                    {["Telebirr", "CBE Birr", "Visa", "Mastercard"].map((b) => (
                                                        <span key={b} className="font-body text-xs border border-border px-2 py-1 text-muted-foreground">{b}</span>
                                                    ))}
                                                </div>
                                                <div className="space-y-3 pt-2">
                                                    <input placeholder="Full name on account"
                                                        className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" />
                                                    <input type="email" placeholder="Email address (for receipt)"
                                                        className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Bank */}
                                        {payMethod === "bank" && (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-muted/10 border border-primary/30 p-5 space-y-4">
                                                <p className="font-body text-sm font-semibold text-foreground">Bank Transfer — Choose How You'll Pay</p>

                                                {/* Sub-choice */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { id: "other", icon: "👤", label: "Another Person's CBE", desc: "Pay from someone else's CBE account on your behalf" },
                                                        { id: "mine", icon: "🏦", label: "My Own CBE Account", desc: "Transfer directly from your own CBE account" },
                                                    ].map((opt) => (
                                                        <button key={opt.id} type="button" onClick={() => setBankSub(opt.id as "other" | "mine")}
                                                            className={`border p-3 text-left transition-all duration-200 ${bankSub === opt.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                                                            <div className="text-xl mb-1">{opt.icon}</div>
                                                            <p className="font-body font-semibold text-xs text-foreground">{opt.label}</p>
                                                            <p className="font-body text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Shared account table */}
                                                <div className="space-y-2">
                                                    {bankRows.map(([k, v]) => (
                                                        <div key={k} className="flex justify-between text-sm font-body border-b border-border/40 pb-1">
                                                            <span className="text-muted-foreground">{k}</span>
                                                            <span className="text-foreground font-semibold">{v}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Other person fields */}
                                                {bankSub === "other" && (
                                                    <motion.div key="other" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            Ask the other person to transfer using your phone number as the reference.
                                                        </p>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Sender's Full Name *</label>
                                                            <input type="text" placeholder="Name of the person making the payment"
                                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" />
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Upload Transfer Receipt (optional)</label>
                                                            <input type="file" accept="image/*,application/pdf"
                                                                className="w-full font-body text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-primary-foreground file:font-body file:text-xs file:font-semibold file:uppercase file:tracking-widest cursor-pointer" />
                                                        </div>
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            After transfer, send the receipt to <strong>0911 288 820</strong> on WhatsApp.
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {/* My own CBE fields */}
                                                {bankSub === "mine" && (
                                                    <motion.div key="mine" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            Transfer from your CBE account using the details above. Use your phone number as the reference.
                                                        </p>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Your CBE Account Number</label>
                                                            <input type="text" placeholder="e.g. 1000XXXXXXXXX"
                                                                className="w-full bg-muted/20 border border-border text-foreground font-body text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" />
                                                        </div>
                                                        <div>
                                                            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Upload Transfer Receipt (optional)</label>
                                                            <input type="file" accept="image/*,application/pdf"
                                                                className="w-full font-body text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-primary-foreground file:font-body file:text-xs file:font-semibold file:uppercase file:tracking-widest cursor-pointer" />
                                                        </div>
                                                        <p className="font-body text-xs text-muted-foreground">
                                                            You can also pay via <strong>CBE mobile app</strong> or <strong>online banking</strong>. Send the receipt to <strong>0911 288 820</strong> on WhatsApp.
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
                                                <a href="tel:0911288820" className="text-primary underline">Call 0911 288 820</a>
                                                {" "}and our team will assist you.
                                            </p>
                                        </div>

                                        {error && (
                                            <p className="font-body text-xs text-red-500">{error}</p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-2">
                                            <button type="button" onClick={() => setStep("details")}
                                                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                                                <ChevronLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase hover:bg-gold-light hover:shadow-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                                                <CheckCircle2 className="w-4 h-4" /> {submitting ? "Placing Order..." : "Confirm Order"}
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

export default SofaOrder;
