import { useState } from "react";
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

interface Promotion {
  id: string;
  name: string;
  category: "Luxury Sofas" | "Arabian Majlis";
  originalPrice: string;
  salePrice: string;
  discount: string;
  description: string;
  link: string;
  status: "Active" | "Draft" | "Expired";
}

const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Royal Chesterfield Sofa",
    category: "Luxury Sofas",
    originalPrice: "ETB 185,000",
    salePrice: "ETB 148,000",
    discount: "20%",
    description: "Hand-tufted genuine leather with solid hardwood frame — timeless British elegance.",
    link: "/luxury-sofas",
    status: "Active",
  },
  {
    id: "2",
    name: "The Grand Heritage Majlis",
    category: "Arabian Majlis",
    originalPrice: "ETB 220,000",
    salePrice: "ETB 165,000",
    discount: "25%",
    description: "Full majlis set with hand-embroidered cushions and ornate gold trim.",
    link: "/arabian-majlis",
    status: "Active",
  },
  {
    id: "3",
    name: "Milano Sectional L-Shape",
    category: "Luxury Sofas",
    originalPrice: "ETB 160,000",
    salePrice: "ETB 128,000",
    discount: "20%",
    description: "Italian-inspired modular sectional in premium velvet — seats up to 8 guests.",
    link: "/luxury-sofas",
    status: "Active",
  },
  {
    id: "4",
    name: "Azure Majesty Set",
    category: "Arabian Majlis",
    originalPrice: "ETB 195,000",
    salePrice: "ETB 136,500",
    discount: "30%",
    description: "Royal blue majlis with silver accents and plush floor seating for 12.",
    link: "/arabian-majlis",
    status: "Active",
  },
];

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
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState<Promotion | null>(null);
  const [formDialog, setFormDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Omit<Promotion, "id">>(emptyPromo);

  const filtered = promotions.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = () => {
    if (deleteDialog) {
      setPromotions(promotions.filter((p) => p.id !== deleteDialog.id));
      setDeleteDialog(null);
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

  const handleSave = () => {
    if (!form.name || !form.originalPrice || !form.salePrice || !form.discount) return;
    if (editingPromo) {
      setPromotions(promotions.map((p) => (p.id === editingPromo.id ? { ...form, id: editingPromo.id } : p)));
    } else {
      setPromotions([...promotions, { ...form, id: Date.now().toString() }]);
    }
    setFormDialog(false);
    setForm(emptyPromo);
    setEditingPromo(null);
  };

  const updateForm = (key: keyof Omit<Promotion, "id">, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "category" ? { link: value === "Arabian Majlis" ? "/arabian-majlis" : "/luxury-sofas" } : {}),
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
              {filtered.map((promo) => (
                <TableRow key={promo.id} className="border-border">
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
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No promotions found</p>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formDialog} onOpenChange={setFormDialog}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
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
