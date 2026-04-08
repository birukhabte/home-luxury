import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/lib/api";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  productId?: string;
  quantity: number;
  totalAmount: number;
  notes?: string;
  paymentMethod: "chapa" | "bank";
  createdAt: string;
}

const paymentLabels: Record<Order["paymentMethod"], string> = {
  chapa: "Chapa (Online)",
  bank: "Bank Transfer",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiGet<Order[]>("/orders")
      .then(setOrders)
      .catch((error) => {
        console.error("Failed to load orders", error);
      });
  }, []);

  const filtered = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.productName.toLowerCase().includes(q) ||
      order.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View recent sofa and majlis orders placed from the site.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-display text-foreground">Order List</CardTitle>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search by customer, product, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary border-border pr-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Qty</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Payment</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} className="border-border">
                  <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.productName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.quantity}</TableCell>
                  <TableCell className="text-sm font-semibold text-foreground">
                    ETB {order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {paymentLabels[order.paymentMethod]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">
              {orders.length === 0
                ? "No orders have been placed yet."
                : "No orders match your search."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
