import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Wallet, ShoppingBag, BadgeDollarSign, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const COLORS = ["#7C3AED", "#60A5FA", "#22C55E", "#F59E0B"];

const salesDistribution = [
  { label: "By Website", value: 4500, pct: 40 },
  { label: "By Mobile", value: 2800, pct: 25 },
  { label: "By Market", value: 2200, pct: 20 },
  { label: "By Agent", value: 1700, pct: 15 },
];

const revenueUpdates = [
  { name: "Jan", value: 35 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 62 },
  { name: "May", value: 55 },
  { name: "Jun", value: 70 },
];

const yearlySales = [
  { month: "Jan", y2023: 42, y2022: 36 },
  { month: "Feb", y2023: 50, y2022: 44 },
  { month: "Mar", y2023: 58, y2022: 49 },
  { month: "Apr", y2023: 65, y2022: 52 },
  { month: "May", y2023: 61, y2022: 55 },
  { month: "Jun", y2023: 74, y2022: 60 },
];

const paymentGateways = [
  {
    icon: <BadgeDollarSign className="h-4 w-4" />,
    name: "Paypal",
    detail: "via bank",
    amount: "+$2,335",
  },
  { icon: <Wallet className="h-4 w-4" />, name: "Wallet", detail: "bill payment", amount: "-$235" },
  {
    icon: <ShoppingBag className="h-4 w-4" />,
    name: "Credit card",
    detail: "shopping",
    amount: "+$2,235",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* ====== Hero: Sales Distribution ====== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="overflow-hidden border-none shadow-md">
              <div className="relative">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-sky-400/15 to-emerald-400/15" />
                <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg md:text-xl">Sales Distribution</CardTitle>
                  <CardDescription>This is all over Platform Sales Generated</CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {salesDistribution.map((s, i) => (
                      <div
                        key={s.label}
                        className="rounded-xl border bg-white/60 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-background"
                      >
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <div className="text-xl font-semibold tabular-nums">
                            ${Intl.NumberFormat().format(s.value / 1)}
                          </div>
                          <span className="text-xs text-muted-foreground">({s.pct}%)</span>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.pct}%`,
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* ====== Row: Overview / Revenue / Yearly ====== */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sales Overview (donut) */}
            <motion.div
              className="col-span-12 md:col-span-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Profit / Expense</CardDescription>
                </CardHeader>
                <CardContent className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Profit", value: 23450 },
                          { name: "Expense", value: 18450 },
                        ]}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill={COLORS[2]} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-xl font-semibold">$500.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Updates (bars) */}
            <motion.div
              className="col-span-12 md:col-span-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Updates</CardTitle>
                </CardHeader>
                <CardContent className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueUpdates}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Yearly Sales (lines) */}
            <motion.div
              className="col-span-12 md:col-span-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Yearly Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlySales}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="y2023" strokeWidth={2} dot={false} />
                      <Line
                        type="monotone"
                        dataKey="y2022"
                        strokeWidth={2}
                        strokeDasharray="4 6"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ====== Row: Active Users / Payment Gateways ====== */}
          <div className="grid grid-cols-12 gap-6">
            {/* Active Users */}
            <motion.div
              className="col-span-12 md:col-span-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Active User</CardTitle>
                    <CardDescription>+8.06% vs. previous month</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Placeholder de mapa ligero */}
                  <div className="relative grid h-56 place-items-center rounded-md border bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                      World activity heatmap (placeholder)
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">23,214</span> Total Active User
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Gateways */}
            <motion.div
              className="col-span-12 md:col-span-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateways</CardTitle>
                  <CardDescription>Recent transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentGateways.map((p, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                          {p.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.detail}</div>
                        </div>
                        <div className="text-sm font-medium tabular-nums">{p.amount}</div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <Button variant="ghost" className="w-full">
                    View all transactions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
