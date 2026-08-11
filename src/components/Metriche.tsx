import { useState, useEffect } from "react";
import { X, BarChart3, PieChart as PieChartIcon, List } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MetricheProps {
  leads: { etichetta_id?: string | null; etichetta?: string }[];
  etichette: { id: string; nome: string; colore: string }[];
}

type ViewType = "pie" | "bar" | "list";

export default function Metriche({ leads, etichette }: MetricheProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewType>("pie");

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  const total = leads.length;

  const data = etichette
    .map((etichetta) => {
      const count = leads.filter((lead) => (lead.etichetta_id || lead.etichetta) === etichetta.id).length;
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
      return {
        name: etichetta.nome,
        value: count,
        pct,
        color: etichetta.colore ?? "#9ca3af",
      };
    })
    .filter((d) => d.value > 0);

  const views: { type: ViewType; icon: typeof PieChartIcon; label: string }[] = [
    { type: "pie", icon: PieChartIcon, label: "Torta" },
    { type: "bar", icon: BarChart3, label: "Barre" },
    { type: "list", icon: List, label: "Lista" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <BarChart3 className="h-5 w-5" />
        Metriche
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="mb-1 text-lg font-semibold text-foreground">
                Metriche lista
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {total} lead totali
              </p>

              {/* View switcher */}
              <div className="mb-4 flex gap-1 rounded-md border border-border p-1 w-fit">
                {views.map((v) => (
                  <Button
                    key={v.type}
                    variant={view === v.type ? "default" : "ghost"}
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => setView(v.type)}
                  >
                    <v.icon className="h-3.5 w-3.5" />
                    {v.label}
                  </Button>
                ))}
              </div>

              {/* Pie chart */}
              {view === "pie" && (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ pct }) => `${pct}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Bar chart */}
              {view === "bar" && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={140}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) =>
                        [`${value} (${props.payload.pct}%)`, "Lead"]
                      }
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* List view */}
              {view === "list" && (
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {item.value}
                        </span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Legend for pie/bar */}
              {view !== "list" && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-foreground">
                        {item.name} ({item.value} · {item.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
