import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

/* ─── Global Styles ───────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body { background: #f7f6f3; }
    .fade-in { animation: fadeUp 0.45s ease both; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .card { transition: box-shadow 0.18s ease; }
    .card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.08); }
    button, label { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  `}</style>
);

/* ─── Data ────────────────────────────────────────────────────────────────── */
const revenueData = [
  { week: "W1", rev: 31 }, { week: "W2", rev: 36 }, { week: "W3", rev: 38 },
  { week: "W4", rev: 41 }, { week: "W5", rev: 39 }, { week: "W6", rev: 45 },
  { week: "W7", rev: 47 }, { week: "W8", rev: 46 },
];

const technicians = [
  { name: "Mike R.",   initials: "MR", color: "#4f46e5", jobs: 21, revenue: 10420, avg: 496, callback: 3, util: 82, trend: "up"   },
  { name: "Sarah L.",  initials: "SL", color: "#0ea5e9", jobs: 18, revenue: 9230,  avg: 512, callback: 2, util: 79, trend: "up"   },
  { name: "Josh K.",   initials: "JK", color: "#f59e0b", jobs: 17, revenue: 8950,  avg: 527, callback: 4, util: 75, trend: "down" },
  { name: "Dana M.",   initials: "DM", color: "#10b981", jobs: 15, revenue: 7640,  avg: 509, callback: 1, util: 71, trend: "up"   },
  { name: "Carlos T.", initials: "CT", color: "#94a3b8", jobs: 10, revenue: 5320,  avg: 532, callback: 2, util: 64, trend: "flat" },
];

const funnelStages = [
  { label: "Calls In",   count: 124, next: 89  },
  { label: "Booked",     count: 89,  next: 81  },
  { label: "Completed",  count: 81,  next: 78  },
  { label: "Invoiced",   count: 78,  next: 74  },
  { label: "Collected",  count: 74,  next: null },
];

const profitLeaks = [
  {
    severity: "high", icon: "📞", badge: "Biggest Leak", impact: "$17,920 potential",
    title: "35 calls didn't convert to bookings",
    story: "You answered 124 calls but only booked 89. That's 35 missed opportunities. At your average ticket of $512, roughly $17,920 in potential revenue was left on the table this week alone.",
    actions: [
      "Pull recordings of unbooked calls — identify the top 3 objections",
      "Script a same-day callback sequence for unconverted calls",
      "Goal: convert 5 more calls next week (+$2,560 revenue)",
    ],
  },
  {
    severity: "medium", icon: "🔁", badge: "Watch Closely", impact: "~$1,000 rework cost",
    title: "Josh K.'s callback rate doubled to 4%",
    story: "Josh completed 17 jobs but 4% required a callback — up from 2% last week. Callbacks cost you twice: lost tech time and damaged customer trust. Two callbacks this week = ~$1,000 in unbilled rework.",
    actions: [
      "Review Josh's last 3 callback jobs — spot the pattern",
      "Pair Josh with Mike R. for one ride-along this week",
      "Target Josh back to 2% callback by next Friday",
    ],
  },
  {
    severity: "medium", icon: "📉", badge: "Quick Win", impact: "+$1,500 at 67%",
    title: "Close rate slipped 3 points to 64%",
    story: "Your techs are completing jobs but not closing additional work at last week's rate. If close rate returns to 67%, you add ~$1,500 this week at current volume — no extra calls needed.",
    actions: [
      "Run a 15-min Monday huddle on presenting options at job sites",
      "Ask Sarah L. to share her approach — she has the top avg ticket",
      "Introduce a 3-option quote format: Good / Better / Best",
    ],
  },
  {
    severity: "low", icon: "🛠", badge: "Opportunity", impact: "$1,596 idle capacity",
    title: "Carlos T. is running at 64% utilization",
    story: "Carlos completed 10 jobs at 64% utilization — the lowest on your team. He has capacity for ~3 more jobs per week. At his $532 avg ticket, that's $1,596 sitting idle in your schedule right now.",
    actions: [
      "Fill Carlos's open slots with pending estimate follow-ups",
      "Assign Carlos to morning slots — his close rate trends higher AM",
      "Set a team-wide minimum utilization target of 72%",
    ],
  },
];

