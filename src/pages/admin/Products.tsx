import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from "@/lib/api";

type Category = "Luxury Sofas" | "Arabian Majlis" | "Luxury TV Stands";
type Status = "Active" | "Draft" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  originalPrice?: string;
  discountPrice?: string;
  material: string;
  status: Status;
  imageUrl?: string;
  imageUrls?: string[];
}

const initialProducts: Product[] = [];

const CATEGORIES: Category[] = ["Luxury Sofas", "Arabian Majlis", "Luxury TV Stands"];
const STATUSES: Status[] = ["Active", "Draft", "Out of Stock"];

// Helper function to validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

const statusBadge: Record<Status, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
};

const emptyForm = {
  name: "",
  category: "Luxury TV Stands" as Category,
  material: "",
  price: "",
  originalPrice: "",
  discountPrice: "",
  status: "Active" as Status,
  imageUrl: "",
  imageUrls: [] as string[],
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [deleteDialog, setDeleteDialog] = useState<Product | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiGet<any[]>("/products")
      .then((data) => {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          discountPrice: p.discountPrice,
          material: p.material,
          status: p.status,
          imageUrl: p.imageUrl,
          imageUrls: p.imageUrls || [],
        }));
        setProducts(mapped);
      })
      .catch((error) => {
        console.error("Failed to load products", error);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.material.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await apiDelete(`/products/${deleteDialog.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteDialog.id));
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleteDialog(null);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditDialog(null);
    setAddDialog(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      material: p.material,
      price: p.price,
      originalPrice: p.originalPrice || "",
      discountPrice: p.discountPrice || "",
      status: p.status,
      imageUrl: p.imageUrl || "",
      imageUrls: p.imageUrls || [],
    });
    setAddDialog(false);
    setEditDialog(p);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.material.trim() || !form.originalPrice.trim()) return;
    
    // Validate that at least one image is provided
    const hasValidPrimaryImage = form.imageUrl && isValidUrl(form.imageUrl);
    const hasValidAdditionalImages = form.imageUrls?.some(url => url.trim() !== "" && isValidUrl(url));
    
    if (!hasValidPrimaryImage && !hasValidAdditionalImages) {
      alert("Please provide at least one valid image URL.");
      return;
    }
    
    // Use originalPrice as the canonical price; include discountPrice if set
    const payload = {
      ...form,
      price: form.originalPrice,
      originalPrice: form.originalPrice,
      discountPrice: form.discountPrice || undefined,
      // Clean up imageUrls to remove empty strings
      imageUrls: form.imageUrls?.filter(url => url.trim() !== "" && isValidUrl(url)) || [],
    };
    try {
      const createdRaw = await apiPost<any, Omit<Product, "id">>("/products", payload as Omit<Product, "id">);
      const created: Product = {
        id: createdRaw.id || createdRaw._id,
        name: createdRaw.name,
        category: createdRaw.category,
        price: createdRaw.price,
        originalPrice: createdRaw.originalPrice,
        discountPrice: createdRaw.discountPrice,
        material: createdRaw.material,
        status: createdRaw.status,
        imageUrl: createdRaw.imageUrl,
        imageUrls: createdRaw.imageUrls || [],
      };
      setProducts((prev) => [...prev, created]);
      setAddDialog(false);
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const handleEdit = async () => {
    if (!editDialog || !form.name.trim()) return;
    
    // Validate that at least one image is provided
    const hasValidPrimaryImage = form.imageUrl && isValidUrl(form.imageUrl);
    const hasValidAdditionalImages = form.imageUrls?.some(url => url.trim() !== "" && isValidUrl(url));
    
    if (!hasValidPrimaryImage && !hasValidAdditionalImages) {
      alert("Please provide at least one valid image URL.");
      return;
    }
    
    const payload = {
      ...form,
      price: form.originalPrice || form.price,
      originalPrice: form.originalPrice,
      discountPrice: form.discountPrice || undefined,
      // Clean up imageUrls to remove empty strings
      imageUrls: form.imageUrls?.filter(url => url.trim() !== "" && isValidUrl(url)) || [],
    };
    try {
      const updatedRaw = await apiPut<any, Omit<Product, "id">>(`/products/${editDialog.id}`, payload as Omit<Product, "id">);
      const updated: Product = {
        id: updatedRaw.id || updatedRaw._id,
        name: updatedRaw.name,
        category: updatedRaw.category,
        price: updatedRaw.price,
        originalPrice: updatedRaw.originalPrice,
        discountPrice: updatedRaw.discountPrice,
        material: updatedRaw.material,
        status: updatedRaw.status,
        imageUrl: updatedRaw.imageUrl,
        imageUrls: updatedRaw.imageUrls || [],
      };
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditDialog(null);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const discountPct = (() => {
    const orig = parseFloat((form.originalPrice || "").replace(/[^0-9.]/g, ""));
    const disc = parseFloat((form.discountPrice || "").replace(/[^0-9.]/g, ""));
    if (!orig || !disc || disc >= orig) return null;
    return Math.round(((orig - disc) / orig) * 100);
  })();

  const renderProductForm = () => (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="prod-name">Product Name</Label>
        <Input id="prod-name" placeholder="e.g. The Royal Console" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" />
      </div>
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="prod-material">Material</Label>
        <Input id="prod-material" placeholder="e.g. Walnut & Brass" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="bg-secondary border-border" />
      </div>

      {/* ── Pricing Information ── */}
      <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Pricing Information</p>
        <div className="space-y-1.5">
          <Label htmlFor="prod-orig-price">Original Price <span className="text-destructive">*</span></Label>
          <Input
            id="prod-orig-price"
            placeholder="e.g. 95,000 ETB"
            value={form.originalPrice}
            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            className="bg-secondary border-border"
          />
          <p className="text-[11px] text-muted-foreground">Full retail price before any discount.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prod-disc-price">Discount Price <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="prod-disc-price"
            placeholder="e.g. 72,000 ETB"
            value={form.discountPrice}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>
        {/* Auto-calculated discount percentage */}
        <div className="flex items-center gap-2">
          <p className="text-[11px] text-muted-foreground">Discount Percentage (auto-calculated):</p>
          {discountPct !== null ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold">
              – {discountPct}% OFF
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground italic">Enter both prices to calculate</span>
          )}
        </div>
      </div>
      
      {/* ── Image Management ── */}
      <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Image Management</p>
        
        {/* Primary Image URL */}
        <div className="space-y-1.5">
          <Label htmlFor="prod-primary-image">Primary Image URL</Label>
          <Input
            id="prod-primary-image"
            placeholder="https://example.com/image1.jpg"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className={`bg-secondary border-border ${
              form.imageUrl && !isValidUrl(form.imageUrl) ? 'border-red-400' : ''
            }`}
          />
          {form.imageUrl && !isValidUrl(form.imageUrl) && (
            <p className="text-[11px] text-red-400">Please enter a valid URL starting with http:// or https://</p>
          )}
          <p className="text-[11px] text-muted-foreground">Main product image (will be used as thumbnail)</p>
        </div>

        {/* Additional Image URLs */}
        <div className="space-y-2">
          <Label>Additional Images (up to 4 more)</Label>
          {Array.from({ length: 4 }).map((_, index) => {
            const currentUrls = form.imageUrls || [];
            const value = currentUrls[index] || "";
            
            return (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`https://example.com/image${index + 2}.jpg`}
                  value={value}
                  onChange={(e) => {
                    const newUrls = [...currentUrls];
                    if (e.target.value.trim() === "") {
                      // Remove empty URLs and compact array
                      newUrls.splice(index, 1);
                    } else {
                      // Set or update URL at index
                      newUrls[index] = e.target.value;
                    }
                    // Remove any empty strings and keep only valid URLs
                    const cleanUrls = newUrls.filter(url => url && url.trim() !== "");
                    setForm({ ...form, imageUrls: cleanUrls });
                  }}
                  className={`bg-secondary border-border flex-1 ${
                    value && !isValidUrl(value) ? 'border-red-400' : ''
                  }`}
                />
                {value && !isValidUrl(value) && (
                  <span className="text-[10px] text-red-400 whitespace-nowrap">Invalid URL</span>
                )}
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = [...currentUrls];
                      newUrls.splice(index, 1);
                      setForm({ ...form, imageUrls: newUrls });
                    }}
                    className="px-2 py-1 text-xs text-red-400 hover:text-red-300 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
          <p className="text-[11px] text-muted-foreground">
            Total images: {1 + (form.imageUrls?.filter(url => url.trim() !== "").length || 0)} / 5
          </p>
        </div>

        {/* Image Preview */}
        {(form.imageUrl || (form.imageUrls && form.imageUrls.length > 0)) && (
          <div className="border-t border-border/40 pt-3">
            <Label className="text-xs">Image Preview</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.imageUrl && (
                <div className="relative group">
                  <img
                    src={form.imageUrl}
                    alt="Primary"
                    className="w-16 h-16 object-cover rounded border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </div>
                </div>
              )}
              {form.imageUrls?.filter(url => url.trim() !== "").map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Additional ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute -top-1 -left-1 bg-secondary text-foreground text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-border">
                    {index + 2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Alternative */}
        <div className="border-t border-border/40 pt-3">
          <Label htmlFor="prod-images-upload">Or Upload Images (max 5 total)</Label>
          <Input
            id="prod-images-upload"
            type="file"
            multiple
            accept="image/*"
            className="bg-secondary border-border mt-1"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files) return;
              
              const currentTotal = 1 + (form.imageUrls?.filter(url => url.trim() !== "").length || 0);
              const remaining = 5 - currentTotal;
              if (remaining <= 0) return;

              const selected = Array.from(files).slice(0, remaining);
              if (selected.length === 0) return;

              const data = new FormData();
              selected.forEach((file) => data.append("files", file));

              try {
                const res = await apiUpload<{ urls: string[] }>("/products/upload-images", data);
                const newUrls = res.urls || [];
                setForm((prev) => ({
                  ...prev,
                  imageUrls: [...(prev.imageUrls || []).filter(url => url.trim() !== ""), ...newUrls].slice(0, 4),
                }));
              } catch (err) {
                console.error("Failed to upload images", err);
              } finally {
                e.target.value = "";
              }
            }}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Upload files to automatically populate image URLs
          </p>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your furniture catalog</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...CATEGORIES].map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Image</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Material</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const thumb = product.imageUrl || product.imageUrls?.[0];
                return (
                  <TableRow key={product.id} className="border-border">
                    <TableCell className="w-[72px]">
                      {thumb ? (
                        <div className="relative">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover border border-border"
                          />
                          {/* Show image count if there are multiple images */}
                          {((product.imageUrls?.filter(url => url.trim() !== "").length || 0) > 0) && (
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {1 + (product.imageUrls?.filter(url => url.trim() !== "").length || 0)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{product.category}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{product.material}</TableCell>
                    <TableCell className="text-foreground font-semibold">{product.price}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[product.status]}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(product)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteDialog(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No products found</p>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Product</DialogTitle>
          </DialogHeader>
          {addDialog && renderProductForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Product</DialogTitle>
          </DialogHeader>
          {editDialog && renderProductForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong className="text-foreground">{deleteDialog?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
