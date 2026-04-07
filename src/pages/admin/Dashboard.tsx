import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, MessageSquare, TrendingUp, Eye, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stats = [
  { title: "Total Revenue", value: "SAR 847,500", change: "+12.5%", icon: DollarSign },
  { title: "Products Listed", value: "20", change: "+6", icon: Package },
  { title: "New Inquiries", value: "28", change: "+8", icon: MessageSquare },
  { title: "Conversion Rate", value: "4.2%", change: "+0.8%", icon: TrendingUp },
  { title: "Page Views", value: "12,480", change: "+18%", icon: Eye },
  { title: "Orders This Month", value: "23", change: "+5", icon: ShoppingCart },
];

const revenueData = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 58000 },
  { month: "Apr", revenue: 89000 },
  { month: "May", revenue: 95000 },
  { month: "Jun", revenue: 110000 },
  { month: "Jul", revenue: 98000 },
  { month: "Aug", revenue: 125000 },
  { month: "Sep", revenue: 135000 },
];

const categoryData = [
  { name: "Luxury Sofas", value: 45, color: "hsl(40 65% 50%)" },
  { name: "Arabian Majlis", value: 35, color: "hsl(345 50% 30%)" },
  { name: "TV Stands", value: 20, color: "hsl(210 60% 45%)" },
];

const inquiryData = [
  { day: "Mon", inquiries: 4 },
  { day: "Tue", inquiries: 7 },
  { day: "Wed", inquiries: 3 },
  { day: "Thu", inquiries: 8 },
  { day: "Fri", inquiries: 12 },
  { day: "Sat", inquiries: 9 },
  { day: "Sun", inquiries: 5 },
];

const recentOrders = [
  { id: "#ORD-1024", customer: "Ahmed Al-Rashid", product: "The Sovereign Sofa", amount: "SAR 45,000", status: "Delivered" },
  { id: "#ORD-1023", customer: "Fatima Hassan", product: "Grand Heritage Majlis", amount: "SAR 78,000", status: "In Progress" },
  { id: "#ORD-1022", customer: "Mohammed Ali", product: "Midnight Royal Sofa", amount: "SAR 38,500", status: "Pending" },
  { id: "#ORD-1021", customer: "Sara Ibrahim", product: "Azure Majesty Majlis", amount: "SAR 62,000", status: "Delivered" },
  { id: "#ORD-1020", customer: "Khalid Omar", product: "The Emerald Divan", amount: "SAR 32,000", status: "Shipped" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-500/20 text-green-400",
  "In Progress": "bg-primary/20 text-primary",
  Pending: "bg-yellow-500/20 text-yellow-400",
  Shipped: "bg-blue-500/20 text-blue-400",
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="text-xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-primary mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 18%)" />
                  <XAxis dataKey="month" stroke="hsl(30 10% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(30 10% 55%)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(30 12% 10%)", border: "1px solid hsl(30 10% 18%)", borderRadius: 4, color: "hsl(40 30% 92%)" }}
                    formatter={(value: number) => [`SAR ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(40 65% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(30 12% 10%)", border: "1px solid hsl(30 10% 18%)", borderRadius: 4, color: "hsl(40 30% 92%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Weekly Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inquiryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 18%)" />
                  <XAxis dataKey="day" stroke="hsl(30 10% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(30 10% 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(30 12% 10%)", border: "1px solid hsl(30 10% 18%)", borderRadius: 4, color: "hsl(40 30% 92%)" }} />
                  <Line type="monotone" dataKey="inquiries" stroke="hsl(40 65% 50%)" strokeWidth={2} dot={{ fill: "hsl(40 65% 50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
                      <span className="text-sm text-foreground font-medium">{order.customer}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.product}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{order.amount}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