const weeklyActions = [
  { id: 1, priority: "Do Today",  text: "Pull call recordings from 35 unbooked leads — find top 3 objections" },
  { id: 2, priority: "Do Today",  text: "Review Josh K.'s last 3 callback jobs before dispatch this morning" },
  { id: 3, priority: "This Week", text: "Run Monday huddle on Good / Better / Best quoting with techs" },
  { id: 4, priority: "This Week", text: "Fill Carlos T.'s open slots with estimate follow-ups from last 2 weeks" },
  { id: 5, priority: "This Week", text: "Ask Sarah L. to share her approach — she's running the top avg ticket" },
  { id: 6, priority: "Track",     text: "Monitor Josh K.'s callback rate — target back to 2% by Friday" },
  { id: 7, priority: "Track",     text: "Alert if close rate drops below 62% midweek" },
];

const priorityMeta = {
  "Do Today":  { text: "#b91c1c", bg: "#fee2e2" },
  "This Week": { text: "#92400e", bg: "#fef3c7" },
  "Track":     { text: "#1e40af", bg: "#dbeafe" },
};

/* ─── Logo ────────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
        <rect width="32" height="32" rx="8" fill="#f59e0b"/>
        {/* Wrench body */}
        <path
          d="M21 7a5 5 0 0 0-4.6 6.9L9.8 20.5a1.8 1.8 0 1 0 2.5 2.6l6.6-6.6A5 5 0 0 0 21 7zm0 2a3 3 0 0 1 .8 5.9l-.7.2-.6-.6-1.3-1.3-.4-1.2.2-.8A3 3 0 0 1 21 9z"
          fill="#1c1917"
        />
        {/* Spark */}
        <circle cx="24" cy="9" r="1.8" fill="#1c1917" opacity="0.3"/>
      </svg>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 1, lineHeight: 1 }}>
          <span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: "#fafaf9", letterSpacing: "-0.01em" }}>
            TradesCoach
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: "#f59e0b" }}>
            .ai
          </span>
        </div>
        <p style={{ fontSize: 9, color: "#78716c", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.07em", marginTop: 2 }}>
          HVAC · PLUMBING · ELECTRICAL
        </p>
      </div>
    </div>
  );
}

/* ─── Score Ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ score, label }) {
  const color = score >= 80 ? "#16a34a" : score >= 65 ? "#d97706" : "#dc2626";
  const r = 20, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <svg width="56" height="56" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
          <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color,
        }}>{score}</span>
      </div>
      <span style={{ fontSize: 10, color: "#a8a29e", textAlign: "center", lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Leak Card ───────────────────────────────────────────────────────────── */
