import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  date: string;
  status: "New" | "In Progress" | "Responded" | "Closed";
}

const initialInquiries: Inquiry[] = [
];

const statusConfig: Record<string, { className: string; icon: typeof Clock }> = {
  New: { className: "bg-primary/20 text-primary border-primary/30", icon: Clock },
  "In Progress": { className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  Responded: { className: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  Closed: { className: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    apiGet<Inquiry[]>("/inquiries")
      .then(setInquiries)
      .catch((error) => {
        console.error("Failed to load inquiries", error);
      });
  }, []);

  const filtered = inquiries.filter((inq) => {
    const matchSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || inq.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    try {
      const updated = await apiPatch<Inquiry, { status: Inquiry["status"] }>(`/inquiries/${id}/status`, { status });
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
      if (viewInquiry?.id === id) setViewInquiry(updated);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const newCount = inquiries.filter((i) => i.status === "New").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Customer Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {newCount} new {newCount === 1 ? "inquiry" : "inquiries"} awaiting response
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "New", "In Progress", "Responded", "Closed"].map((st) => (
                <Button key={st} variant={statusFilter === st ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(st)} className="text-xs">
                  {st}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inq) => (
                <TableRow key={inq.id} className="border-border">
                  <TableCell className="font-mono text-xs text-muted-foreground">{inq.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{inq.name}</p>
                      <p className="text-xs text-muted-foreground">{inq.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inq.product}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inq.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[inq.status].className}>
                      {inq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setViewInquiry(inq)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No inquiries found</p>}
        </CardContent>
      </Card>

      {/* View Inquiry Dialog */}
      <Dialog open={!!viewInquiry} onOpenChange={() => setViewInquiry(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Inquiry {viewInquiry?.id}</DialogTitle>
          </DialogHeader>
          {viewInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-foreground font-medium">{viewInquiry.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-foreground">{viewInquiry.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="text-foreground">{viewInquiry.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Product</p>
                  <p className="text-foreground">{viewInquiry.product}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Message</p>
                <p className="text-foreground text-sm bg-secondary p-3 rounded-md">{viewInquiry.message}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {(["New", "In Progress", "Responded", "Closed"] as const).map((st) => (
                    <Button
                      key={st}
                      variant={viewInquiry.status === st ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateStatus(viewInquiry.id, st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inquiries;
