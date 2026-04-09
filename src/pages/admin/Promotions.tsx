import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Tag } from "lucide-react";
import { apiDelete, apiGet, apiPost, apiPut, apiUpload } from "@/lib/api";

interface Promotion {
  id: string;
  name: string;
  category:
    | "Luxury Sofas"
    | "Arabian Majlis"
    | "Luxury TV Stands"
    | "Dining Sets"
    | "Bedroom Sets";
  originalPrice: string;
  salePrice: string;
  discount: string;
  description: string;
  link: string;
  status: "Active" | "Draft" | "Expired";
  imageUrls?: string[];
  expiryDate?: string;
}
// Normalize backend promotion document into the admin UI shape
function normalizePromotion(promo: any): Promotion {
  const id = promo.id || promo._id || "";
  const name = promo.name || promo.title || "";
  const category: Promotion["category"] = promo.category || "Luxury Sofas";
  const discountFromNumber =
    promo.discountPercentage !== undefined && promo.discountPercentage !== null
      ? `${promo.discountPercentage}%`
      : "";

  const discount: string = promo.discount || discountFromNumber || "";

  const linkFromCategory =
    category === "Arabian Majlis"
      ? "/arabian-majlis"
      : category === "Luxury TV Stands"
      ? "/luxury-tv-stands"
      : category === "Luxury Sofas"
      ? "/luxury-sofas"
      : "#collections";

  const link: string = promo.link || linkFromCategory;

  const isActive: boolean =
    typeof promo.isActive === "boolean" ? promo.isActive : promo.status === "Active";

  const status: Promotion["status"] =
    promo.status && ["Active", "Draft", "Expired"].includes(promo.status)
      ? promo.status
      : isActive
      ? "Active"
      : "Draft";

  const imageUrls: string[] = promo.imageUrls && Array.isArray(promo.imageUrls)
    ? promo.imageUrls
    : promo.imageUrl
    ? [promo.imageUrl]
    : [];

  let expiryDate = "";
  const rawEndDate = promo.endDate || promo.expiryDate;
  if (rawEndDate) {
    const d = new Date(rawEndDate);
    if (!isNaN(d.getTime())) {
      expiryDate = d.toISOString().slice(0, 10);
    }
  }

  return {
    id,
    name,
    category,
    originalPrice: promo.originalPrice || "",
    salePrice: promo.salePrice || "",
    discount,
    description: promo.description || "",
    link,
    status,
    imageUrls,
    expiryDate,
  };
}

const statusBadge: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Expired: "bg-red-500/20 text-red-400 border-red-500/30",
};