function LeakCard({ leak, defaultOpen, delay }) {
  const [open, setOpen] = useState(defaultOpen);
  const [checked, setChecked] = useState(leak.actions.map(() => false));

  const palette = {
    high:   { border: "#fca5a5", bg: "#fff8f8", badgeColor: "#b91c1c", badgeBg: "#fee2e2" },
    medium: { border: "#fcd34d", bg: "#fffef5", badgeColor: "#92400e", badgeBg: "#fef3c7" },
    low:    { border: "#6ee7b7", bg: "#f6fffe", badgeColor: "#065f46", badgeBg: "#d1fae5" },
  }[leak.severity];

  return (
    <div className="card fade-in" style={{
      borderRadius: 16, border: `2px solid ${palette.border}`,
      background: palette.bg, overflow: "hidden", animationDelay: `${delay}s`,
    }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "16px 16px 14px", textAlign: "left",
          background: "transparent", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{leak.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
                color: palette.badgeColor, background: palette.badgeBg,
                fontFamily: "'DM Sans', sans-serif",
              }}>{leak.badge}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#78716c", fontFamily: "'DM Sans', sans-serif" }}>
                {leak.impact}
              </span>
            </div>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 600,
              color: "#1c1917", lineHeight: 1.4,
            }}>{leak.title}</p>
          </div>
          <span style={{ fontSize: 11, color: "#a8a29e", flexShrink: 0, marginTop: 4 }}>{open ? "▲" : "▼"}</span>
        </div>
        <p style={{
          fontSize: 13, color: "#57534e", lineHeight: 1.6, marginTop: 8,
          fontFamily: "'DM Sans', sans-serif",
        }}>{leak.story}</p>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: `2px solid ${palette.border}` }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#a8a29e", margin: "12px 0 8px", fontFamily: "'DM Sans', sans-serif",
          }}>Actions for this week</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {leak.actions.map((action, i) => (
              <label key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10,
                padding: "10px 12px", cursor: "pointer",
                opacity: checked[i] ? 0.5 : 1,
              }}>
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => setChecked(c => c.map((v, j) => j === i ? !v : v))}
                  style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, accentColor: "#4f46e5", cursor: "pointer" }}
                />
                <span style={{
                  fontSize: 13, color: "#44403c", lineHeight: 1.5,
                  textDecoration: checked[i] ? "line-through" : "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{action}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Chart Tooltip ───────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const over = payload[0].value >= 40;
  return (
    <div style={{
      background: "#1c1917", color: "#fff", borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ fontSize: 11, color: "#78716c", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>${payload[0].value}k</p>
      <p style={{ fontSize: 11, marginTop: 2, color: over ? "#34d399" : "#fbbf24" }}>
        {over ? `↑ $${payload[0].value - 40}k above target` : `↓ $${40 - payload[0].value}k below target`}
      </p>
    </div>
  );
}

/* ─── Technician Utilization ──────────────────────────────────────────────── */
function TechUtilization() {
  const teamAvg = Math.round(technicians.reduce((s, t) => s + t.util, 0) / technicians.length);
  return (
    <section className="card fade-in" style={{
      background: "#fff", borderRadius: 16, border: "1px solid #e7e5e4", overflow: "hidden",
    }}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: "#1c1917" }}>
              Technician Utilization
            </h2>
            <p style={{ fontSize: 13, color: "#78716c", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
              How much of each tech's time is generating revenue
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: teamAvg >= 75 ? "#16a34a" : "#d97706" }}>
              {teamAvg}%
            </p>
            <p style={{ fontSize: 10, color: "#a8a29e", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              team avg
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { color: "#16a34a", label: "Strong (80%+)" },
            { color: "#d97706", label: "Watch (70–79%)" },
            { color: "#dc2626", label: "Low (<70%)" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#78716c", fontFamily: "'DM Sans', sans-serif" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech rows */}
      <div>
        {technicians.map((t, i) => {
          const barColor = t.util >= 80 ? "#16a34a" : t.util >= 70 ? "#d97706" : "#dc2626";
          const bgColor  = t.util >= 80 ? "#f0fdf4" : t.util >= 70 ? "#fffbeb" : "#fff5f5";
          const flag = t.callback >= 4
            ? { label: "High CB", color: "#b91c1c", bg: "#fee2e2" }
            : t.util < 70
            ? { label: "Underutilized", color: "#92400e", bg: "#fef3c7" }
            : null;
          const trendIcon  = t.trend === "up" ? "↑" : t.trend === "down" ? "↓" : "→";
          const trendColor = t.trend === "up" ? "#16a34a" : t.trend === "down" ? "#dc2626" : "#94a3b8";

          return (
            <div key={t.name} style={{
              padding: "14px 20px",
              borderTop: "1px solid #f5f5f4",
              background: i % 2 === 0 ? "#fff" : "#fafaf9",
            }}>
              {/* Name row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: t.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#1c1917", fontFamily: "'DM Sans', sans-serif" }}>
                        {t.name}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: trendColor }}>{trendIcon}</span>
                      {flag && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 100,
                          color: flag.color, background: flag.bg, fontFamily: "'DM Sans', sans-serif",
                        }}>{flag.label}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: "#a8a29e", fontFamily: "'DM Sans', sans-serif" }}>
                      {t.jobs} jobs · ${t.avg} avg · {t.callback}% callbacks
                    </span>
                  </div>
                </div>

                {/* Utilization % */}
                <div style={{
                  minWidth: 52, textAlign: "center", padding: "4px 10px",
                  borderRadius: 8, background: bgColor, flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 600, color: barColor,
                  }}>{t.util}%</span>
                </div>
              </div>

              {/* Utilization bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  flex: 1, height: 8, borderRadius: 999, background: "#f1f5f9", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 999, background: barColor,
                    width: `${t.util}%`, transition: "width 0.8s ease",
                  }} />
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8", width: 52, textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>
                  ${Math.round(t.revenue / 1000)}k rev
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team insight footer */}
      <div style={{
        margin: "0 16px 16px", marginTop: 12, padding: "10px 14px",
        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12,
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#92400e", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
          💡 <strong>Carlos at 64% and Josh at 75%</strong> represent ~$3,200 in recoverable capacity this week if slots are filled.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────────────────────── */
export default function TradesCoachDashboard() {
  const [actions, setActions] = useState(weeklyActions.map(a => ({ ...a, done: false })));
  const toggle   = (id) => setActions(list => list.map(a => a.id === id ? { ...a, done: !a.done } : a));
  const doneCount = actions.filter(a => a.done).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f3", fontFamily: "'DM Sans', sans-serif" }}>
      <GlobalStyles />

      {/* ══════════════════ HEADER ══════════════════ */}
      <header style={{
        background: "#1c1917", borderBottom: "1px solid #292524",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Logo />
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#78716c",
            fontFamily: "'DM Sans', sans-serif", textAlign: "right",
          }}>
            <span>Jun 9–15, 2025</span>
            <br />
            <span style={{ color: "#57534e" }}>Weekly Briefing</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* ══════════════════ HERO NARRATIVE ══════════════════ */}
        <section className="fade-in" style={{
          background: "#1c1917", borderRadius: 20, padding: "24px 20px",
          marginBottom: 20, border: "1.5px solid #292524",
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#f59e0b", marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
          }}>Your Business Pulse · This Week</p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: 700, color: "#fafaf9", lineHeight: 1.3, marginBottom: 12,
          }}>
            Strong week — but you left{" "}
            <span style={{ color: "#f59e0b" }}>~$20,500 on the table.</span>
          </h1>

          {/* Narrative */}
          <p style={{ fontSize: 14, color: "#a8a29e", lineHeight: 1.7, marginBottom: 20 }}>
            Revenue hit <strong style={{ color: "#fafaf9" }}>$45,568</strong> — your best 8-week high.
            Booking rate improved and Sarah L. is running at peak efficiency.
            But 35 calls didn't convert, Josh's callbacks doubled, and Carlos has idle capacity sitting in your schedule.
            Here's exactly what to focus on this week.
          </p>

          {/* Score rings — horizontal scroll on mobile */}
          <div style={{
            display: "flex", gap: 20, paddingBottom: 4,
            overflowX: "auto", WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}>
            <ScoreRing score={78} label={"Business\nHealth"} />
            <ScoreRing score={72} label={"Conversion\nRate"} />
            <ScoreRing score={64} label={"Team\nEfficiency"} />
          </div>

          {/* KPI strip */}
          <div style={{
            marginTop: 20, paddingTop: 20, borderTop: "1px solid #292524",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px 8px",
          }}>
            {[
              { label: "Calls In",    val: "124",    delta: "+8%",  up: true  },
              { label: "Booked",      val: "89",      delta: "+4",   up: true  },
              { label: "Close Rate",  val: "64%",     delta: "−3%",  up: false },
              { label: "Avg Ticket",  val: "$512",    delta: "+2%",  up: true  },
              { label: "Weekly Rev",  val: "$45.5k",  delta: "+9%",  up: true  },
              { label: "Avg CB Rate", val: "2.4%",    delta: "+1%",  up: false },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 10, color: "#57534e", marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </p>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "clamp(14px, 3.5vw, 18px)",
                  fontWeight: 600, color: "#fafaf9",
                }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: s.up ? "#34d399" : "#f87171", marginTop: 1 }}>
                  {s.delta} vs last wk
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ TWO-COLUMN LAYOUT ══════════════════ */}
        {/* On mobile: single column stack. On desktop: 2/3 + 1/3 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
        }}>
          {/* We'll use a CSS media query approach via inline conditional rendering */}
          <DesktopLayout actions={actions} toggle={toggle} doneCount={doneCount} />
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 32, textAlign: "center", fontSize: 11,
          color: "#a8a29e", fontFamily: "'DM Sans', sans-serif",
        }}>
          TradesCoach.ai · HVAC Intelligence Platform · Week of Jun 9–15, 2025
        </footer>
      </main>
    </div>
  );
}

/* ─── Responsive Layout Component ────────────────────────────────────────── */
function DesktopLayout({ actions, toggle, doneCount }) {
  const priorityMeta = {
    "Do Today":  { text: "#b91c1c", bg: "#fee2e2" },
    "This Week": { text: "#92400e", bg: "#fef3c7" },
    "Track":     { text: "#1e40af", bg: "#dbeafe" },
  };

  const MainContent = (
    <>
      {/* ── PROFIT LEAKS ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: "#1c1917" }}>
              Where Your Profit Is Leaking
            </h2>
            <p style={{ fontSize: 13, color: "#78716c", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
              4 issues found · Expand each to see what to do
            </p>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999,
            color: "#b91c1c", background: "#fff5f5", border: "1px solid #fca5a5",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
          }}>~$20,500 at risk</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {profitLeaks.map((leak, i) => (
            <LeakCard key={i} leak={leak} defaultOpen={i === 0} delay={i * 0.07} />
          ))}
        </div>
      </section>

      {/* ── FUNNEL ── */}
      <section className="card fade-in" style={{
        background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e7e5e4",
      }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: "#1c1917", marginBottom: 4 }}>
          Where Leads Are Falling Off
        </h2>
        <p style={{ fontSize: 13, color: "#78716c", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
          The biggest gap is between Calls and Bookings — 35 people called but didn't book.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {funnelStages.map((stage, i) => {
            const pct = Math.round((stage.count / 124) * 100);
            const dropOff = stage.next ? stage.count - stage.next : 0;
            const isWorst = i === 0;
            return (
              <div key={stage.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1917", fontFamily: "'DM Sans', sans-serif" }}>
                    {stage.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {dropOff > 0 && (
                      <span style={{
                        fontSize: 11, fontWeight: isWorst ? 700 : 500,
                        color: isWorst ? "#ef4444" : "#a8a29e",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {isWorst ? "⚠ " : ""}−{dropOff}
                      </span>
                    )}
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: "#1c1917" }}>
                      {stage.count}
                    </span>
                  </div>
                </div>
                <div style={{ height: 32, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 10,
                    width: `${pct}%`, transition: "width 0.7s ease",
                    background: isWorst
                      ? "linear-gradient(90deg,#ef4444,#f97316)"
                      : `rgba(79,70,229,${0.9 - i * 0.15})`,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 14, padding: "10px 14px", background: "#fffbeb",
          border: "1px solid #fde68a", borderRadius: 12, fontSize: 12,
          color: "#78350f", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
        }}>
          💡 <strong>Convert just 5 more calls next week</strong> = ~$2,560 in added revenue with zero extra marketing spend.
        </div>
      </section>

      {/* ── TECHNICIAN UTILIZATION ── */}
      <TechUtilization />

      {/* ── REVENUE TREND ── */}
      <section className="card fade-in" style={{
        background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e7e5e4",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: "#1c1917" }}>
              Revenue vs. $40k Target
            </h2>
            <p style={{ fontSize: 13, color: "#78716c", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
              Beat target 3 of last 4 weeks. Momentum is real.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { color: "#4f46e5", label: "Actual", dashed: false },
              { color: "#f59e0b", label: "Target", dashed: true },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  display: "inline-block", width: 18, height: 0,
                  borderTop: `2px ${l.dashed ? "dashed" : "solid"} ${l.color}`,
                }} />
                <span style={{ fontSize: 11, color: "#78716c", fontFamily: "'DM Sans', sans-serif" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={revenueData} margin={{ top: 5, right: 8, left: -14, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${v}k`} tick={{ fontSize: 11, fill: "#a8a29e" }}
              axisLine={false} tickLine={false} domain={[25, 52]} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1.5} />
            <Line type="monotone" dataKey="rev" stroke="#4f46e5" strokeWidth={2.5}
              dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: "#c7d2fe", strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </>
  );

  const ActionPlan = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Action checklist */}
      <div className="card fade-in" style={{
        background: "#fff", borderRadius: 16, border: "2px solid #e7e5e4", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid #f5f5f4", background: "#fafaf9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: "#1c1917" }}>
              Your Action Plan
            </h2>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: "#a8a29e" }}>
              {doneCount}/{actions.length}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#78716c", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
            Check off as you work through the week
          </p>
          <div style={{ background: "#e7e5e4", borderRadius: 999, height: 6 }}>
            <div style={{
              height: 6, borderRadius: 999, background: "#4f46e5",
              width: `${(doneCount / actions.length) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        <div style={{ padding: "12px 14px" }}>
          {["Do Today", "This Week", "Track"].map(priority => {
            const items = actions.filter(a => a.priority === priority);
            const pm = priorityMeta[priority];
            return (
              <div key={priority} style={{ marginBottom: 14 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                  color: pm.text, padding: "0 2px", marginBottom: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}>{priority}</p>
                {items.map(action => (
                  <label key={action.id} style={{
                    display: "flex", gap: 10, alignItems: "flex-start",
                    padding: "9px 10px", marginBottom: 6, borderRadius: 10, cursor: "pointer",
                    border: "1px solid",
                    background: action.done ? "#f5f5f4" : "#fff",
                    borderColor: action.done ? "#e7e5e4" : "#f0efee",
                    opacity: action.done ? 0.55 : 1,
                    transition: "opacity 0.2s, background 0.2s",
                  }}>
                    <input
                      type="checkbox"
                      checked={action.done}
                      onChange={() => toggle(action.id)}
                      style={{ width: 15, height: 15, marginTop: 2, flexShrink: 0, accentColor: "#4f46e5", cursor: "pointer" }}
                    />
                    <span style={{
                      fontSize: 12, color: "#44403c", lineHeight: 1.5,
                      textDecoration: action.done ? "line-through" : "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{action.text}</span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{
          margin: "0 14px 14px", padding: "10px 12px",
          background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
          fontSize: 12, color: "#92400e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
        }}>
          💰 Complete these actions and you could recover <strong>$8,000–$12,000</strong> in revenue next week.
        </div>
      </div>

      {/* What's Working */}
      <div className="card fade-in" style={{
        background: "#f0fdf9", borderRadius: 16, padding: 16, border: "1px solid #a7f3d0",
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "#065f46", marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
        }}>✓ What's Working</p>
        {[
          "Booking rate up 6% — your CSRs are improving",
          "Sarah L. has the highest avg ticket at $512",
          "Revenue beat $40k target for the 3rd time this month",
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start",
          }}>
            <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>↑</span>
            <span style={{ fontSize: 13, color: "#065f46", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Responsive: on desktop (>=768px) use side-by-side, on mobile stack
  return (
    <>
      <style>{`
        .tc-layout { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .tc-main   { display: flex; flex-direction: column; gap: 16px; }
        .tc-sidebar { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 900px) {
          .tc-layout { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); align-items: start; }
          .tc-sidebar { position: sticky; top: 72px; }
        }
      `}</style>
      <div className="tc-layout">
        <div className="tc-main">{MainContent}</div>
        <div className="tc-sidebar">{ActionPlan}</div>
      </div>
    </>
  );
}
