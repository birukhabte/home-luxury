import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, Clock, XCircle } from "lucide-react";

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
  { id: "INQ-001", name: "Ahmed Al-Rashid", email: "ahmed@email.com", phone: "+966 50 123 4567", product: "The Sovereign Sofa", message: "I'm interested in customizing the Sovereign in a lighter shade of ivory. Do you offer fabric samples?", date: "2026-04-05", status: "New" },
  { id: "INQ-002", name: "Fatima Hassan", email: "fatima@email.com", phone: "+966 55 234 5678", product: "Grand Heritage Majlis", message: "Looking for a full majlis setup for a new villa. Can you arrange a showroom visit?", date: "2026-04-04", status: "In Progress" },
  { id: "INQ-003", name: "Mohammed Ali", email: "mohammed@email.com", phone: "+966 54 345 6789", product: "The Midnight Royal", message: "What are the dimensions? I have a specific space of 4m x 3m.", date: "2026-04-03", status: "Responded" },
  { id: "INQ-004", name: "Sara Ibrahim", email: "sara@email.com", phone: "+966 56 456 7890", product: "Azure Majesty Majlis", message: "Do you deliver to Jeddah? What's the estimated delivery time?", date: "2026-04-02", status: "Responded" },
  { id: "INQ-005", name: "Khalid Omar", email: "khalid@email.com", phone: "+966 53 567 8901", product: "The Emerald Divan", message: "Is this available in a modular configuration? I need an L-shaped version.", date: "2026-04-01", status: "New" },
  { id: "INQ-006", name: "Noura Al-Saud", email: "noura@email.com", phone: "+966 51 678 9012", product: "Imperial Ivory Majlis", message: "Interested in bulk pricing for a hospitality project - 8 majlis sets.", date: "2026-03-30", status: "In Progress" },
  { id: "INQ-007", name: "Omar Fahad", email: "omar@email.com", phone: "+966 52 789 0123", product: "The Bordeaux", message: "Can I get a warranty certificate? Also interested in matching coffee table.", date: "2026-03-28", status: "Closed" },
  { id: "INQ-008", name: "Layla Ahmed", email: "layla@email.com", phone: "+966 57 890 1234", product: "Royal Amethyst Majlis", message: "Beautiful design! What's the lead time for custom colors?", date: "2026-03-27", status: "New" },
];

const statusConfig: Record<string, { className: string; icon: typeof Clock }> = {
  New: { className: "bg-primary/20 text-primary border-primary/30", icon: Clock },
  "In Progress": { className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  Responded: { className: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  Closed: { className: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    const matchSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || inq.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Inquiry["status"]) => {
    setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    if (viewInquiry?.id === id) setViewInquiry({ ...viewInquiry, status });
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
