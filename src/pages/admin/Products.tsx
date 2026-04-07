import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

type Category = "Luxury Sofas" | "Arabian Majlis" | "Luxury TV Stands";
type Status = "Active" | "Draft" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  material: string;
  status: Status;
}

const initialProducts: Product[] = [
  { id: "1", name: "The Sovereign", category: "Luxury Sofas", price: "ETB 185,000", material: "Italian Leather", status: "Active" },
  { id: "2", name: "The Midnight Royal", category: "Luxury Sofas", price: "ETB 148,000", material: "Navy Velvet", status: "Active" },
  { id: "3", name: "The Ivory Cloud", category: "Luxury Sofas", price: "ETB 162,000", material: "Cream Leather", status: "Active" },
  { id: "4", name: "The Emerald Divan", category: "Luxury Sofas", price: "ETB 128,000", material: "Emerald Velvet", status: "Draft" },
  { id: "5", name: "The Bordeaux", category: "Luxury Sofas", price: "ETB 136,000", material: "Burgundy Velvet", status: "Active" },
  { id: "6", name: "The Charcoal Elite", category: "Luxury Sofas", price: "ETB 135,000", material: "Charcoal Bouclé", status: "Active" },
  { id: "7", name: "The Sahara", category: "Luxury Sofas", price: "ETB 133,000", material: "Camel Suede", status: "Out of Stock" },
  { id: "8", name: "Grand Heritage Majlis", category: "Arabian Majlis", price: "ETB 220,000", material: "Burgundy & Gold Silk", status: "Active" },
  { id: "9", name: "Azure Majesty", category: "Arabian Majlis", price: "ETB 195,000", material: "Royal Blue Velvet", status: "Active" },
  { id: "10", name: "Imperial Ivory", category: "Arabian Majlis", price: "ETB 250,000", material: "Cream & Gold Damask", status: "Active" },
  { id: "11", name: "Emerald Oasis", category: "Arabian Majlis", price: "ETB 210,000", material: "Emerald Silk", status: "Draft" },
  { id: "12", name: "Royal Amethyst", category: "Arabian Majlis", price: "ETB 225,000", material: "Deep Purple Velvet", status: "Active" },
  { id: "13", name: "Desert Rose", category: "Arabian Majlis", price: "ETB 180,000", material: "Brown & Bronze Leather", status: "Active" },
  { id: "14", name: "The Sultan's Court", category: "Arabian Majlis", price: "ETB 280,000", material: "Gold Brocade", status: "Active" },
  { id: "15", name: "The Imperial Console", category: "Luxury TV Stands", price: "ETB 95,000", material: "Walnut & Brass", status: "Active" },
  { id: "16", name: "The Monarch Stand", category: "Luxury TV Stands", price: "ETB 88,000", material: "Oak & Gold Accents", status: "Active" },
  { id: "17", name: "The Prestige Unit", category: "Luxury TV Stands", price: "ETB 112,000", material: "Marble & Steel", status: "Active" },
  { id: "18", name: "The Regal Cabinet", category: "Luxury TV Stands", price: "ETB 105,000", material: "Mahogany & Bronze", status: "Draft" },
  { id: "19", name: "The Executive Media Center", category: "Luxury TV Stands", price: "ETB 98,000", material: "Ebony & Chrome", status: "Active" },
  { id: "20", name: "The Grand Entertainment Unit", category: "Luxury TV Stands", price: "ETB 135,000", material: "Teak & Gold Leaf", status: "Out of Stock" },
];

const CATEGORIES: Category[] = ["Luxury Sofas", "Arabian Majlis", "Luxury TV Stands"];
const STATUSES: Status[] = ["Active", "Draft", "Out of Stock"];

const statusBadge: Record<Status, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
};

const emptyForm = { name: "", category: "Luxury TV Stands" as Category, material: "", price: "", status: "Active" as Status };

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [deleteDialog, setDeleteDialog] = useState<Product | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.material.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = () => {
    if (deleteDialog) {
      setProducts(products.filter((p) => p.id !== deleteDialog.id));
      setDeleteDialog(null);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setAddDialog(true);
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, material: p.material, price: p.price, status: p.status });
    setEditDialog(p);
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.material.trim() || !form.price.trim()) return;
    const newId = String(Date.now());
    setProducts([...products, { id: newId, ...form }]);
    setAddDialog(false);
  };

  const handleEdit = () => {
    if (!editDialog || !form.name.trim()) return;
    setProducts(products.map((p) => p.id === editDialog.id ? { ...p, ...form } : p));
    setEditDialog(null);
  };

  const ProductForm = () => (
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
      <div className="space-y-1.5">
        <Label htmlFor="prod-price">Price</Label>
        <Input id="prod-price" placeholder="e.g. ETB 95,000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-secondary border-border" />
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
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Material</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id} className="border-border">
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
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No products found</p>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm />
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
