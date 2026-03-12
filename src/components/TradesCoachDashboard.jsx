import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND TOKENS — Home Service Coaching Pros
   Extracted directly from homeservicecoachingpros.com

   Nav bar:        #188BF6 (electric blue gradient)
   Hero BG:        #000000 (pure black)
   Primary blue:   #188BF6  (--secondary CSS var)
   Deep blue:      #0051FF
   Cyan accent:    #03FFF7  (button border glow)
   Orange accent:  #FF7B00
   Green:          #37CA37  (--primary CSS var)
   Font:           Montserrat (all weights)
   CTA button:     bg #188BF6, border 2.67px solid #03FFF7, radius 10px
───────────────────────────────────────────────────────────────────────────── */
const B = {
  black:      "#000000",
  heroBg:     "#060b12",
  cardDark:   "#0d1117",
  cardMid:    "#111820",
  cardLight:  "#16202e",
  border:     "#1e2d42",
  borderGlow: "#1e3a5f",
  blue:       "#188BF6",
  blueDark:   "#0051FF",
  blueFade:   "rgba(24,139,246,0.12)",
  cyan:       "#03FFF7",
  cyanFade:   "rgba(3,255,247,0.15)",
  orange:     "#FF7B00",
  orangeFade: "rgba(255,123,0,0.12)",
  green:      "#37CA37",
  greenFade:  "rgba(55,202,55,0.12)",
  red:        "#EF4444",
  redFade:    "rgba(239,68,68,0.12)",
  amber:      "#F5A623",
  amberFade:  "rgba(245,166,35,0.12)",
  white:      "#FFFFFF",
  offWhite:   "#D8E2F0",
  muted:      "#8B9AB5",
  subtle:     "#4a5a72",
};

/* ─── Global Styles ───────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=DM+Mono:wght@500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body { background: ${B.heroBg}; font-family: 'Montserrat', sans-serif; }
    .fade-in { animation: fadeUp 0.4s ease both; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .card:hover { box-shadow: 0 8px 36px rgba(24,139,246,0.18); transform: translateY(-1px); }
    .btn-primary {
      background: ${B.blue}; color: #fff;
      border: 2.67px solid ${B.cyan}; border-radius: 10px;
      font-family: 'Montserrat', sans-serif; font-weight: 700; cursor: pointer;
      transition: all 0.2s ease; box-shadow: 0 0 14px rgba(3,255,247,0.2);
    }
    .btn-primary:hover { background: ${B.blueDark}; box-shadow: 0 0 28px rgba(3,255,247,0.4); transform: translateY(-1px); }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .severity-high   { border-left: 3px solid ${B.red} !important; }
    .severity-medium { border-left: 3px solid ${B.orange} !important; }
    .severity-low    { border-left: 3px solid ${B.green} !important; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .dashboard-main { display: flex; flex-direction: column; gap: 16px; }
    @media (min-width: 960px) {
      .dashboard-grid { grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr); align-items: start; }
      .dashboard-sidebar { position: sticky; top: 68px; }
    }
    .section-label { font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    .pulse { animation: pulse 2s ease infinite; }
  `}</style>
);

/* ─── Data ────────────────────────────────────────────────────────────────── */
const revenueData = [
  { week: "W1", rev: 31 }, { week: "W2", rev: 36 }, { week: "W3", rev: 38 },
  { week: "W4", rev: 41 }, { week: "W5", rev: 39 }, { week: "W6", rev: 45 },
  { week: "W7", rev: 47 }, { week: "W8", rev: 46 },
];

const technicians = [
  { name: "Mike R.",   initials: "MR", color: B.blue,   jobs: 21, revenue: 10420, avg: 496, callback: 3, util: 82, trend: "up"   },
  { name: "Sarah L.",  initials: "SL", color: B.green,  jobs: 18, revenue: 9230,  avg: 512, callback: 2, util: 79, trend: "up"   },
  { name: "Josh K.",   initials: "JK", color: B.orange, jobs: 17, revenue: 8950,  avg: 527, callback: 4, util: 75, trend: "down" },
  { name: "Dana M.",   initials: "DM", color: B.cyan,   jobs: 15, revenue: 7640,  avg: 509, callback: 1, util: 71, trend: "up"   },
  { name: "Carlos T.", initials: "CT", color: B.muted,  jobs: 10, revenue: 5320,  avg: 532, callback: 2, util: 64, trend: "flat" },
];

