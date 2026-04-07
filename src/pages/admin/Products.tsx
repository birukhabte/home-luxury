import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "Luxury Sofas" | "Arabian Majlis";
  price: string;
  material: string;
  status: "Active" | "Draft" | "Out of Stock";
}

const initialProducts: Product[] = [
  { id: "1", name: "The Sovereign", category: "Luxury Sofas", price: "SAR 45,000", material: "Italian Leather", status: "Active" },
  { id: "2", name: "The Midnight Royal", category: "Luxury Sofas", price: "SAR 38,500", material: "Navy Velvet", status: "Active" },
  { id: "3", name: "The Ivory Cloud", category: "Luxury Sofas", price: "SAR 42,000", material: "Cream Leather", status: "Active" },
  { id: "4", name: "The Emerald Divan", category: "Luxury Sofas", price: "SAR 32,000", material: "Emerald Velvet", status: "Draft" },
  { id: "5", name: "The Bordeaux", category: "Luxury Sofas", price: "SAR 36,000", material: "Burgundy Velvet", status: "Active" },
  { id: "6", name: "The Charcoal Elite", category: "Luxury Sofas", price: "SAR 35,000", material: "Charcoal Bouclé", status: "Active" },
  { id: "7", name: "The Sahara", category: "Luxury Sofas", price: "SAR 33,000", material: "Camel Suede", status: "Out of Stock" },
  { id: "8", name: "Grand Heritage Majlis", category: "Arabian Majlis", price: "SAR 78,000", material: "Burgundy & Gold Silk", status: "Active" },
  { id: "9", name: "Azure Majesty", category: "Arabian Majlis", price: "SAR 62,000", material: "Royal Blue Velvet", status: "Active" },
  { id: "10", name: "Imperial Ivory", category: "Arabian Majlis", price: "SAR 85,000", material: "Cream & Gold Damask", status: "Active" },
  { id: "11", name: "Emerald Oasis", category: "Arabian Majlis", price: "SAR 68,000", material: "Emerald Silk", status: "Draft" },
  { id: "12", name: "Royal Amethyst", category: "Arabian Majlis", price: "SAR 72,000", material: "Deep Purple Velvet", status: "Active" },
  { id: "13", name: "Desert Rose", category: "Arabian Majlis", price: "SAR 58,000", material: "Brown & Bronze Leather", status: "Active" },
  { id: "14", name: "The Sultan's Court", category: "Arabian Majlis", price: "SAR 92,000", material: "Gold Brocade", status: "Active" },
];

const statusBadge: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [deleteDialog, setDeleteDialog] = useState<Product | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your furniture catalog</p>
        </div>
        <Button className="gap-2">
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
            <div className="flex gap-2">
              {["All", "Luxury Sofas", "Arabian Majlis"].map((cat) => (
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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