const emptyPromo: Omit<Promotion, "id"> = {
  name: "",
  category: "Luxury Sofas",
  originalPrice: "",
  salePrice: "",
  discount: "",
  description: "",
  link: "/luxury-sofas",
  status: "Draft",
  imageUrls: [],
  expiryDate: "",
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState<Promotion | null>(null);
  const [formDialog, setFormDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Omit<Promotion, "id">>(emptyPromo);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Load promotions from backend
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<any[]>("/promotions");
        const normalized = (data || []).map(normalizePromotion);
        setPromotions(normalized);
      } catch (err) {
        console.error("Failed to load promotions", err);
      }
    })();
  }, []);

  const filtered = promotions.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = () => {
    if (deleteDialog) {
      const toDelete = deleteDialog;
      (async () => {
        try {
          await apiDelete(`/promotions/${toDelete.id}`);
          setPromotions((prev) => prev.filter((p) => p.id !== toDelete.id));
        } catch (err) {
          console.error("Failed to delete promotion", err);
        } finally {
          setDeleteDialog(null);
        }
      })();
    }
  };

  const openCreateDialog = () => {
    setEditingPromo(null);
    setForm(emptyPromo);
    setFormDialog(true);
  };

  const openEditDialog = (promo: Promotion) => {
    setEditingPromo(promo);
    const { id, ...rest } = promo;
    setForm(rest);
    setFormDialog(true);
  };

  const buildPayloadFromForm = (f: Omit<Promotion, "id">) => {
    const percent = parseFloat(f.discount.replace("%", "").trim());
    return {
      // Primary fields used by UI
      name: f.name,
      category: f.category,
      originalPrice: f.originalPrice,
      salePrice: f.salePrice,
      discount: f.discount,
      description: f.description,
      link: f.link,
      status: f.status,
      imageUrls: f.imageUrls || [],
      endDate: f.expiryDate ? new Date(f.expiryDate).toISOString() : undefined,
      // Legacy-compatible fields for backend
      title: f.name,
      discountPercentage: !isNaN(percent) ? percent : undefined,
      isActive: f.status === "Active",
    };
  };

  const handleSave = async () => {
    if (!form.name || !form.originalPrice || !form.salePrice || !form.discount) return;

    const payload = buildPayloadFromForm(form);

    try {
      if (editingPromo) {
        const updated = await apiPut<any, any>(`/promotions/${editingPromo.id}`, payload);
        const normalized = normalizePromotion(updated);
        setPromotions((prev) => prev.map((p) => (p.id === editingPromo.id ? normalized : p)));
      } else {
        const created = await apiPost<any, any>("/promotions", payload);
        const normalized = normalizePromotion(created);
        setPromotions((prev) => [...prev, normalized]);
      }
      setFormDialog(false);
      setForm(emptyPromo);
      setEditingPromo(null);
    } catch (err) {
      console.error("Failed to save promotion", err);
    }
  };

  const updateForm = (key: keyof Omit<Promotion, "id">, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "category"
        ? {
            link:
              value === "Arabian Majlis"
                ? "/arabian-majlis"
                : value === "Luxury Sofas"
                ? "/luxury-sofas"
                : value === "Luxury TV Stands"
                ? "/luxury-tv-stands"
                : "#collections",
          }
        : {}),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Promotions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage exclusive deals shown on the homepage</p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search promotions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Active", "Draft", "Expired"].map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(s)}
                  className="text-xs"
                >
                  {s}
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
                <TableHead className="text-muted-foreground">Deal Name</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Original Price</TableHead>
                <TableHead className="text-muted-foreground">Sale Price</TableHead>
                <TableHead className="text-muted-foreground">Discount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((promo) => {
                const thumb = promo.imageUrls && promo.imageUrls.length > 0 ? promo.imageUrls[0] : undefined;
                return (
                  <TableRow key={promo.id} className="border-border">
                    <TableCell className="w-[72px]">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={promo.name}
                          className="h-12 w-12 rounded-md object-cover border border-border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{promo.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{promo.category}</TableCell>
                    <TableCell className="text-muted-foreground text-sm line-through">{promo.originalPrice}</TableCell>
                    <TableCell className="text-foreground font-semibold">{promo.salePrice}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                        {promo.discount} OFF
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[promo.status]}>
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditDialog(promo)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteDialog(promo)}
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
            <p className="text-center text-muted-foreground py-8 text-sm">No promotions found</p>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formDialog} onOpenChange={setFormDialog}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingPromo ? "Edit Promotion" : "New Promotion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Deal Name</Label>
              <Input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="e.g. Royal Chesterfield Sofa" className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => updateForm("category", v)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Luxury Sofas">Luxury Sofas</SelectItem>
                    <SelectItem value="Arabian Majlis">Arabian Majlis</SelectItem>
                    <SelectItem value="Luxury TV Stands">Luxury TV Stands</SelectItem>
                    <SelectItem value="Dining Sets">Dining Sets</SelectItem>
                    <SelectItem value="Bedroom Sets">Bedroom Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateForm("status", v)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expire Date</Label>
                <Input
                  type="date"
                  value={form.expiryDate || ""}
                  onChange={(e) => updateForm("expiryDate", e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input value={form.originalPrice} onChange={(e) => updateForm("originalPrice", e.target.value)} placeholder="ETB 185,000" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input value={form.salePrice} onChange={(e) => updateForm("salePrice", e.target.value)} placeholder="ETB 148,000" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input value={form.discount} onChange={(e) => updateForm("discount", e.target.value)} placeholder="20%" className="bg-secondary border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Brief description of the deal..." className="bg-secondary border-border resize-none" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-images">Upload Images (max 3)</Label>
              <Input
                id="promo-images"
                type="file"
                multiple
                accept="image/*"
                className="bg-secondary border-border"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files) return;
                  const remaining = 3 - (form.imageUrls?.length || 0);
                  if (remaining <= 0) return;

                  const selected = Array.from(files).slice(0, remaining);
                  if (selected.length === 0) return;

                  const data = new FormData();
                  selected.forEach((file) => data.append("files", file));

                  try {
                    const res = await apiUpload<{ urls: string[] }>("/promotions/upload-images", data);
                    setForm((prev) => ({
                      ...prev,
                      imageUrls: [...(prev.imageUrls || []), ...(res.urls || [])].slice(0, 3),
                    }));
                  } catch (err) {
                    console.error("Failed to upload promotion images", err);
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
              {form.imageUrls && form.imageUrls.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  {form.imageUrls.length} image{form.imageUrls.length > 1 ? "s" : ""} attached.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Add Image by URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="bg-secondary border-border flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = imageUrlInput.trim();
                    if (!url) return;
                    if ((form.imageUrls?.length || 0) >= 3) return;
                    setForm((prev) => ({
                      ...prev,
                      imageUrls: [...(prev.imageUrls || []), url].slice(0, 3),
                    }));
                    setImageUrlInput("");
                  }}
                >
                  Add
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                You can paste direct image URLs (including Cloudinary) here. Up to 3 images total.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPromo ? "Save Changes" : "Create Promotion"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Promotion</DialogTitle>
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

export default Promotions;