const funnelStages = [
  { label: "Calls In",  count: 124, next: 89  },
  { label: "Booked",    count: 89,  next: 81  },
  { label: "Completed", count: 81,  next: 78  },
  { label: "Invoiced",  count: 78,  next: 74  },
  { label: "Collected", count: 74,  next: null },
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
    story: "Your techs are completing jobs but not closing additional work at last week's rate. Return to 67% and you add ~$1,500 this week at current volume — no extra calls needed.",
    actions: [
      "Run a 15-min Monday huddle on presenting options at job sites",
      "Ask Sarah L. to share her approach — she has the top avg ticket",
      "Introduce a 3-option quote format: Good / Better / Best",
    ],
  },
  {
    severity: "low", icon: "🛠", badge: "Opportunity", impact: "$1,596 idle capacity",
    title: "Carlos T. is running at 64% utilization",
    story: "Carlos has capacity for ~3 more jobs per week. At his $532 avg ticket, that's $1,596 sitting idle in your schedule every week.",
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

/* ─── HSCP Logo ───────────────────────────────────────────────────────────── */
function HSCPLogo({ compact = false }) {
  return (
    <img
      src="/hscp-logo.png"
      alt="Home Service Coaching Pros"
      style={{
        height: compact ? 44 : 72,
        width: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}

/* ─── Score Ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ score, label, sublabel }) {
  const color = score >= 80 ? B.green : score >= 65 ? B.orange : B.red;
  const r = 22, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="26" cy="26" r={r} fill="none" stroke={B.border} strokeWidth="4"/>
          <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 600, color,
        }}>{score}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="section-label" style={{ color: B.offWhite, fontSize: 8, display: "block", lineHeight: 1.3 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 7.5, color: B.muted, marginTop: 1, fontWeight: 500 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

/* ─── Leak Card ───────────────────────────────────────────────────────────── */
function LeakCard({ leak, defaultOpen, delay }) {
  const [open, setOpen] = useState(defaultOpen);
  const [checked, setChecked] = useState(leak.actions.map(() => false));
  const doneCount = checked.filter(Boolean).length;

  const palette = {
    high:   { accent: B.red,    fade: B.redFade,    badgeText: B.red,    badgeBg: "rgba(239,68,68,0.15)"  },
    medium: { accent: B.orange, fade: B.orangeFade, badgeText: B.orange, badgeBg: "rgba(255,123,0,0.15)"  },
    low:    { accent: B.green,  fade: B.greenFade,  badgeText: B.green,  badgeBg: "rgba(55,202,55,0.15)"  },
  }[leak.severity];

  return (
    <div className={`card severity-${leak.severity} fade-in`} style={{
      borderRadius: 12, border: `1px solid ${B.border}`,
      background: B.cardDark, overflow: "hidden", animationDelay: `${delay}s`,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "16px 18px", textAlign: "left",
        background: "transparent", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: palette.fade,
            border: `1px solid ${palette.accent}30`, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
          }}>{leak.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 100,
                color: palette.badgeText, background: palette.badgeBg,
                fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>{leak.badge}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: B.muted }}>{leak.impact}</span>
            </div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700,
              color: B.white, lineHeight: 1.4 }}>{leak.title}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            {doneCount > 0 && <span style={{ fontSize: 10, color: B.green, fontWeight: 700 }}>{doneCount}/{leak.actions.length}</span>}
            <span style={{ fontSize: 10, color: B.muted }}>{open ? "▲" : "▼"}</span>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: B.offWhite, lineHeight: 1.68, marginTop: 10,
          fontFamily: "'Montserrat', sans-serif", fontWeight: 400, opacity: 0.85 }}>
          {leak.story}
        </p>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${B.border}` }}>
          <p className="section-label" style={{ color: B.muted, margin: "13px 0 9px", display: "block" }}>
            Actions this week
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {leak.actions.map((action, i) => (
              <label key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                background: B.cardMid, border: `1px solid ${checked[i] ? B.green + "40" : B.border}`,
                borderRadius: 9, padding: "10px 12px", cursor: "pointer",
                opacity: checked[i] ? 0.5 : 1, transition: "all 0.2s",
              }}>
                <input type="checkbox" checked={checked[i]}
                  onChange={() => setChecked(c => c.map((v, j) => j === i ? !v : v))}
                  style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, accentColor: B.blue, cursor: "pointer" }}/>
                <span style={{
                  fontSize: 12, color: checked[i] ? B.muted : B.offWhite, lineHeight: 1.55,
                  textDecoration: checked[i] ? "line-through" : "none",
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
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
  const val = payload[0].value;
  const over = val >= 40;
  return (
    <div style={{
      background: B.cardMid, color: B.white, borderRadius: 10, padding: "10px 14px",
      border: `1px solid ${B.blue}40`, boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <p style={{ fontSize: 10, color: B.muted, marginBottom: 3, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>${val}k</p>
      <p style={{ fontSize: 11, marginTop: 3, fontWeight: 700, color: over ? B.green : B.orange }}>
        {over ? `+$${val - 40}k above target` : `-$${40 - val}k below target`}
      </p>
    </div>
  );
}

/* ─── Technician Utilization ──────────────────────────────────────────────── */
function TechUtilization() {
  const teamAvg = Math.round(technicians.reduce((s, t) => s + t.util, 0) / technicians.length);
  const teamAvgColor = teamAvg >= 80 ? B.green : teamAvg >= 70 ? B.orange : B.red;
  return (
    <section className="card" style={{
      background: B.cardDark, borderRadius: 14, border: `1px solid ${B.border}`, overflow: "hidden",
    }}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 800,
              color: B.white, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
              Technician Utilization
            </h2>
            <p style={{ fontSize: 12, color: B.muted, fontWeight: 500 }}>
              Billable time as % of available hours
            </p>
          </div>
          <div style={{ textAlign: "right", padding: "8px 14px", borderRadius: 10,
            background: `${teamAvgColor}15`, border: `1px solid ${teamAvgColor}40` }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600,
              color: teamAvgColor, lineHeight: 1 }}>{teamAvg}%</p>
            <p className="section-label" style={{ color: B.muted, marginTop: 3, display: "block" }}>team avg</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, marginBottom: 4, flexWrap: "wrap" }}>
          {[
            { color: B.green,  label: "Strong 80%+" },
            { color: B.orange, label: "Monitor 70–79%" },
            { color: B.red,    label: "Action <70%" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: `0 0 5px ${l.color}` }}/>
              <span style={{ fontSize: 11, color: B.muted, fontWeight: 500 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      {technicians.map((t, i) => {
        const barColor = t.util >= 80 ? B.green : t.util >= 70 ? B.orange : B.red;
        const flags = [];
        if (t.callback >= 4) flags.push({ label: "High CB", color: B.red, bg: B.redFade });
        if (t.util < 70)     flags.push({ label: "Low Util", color: B.orange, bg: B.orangeFade });
        const trendIcon  = { up: "↑", down: "↓", flat: "→" }[t.trend];
        const trendColor = { up: B.green, down: B.red, flat: B.muted }[t.trend];
        return (
          <div key={t.name} style={{
            padding: "14px 20px", borderTop: `1px solid ${B.border}`,
            background: i % 2 === 1 ? `${B.blue}04` : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                  border: `2px solid ${t.color}50`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 800, color: B.white,
                  flexShrink: 0, fontFamily: "'Montserrat', sans-serif",
                  boxShadow: `0 0 8px ${t.color}40`,
                }}>{t.initials}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: B.white, fontFamily: "'Montserrat', sans-serif" }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: trendColor }}>{trendIcon}</span>
                    {flags.map(f => (
                      <span key={f.label} style={{
                        fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 100,
                        color: f.color, background: f.bg, fontFamily: "'Montserrat', sans-serif",
                      }}>{f.label}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: B.muted, fontWeight: 500 }}>
                    {t.jobs} jobs · ${t.avg} avg ticket · {t.callback}% callbacks
                  </span>
                </div>
              </div>
              <div style={{
                minWidth: 52, textAlign: "center", padding: "5px 10px", borderRadius: 8,
                background: `${barColor}15`, border: `1px solid ${barColor}40`,
                flexShrink: 0, marginLeft: 10,
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 600, color: barColor }}>
                  {t.util}%
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: B.border }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                  width: `${t.util}%`, transition: "width 0.9s ease",
                  boxShadow: `0 0 8px ${barColor}70`,
                }}/>
              </div>
              <span style={{ fontSize: 11, color: B.muted, width: 55, textAlign: "right", fontWeight: 500, flexShrink: 0 }}>
                ${Math.round(t.revenue / 1000)}k rev
              </span>
            </div>
          </div>
        );
      })}
      <div style={{
        margin: "12px 16px 16px", padding: "12px 14px",
        background: B.orangeFade, border: `1px solid ${B.orange}40`, borderRadius: 10,
      }}>
        <p style={{ fontSize: 12, color: B.offWhite, lineHeight: 1.55, fontWeight: 500 }}>
          💡 <strong style={{ color: B.orange }}>Carlos at 64% + Josh at 75%</strong> = ~$3,200 in recoverable weekly capacity. Fill their open slots with pending estimate follow-ups.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────────────────────── */
export default function HSCPDashboard() {
  const [actions, setActions] = useState(weeklyActions.map(a => ({ ...a, done: false })));
  const toggle = (id) => setActions(list => list.map(a => a.id === id ? { ...a, done: !a.done } : a));
  const doneCount = actions.filter(a => a.done).length;
  const progress = Math.round((doneCount / actions.length) * 100);

  const priorityStyle = {
    "Do Today":  { color: B.red,    bg: B.redFade,    border: `${B.red}40`    },
    "This Week": { color: B.orange, bg: B.orangeFade, border: `${B.orange}40` },
    "Track":     { color: B.blue,   bg: B.blueFade,   border: `${B.blue}40`   },
  };

  return (
    <div style={{ minHeight: "100vh", background: B.heroBg, fontFamily: "'Montserrat', sans-serif" }}>
      <GlobalStyles />

      {/* ══════ HEADER — matches HSCP electric blue nav ══════ */}
      <header style={{
        background: `linear-gradient(90deg, #0a65c2 0%, ${B.blue} 50%, #0a65c2 100%)`,
        borderBottom: `1px solid ${B.cyan}30`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: `0 2px 20px rgba(24,139,246,0.45)`,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <HSCPLogo compact />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
              background: "rgba(0,0,0,0.2)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: B.green, display: "block" }}/>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: "0.07em" }}>LIVE</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textAlign: "right", lineHeight: 1.4, display: "none" }} className="desktop-only">
              <span style={{ color: B.white, fontWeight: 700 }}>Jun 9–15, 2025</span><br/>Weekly Report
            </div>
            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 52px" }}>

        {/* ══════ HERO — Weekly Verdict ══════ */}
        <section className="fade-in" style={{
          borderRadius: 16, marginBottom: 20, overflow: "hidden",
          border: `1px solid ${B.borderGlow}`,
          background: `linear-gradient(135deg, ${B.black} 0%, #060f1e 45%, #081525 100%)`,
          position: "relative",
        }}>
          {/* Colorbar top — HSCP brand gradient */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${B.blue}, ${B.cyan}, ${B.orange}, ${B.blue})` }}/>
          {/* Dot grid bg */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: `radial-gradient(${B.blue} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}/>

          <div style={{ padding: "26px 24px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span className="section-label" style={{ color: B.orange }}>
                📊 Profit Intelligence Report
              </span>
              <span style={{ fontSize: 9, color: B.subtle, fontWeight: 500 }}>· Jun 9–15, 2025</span>
            </div>

            <h1 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 900, color: B.white,
              lineHeight: 1.2, marginBottom: 14, textTransform: "uppercase", letterSpacing: "-0.01em",
            }}>
              Strong week —{" "}
              <span style={{ color: B.orange, textShadow: `0 0 24px ${B.orange}50` }}>
                but you left ~$20,500 on the table.
              </span>
            </h1>

            <p style={{
              fontSize: 13.5, color: B.offWhite, lineHeight: 1.72, fontWeight: 500,
              maxWidth: 700, marginBottom: 24, opacity: 0.88,
            }}>
              Revenue hit <strong style={{ color: B.white }}>$45,568</strong> — your best 8-week high.
              Booking rate improved and Sarah L. is running at peak efficiency.
              But 35 calls didn't convert, Josh's callbacks doubled, and Carlos has capacity sitting idle.
              Here's exactly what to do this week.
            </p>

            {/* Score rings — always 3 columns, never wraps */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12, marginBottom: 26, maxWidth: 340,
            }}>
              <ScoreRing score={78} label="Business Health" sublabel="Overall" />
              <ScoreRing score={72} label="Conversion Rate" sublabel="Calls→Jobs" />
              <ScoreRing score={64} label="Team Efficiency" sublabel="Utilization" />
            </div>

            {/* KPI strip */}
            <div style={{
              paddingTop: 20, borderTop: `1px solid ${B.border}`,
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 12px",
            }}>
              {[
                { label: "Calls In",    val: "124",    delta: "+8% vs last wk",  up: true  },
                { label: "Booked",      val: "89",     delta: "+4 vs last wk",   up: true  },
                { label: "Close Rate",  val: "64%",    delta: "−3% vs last wk",  up: false },
                { label: "Avg Ticket",  val: "$512",   delta: "+2% vs last wk",  up: true  },
                { label: "Weekly Rev",  val: "$45.5k", delta: "+9% vs last wk",  up: true  },
                { label: "Avg CB Rate", val: "2.4%",   delta: "+1% vs last wk",  up: false },
              ].map(s => (
                <div key={s.label}>
                  <p className="section-label" style={{ color: B.muted, marginBottom: 4, display: "block" }}>{s.label}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(16px, 3.5vw, 22px)",
                    fontWeight: 600, color: B.white, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: s.up ? B.green : B.orange, marginTop: 4 }}>
                    {s.delta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ MAIN GRID ══════ */}
        <div className="dashboard-grid">

          {/* ── Main column ── */}
          <div className="dashboard-main">

            {/* Profit Leaks */}
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 800,
                    color: B.white, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Where Your Profit Is Leaking
                  </h2>
                  <p style={{ fontSize: 12, color: B.muted, marginTop: 3, fontWeight: 500 }}>
                    4 issues found · Expand each to see your action plan
                  </p>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800, padding: "6px 14px", borderRadius: 100,
                  color: B.red, background: B.redFade, border: `1px solid ${B.red}40`, whiteSpace: "nowrap",
                }}>~$20,500 at risk this week</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {profitLeaks.map((leak, i) => (
                  <LeakCard key={i} leak={leak} defaultOpen={i === 0} delay={i * 0.06} />
                ))}
              </div>
            </section>

            {/* Funnel */}
            <section className="card" style={{
              background: B.cardDark, borderRadius: 14, padding: 20, border: `1px solid ${B.border}`,
            }}>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 800,
                color: B.white, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                Where Leads Are Dropping Off
              </h2>
              <p style={{ fontSize: 12, color: B.muted, marginBottom: 20, fontWeight: 500 }}>
                Biggest gap: Calls → Bookings. 35 people called but didn't book.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {funnelStages.map((stage, i) => {
                  const pct = Math.round((stage.count / 124) * 100);
                  const dropOff = stage.next ? stage.count - stage.next : 0;
                  const isWorst = i === 0;
                  return (
                    <div key={stage.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: B.offWhite }}>{stage.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {dropOff > 0 && (
                            <span style={{ fontSize: 11, fontWeight: isWorst ? 800 : 500, color: isWorst ? B.red : B.muted }}>
                              {isWorst ? "⚠ " : ""}−{dropOff} lost
                            </span>
                          )}
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: B.white }}>
                            {stage.count}
                          </span>
                        </div>
                      </div>
                      <div style={{ height: 28, background: B.border, borderRadius: 6, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 10,
                          width: `${pct}%`, transition: "width 0.8s ease",
                          background: isWorst
                            ? `linear-gradient(90deg, ${B.red}, ${B.orange})`
                            : `linear-gradient(90deg, ${B.blue}, ${B.blueDark})`,
                          boxShadow: isWorst ? `0 0 12px ${B.red}50` : `0 0 10px ${B.blue}40`,
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{
                marginTop: 16, padding: "11px 14px",
                background: B.blueFade, border: `1px solid ${B.blue}40`, borderRadius: 10,
              }}>
                <p style={{ fontSize: 12, color: B.offWhite, lineHeight: 1.55, fontWeight: 500 }}>
                  💡 <strong style={{ color: B.blue }}>Convert 5 more calls next week</strong> = ~$2,560 added revenue. Zero extra marketing spend required.
                </p>
              </div>
            </section>

            {/* Tech Utilization */}
            <TechUtilization />

            {/* Revenue Chart */}
            <section className="card" style={{
              background: B.cardDark, borderRadius: 14, padding: 20, border: `1px solid ${B.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 800,
                    color: B.white, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                    Revenue vs. $40k Target
                  </h2>
                  <p style={{ fontSize: 12, color: B.muted, fontWeight: 500 }}>
                    Beat target 3 of last 4 weeks. Momentum is building.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {[
                    { color: B.blue,   label: "Actual", dashed: false },
                    { color: B.orange, label: "Target", dashed: true  },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "inline-block", width: 20, height: 0, borderTop: `2.5px ${l.dashed ? "dashed" : "solid"} ${l.color}` }}/>
                      <span style={{ fontSize: 11, color: B.muted, fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={revenueData} margin={{ top: 5, right: 8, left: -14, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={B.border} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: B.muted, fontFamily: "Montserrat", fontWeight: 600 }}
                    axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `$${v}k`}
                    tick={{ fontSize: 11, fill: B.muted, fontFamily: "Montserrat", fontWeight: 600 }}
                    axisLine={false} tickLine={false} domain={[25, 52]} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={40} stroke={B.orange} strokeDasharray="5 4" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="rev" stroke={B.blue} strokeWidth={2.5}
                    dot={{ r: 4, fill: B.blue, stroke: B.black, strokeWidth: 2 }}
                    activeDot={{ r: 7, stroke: `${B.cyan}80`, strokeWidth: 3, fill: B.blue }} />
                </LineChart>
              </ResponsiveContainer>
            </section>

          </div>{/* end main */}

          {/* ── Sidebar ── */}
          <div className="dashboard-sidebar" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Action Plan */}
            <div className="card" style={{
              background: B.cardDark, borderRadius: 14, overflow: "hidden",
              border: `1px solid ${B.blue}45`,
            }}>
              <div style={{
                padding: "16px 16px 14px",
                background: `linear-gradient(135deg, ${B.black}, #050e1c)`,
                borderBottom: `1px solid ${B.border}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 900,
                    color: B.white, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Action Plan
                  </h2>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: B.muted }}>
                    {doneCount}/{actions.length}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: B.muted, fontWeight: 500, marginBottom: 11 }}>
                  Check off as you move through the week
                </p>
                <div style={{ background: B.border, borderRadius: 999, height: 5 }}>
                  <div style={{
                    height: 5, borderRadius: 999,
                    background: `linear-gradient(90deg, ${B.blue}, ${B.cyan})`,
                    width: `${progress}%`, transition: "width 0.5s ease",
                    boxShadow: `0 0 10px ${B.cyan}50`,
                  }}/>
                </div>
                {doneCount > 0 && (
                  <p style={{ fontSize: 10, color: B.green, marginTop: 6, fontWeight: 700 }}>
                    {progress}% complete — keep going! 🎯
                  </p>
                )}
              </div>

              <div style={{ padding: "12px 14px" }}>
                {["Do Today", "This Week", "Track"].map(priority => {
                  const items = actions.filter(a => a.priority === priority);
                  const ps = priorityStyle[priority];
                  const emoji = { "Do Today": "🔴", "This Week": "🟠", "Track": "📊" }[priority];
                  return (
                    <div key={priority} style={{ marginBottom: 14 }}>
                      <p className="section-label" style={{ color: ps.color, padding: "0 2px", marginBottom: 7, display: "block" }}>
                        {emoji} {priority}
                      </p>
                      {items.map(action => (
                        <label key={action.id} style={{
                          display: "flex", gap: 9, alignItems: "flex-start",
                          padding: "9px 10px", marginBottom: 6, borderRadius: 9, cursor: "pointer",
                          border: `1px solid ${action.done ? B.green + "40" : ps.border}`,
                          background: action.done ? B.greenFade : ps.bg,
                          opacity: action.done ? 0.55 : 1, transition: "all 0.2s",
                        }}>
                          <input type="checkbox" checked={action.done} onChange={() => toggle(action.id)}
                            style={{ width: 15, height: 15, marginTop: 2, flexShrink: 0, accentColor: B.blue, cursor: "pointer" }}/>
                          <span style={{
                            fontSize: 12, color: action.done ? B.muted : B.offWhite, lineHeight: 1.55,
                            textDecoration: action.done ? "line-through" : "none", fontWeight: 500,
                          }}>{action.text}</span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>

              <div style={{ margin: "0 14px 14px", padding: "12px 14px",
                background: B.blueFade, border: `1px solid ${B.blue}35`, borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: B.offWhite, lineHeight: 1.6, fontWeight: 500 }}>
                  💰 Complete these actions → recover{" "}
                  <strong style={{ color: B.blue }}>$8,000–$12,000</strong> next week.
                </p>
              </div>
            </div>

            {/* What's Working */}
            <div className="card" style={{
              background: B.cardDark, borderRadius: 14, padding: 16,
              border: `1px solid ${B.green}40`,
            }}>
              <p className="section-label" style={{ color: B.green, marginBottom: 12, display: "block" }}>
                ✅ What's Working This Week
              </p>
              {[
                "Booking rate up 6% — CSRs are converting better on calls",
                "Sarah L. leads the team with a $512 avg ticket this week",
                "Revenue beat $40k target for the 3rd time this month",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, background: B.greenFade,
                    border: `1px solid ${B.green}40`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 800,
                    color: B.green, flexShrink: 0,
                  }}>↑</div>
                  <span style={{ fontSize: 12, color: B.offWhite, lineHeight: 1.55, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Powered by HSCP */}
            <div style={{
              borderRadius: 12, overflow: "hidden",
              border: `1px solid ${B.blue}30`,
              background: `linear-gradient(135deg, ${B.black}, #050e1c)`,
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${B.blue}, ${B.cyan}, ${B.orange}, ${B.blue})` }}/>
              <div style={{ padding: "16px 14px 14px", textAlign: "center" }}>
                <HSCPLogo />
                <div style={{
                  marginTop: 12, paddingTop: 10, borderTop: `1px solid ${B.border}`,
                  fontSize: 9, color: B.subtle, fontWeight: 500,
                  letterSpacing: "0.07em", textTransform: "uppercase", lineHeight: 1.8,
                }}>
                  Master Your Trade<br/>Scale Your Business · Own Your Future
                </div>
              </div>
            </div>

          </div>{/* end sidebar */}
        </div>{/* end grid */}

        <footer style={{
          marginTop: 36, textAlign: "center",
          fontSize: 10, color: B.subtle, fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Home Service Coaching Pros · Profit Intelligence · Jun 9–15, 2025
        </footer>
      </main>
    </div>
  );
}
