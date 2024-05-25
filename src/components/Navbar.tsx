import { useState, useEffect } from "react";
import { Phone, Search, User, X, Filter, ChevronDown, Flame, Star, Sparkles, ShoppingCart, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Auth state
  const [activeAuthForm, setActiveAuthForm] = useState<"login" | "register" | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    productType: "",
    priceRange: [0, 100000],
    material: "",
    size: "",
    specialTags: [] as string[],
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const products = await apiGet<any[]>("/products");
      const filtered = products.filter((product) => 
        product.status === "Active" && (
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.material.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const navigateToProduct = (product: any) => {
    const slug = product.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    navigate(`/${slug}/sofa-detail`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const productTypes = ["All", "Luxury Sofas", "Arabian Majlis", "Luxury TV Stands"];
  const materials = ["All", "Leather", "Velvet", "Fabric", "Linen", "Suede"];
  const sizes = ["All", "2 Seater", "3 Seater", "L-Shape", "Full Majlis Set"];
  const specialTags = [
    { label: "On Discount 🔥", value: "discount" },
    { label: "Best Seller", value: "bestseller" },
    { label: "New Arrival", value: "new" },
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSpecialTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      specialTags: prev.specialTags.includes(tag)
        ? prev.specialTags.filter(t => t !== tag)
        : [...prev.specialTags, tag]
    }));
  };

  const applyFilters = () => {
    // Navigate to products page with filters
    const params = new URLSearchParams();
    if (filters.productType && filters.productType !== "All") {
      params.set("category", filters.productType);
    }
    if (filters.material && filters.material !== "All") {
      params.set("material", filters.material);
    }
    if (filters.size && filters.size !== "All") {
      params.set("size", filters.size);
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
      params.set("minPrice", filters.priceRange[0].toString());
      params.set("maxPrice", filters.priceRange[1].toString());
    }
    if (filters.specialTags.length > 0) {
      params.set("tags", filters.specialTags.join(","));
    }

    // Navigate to the unified products page with filters
    navigate(`/products?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-lg md:text-xl font-bold text-foreground tracking-wide leading-tight">
          Home Luxury<span className="text-primary"> Furniture</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/promotions" className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
            <Flame className="w-4 h-4" />
            Promotions
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 bg-background/90 border border-border/60 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 border border-border/60 rounded-lg shadow-xl backdrop-blur-md z-50 max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id || product._id}
                    onClick={() => navigateToProduct(product)}
                    className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b border-border/30 last:border-b-0"
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-xs">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="text-xs text-primary font-semibold">{product.discountPrice || product.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-primary/60 text-primary bg-primary/10 font-body font-semibold text-xs tracking-[0.1em] uppercase rounded hover:bg-primary/20 transition-colors"
            >
              <Filter className="w-3 h-3" />
              Filters
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-1 w-96 bg-background/95 border border-border/60 rounded-lg shadow-xl backdrop-blur-md z-50 p-4">
                <div className="space-y-4">
                  {/* Product Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Product Type</label>
                    <select
                      value={filters.productType}
                      onChange={(e) => handleFilterChange("productType", e.target.value)}
                      className="w-full p-2 bg-background/80 border border-border/60 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Material */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Material</label>
                    <select
                      value={filters.material}
                      onChange={(e) => handleFilterChange("material", e.target.value)}
                      className="w-full p-2 bg-background/80 border border-border/60 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Size</label>
                    <select
                      value={filters.size}
                      onChange={(e) => handleFilterChange("size", e.target.value)}
                      className="w-full p-2 bg-background/80 border border-border/60 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange("priceRange", [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                        className="flex-1 p-2 bg-background/80 border border-border/60 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange("priceRange", [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                        className="flex-1 p-2 bg-background/80 border border-border/60 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Special Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Special Tags</label>
                    <div className="space-y-1">
                      {specialTags.map(tag => (
                        <label key={tag.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.specialTags.includes(tag.value)}
                            onChange={() => handleSpecialTagToggle(tag.value)}
                            className="w-3 h-3 text-primary bg-background border-border rounded focus:ring-primary"
                          />
                          <span className="text-xs text-foreground flex items-center gap-1">
                            {tag.label === "On Discount 🔥" && <Flame className="w-3 h-3 text-red-500" />}
                            {tag.label === "Best Seller" && <Star className="w-3 h-3 text-yellow-500" />}
                            {tag.label === "New Arrival" && <Sparkles className="w-3 h-3 text-blue-500" />}
                            {tag.label.replace(/🔥/, "")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <button
                      onClick={() => {
                        setFilters({
                          productType: "",
                          priceRange: [0, 100000],
                          material: "",
                          size: "",
                          specialTags: [],
                        });
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear All
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-3 py-1 border border-border text-muted-foreground rounded text-xs hover:bg-background/60 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-gold-light transition-colors font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-1 px-3 py-1.5 border border-primary/60 text-primary bg-primary/10 font-body font-semibold text-xs tracking-[0.1em] uppercase rounded hover:bg-primary/20 transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary/60 text-primary bg-primary/10 font-body font-semibold text-xs tracking-[0.1em] uppercase rounded">
                  <User className="w-3 h-3" />
                  {user?.name}
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-muted-foreground font-body font-semibold text-xs tracking-[0.1em] uppercase rounded hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-primary/60 text-primary bg-primary/10 font-body font-semibold text-xs tracking-[0.1em] uppercase rounded hover:bg-primary/20 transition-colors"
                >
                  <User className="w-3 h-3" />
                  Login
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-muted-foreground font-body font-semibold text-xs tracking-[0.1em] uppercase rounded hover:bg-primary/10 hover:text-foreground transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* GitHub Link */}
          <a
            href="https://github.com/birukhabte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Visit GitHub profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <a
            href="tel:0995871152"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors rounded"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Now
          </a>
        </div>

        <a
          href="tel:0995871152"
          className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.1em] uppercase"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchResults(false)}
        />
      )}

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Auth Modal */}
      {activeAuthForm && (
        <div className="fixed top-20 right-4 z-50 w-80 rounded-xl border border-border bg-background/95 shadow-xl backdrop-blur-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {activeAuthForm === "login" ? "Login" : "Register"}
            </h2>
            <button
              type="button"
              onClick={() => setActiveAuthForm(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
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
                    passwordHash: password,
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
                  const user: any = await apiPost("/users/login", {
                    email,
                    password,
                  });
                  setMessage(`Welcome back, ${user.name || "guest"}.`);
                  setPassword("");

                  if (user.role === "admin") {
                    navigate("/admin");
                    setActiveAuthForm(null);
                  }
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
    </nav>
  );
};

export default Navbar;// Commit 5 - 2024-05-02 05:47:00
// Commit 7 - 2024-05-05 20:13:00
// Commit 30 - 2024-05-16 14:11:00
// Commit 35 - 2024-05-19 22:05:00
// Commit 38 - 2024-05-20 14:09:00
// Commit 46 - 2024-05-23 07:15:00
// Commit 52 - 2024-05-25 17:00:00
