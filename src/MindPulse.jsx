import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// MINDPULSE — Full MVP
// "Heal Yourself. Heal the World."
// ═══════════════════════════════════════════════

const STORAGE_KEY = "mindpulse-user";
const MOODS_KEY = "mindpulse-moods";
const JOURNAL_KEY = "mindpulse-journal";
const CHAT_KEY = "mindpulse-chats";
const POINTS_KEY = "mindpulse-points";

// ── Zodiac Data ──
const ZODIAC = [
  { sign: "Capricorn", el: "Earth", start: [1,1], end: [1,19], icon: "♑", trait: "disciplined, ambitious, patient" },
  { sign: "Aquarius", el: "Air", start: [1,20], end: [2,18], icon: "♒", trait: "independent, humanitarian, visionary" },
  { sign: "Pisces", el: "Water", start: [2,19], end: [3,20], icon: "♓", trait: "empathetic, intuitive, creative" },
  { sign: "Aries", el: "Fire", start: [3,21], end: [4,19], icon: "♈", trait: "bold, energetic, pioneering" },
  { sign: "Taurus", el: "Earth", start: [4,20], end: [5,20], icon: "♉", trait: "grounded, sensual, reliable" },
  { sign: "Gemini", el: "Air", start: [5,21], end: [6,20], icon: "♊", trait: "curious, adaptable, communicative" },
  { sign: "Cancer", el: "Water", start: [6,21], end: [7,22], icon: "♋", trait: "nurturing, protective, deeply feeling" },
  { sign: "Leo", el: "Fire", start: [7,23], end: [8,22], icon: "♌", trait: "warm, generous, expressive" },
  { sign: "Virgo", el: "Earth", start: [8,23], end: [9,22], icon: "♍", trait: "analytical, caring, detail-oriented" },
  { sign: "Libra", el: "Air", start: [9,23], end: [10,22], icon: "♎", trait: "harmonious, fair, relationship-oriented" },
  { sign: "Scorpio", el: "Water", start: [10,23], end: [11,21], icon: "♏", trait: "intense, transformative, deeply loyal" },
  { sign: "Sagittarius", el: "Fire", start: [11,22], end: [12,21], icon: "♐", trait: "adventurous, philosophical, optimistic" },
  { sign: "Capricorn", el: "Earth", start: [12,22], end: [12,31], icon: "♑", trait: "disciplined, ambitious, patient" },
];

const getZodiac = (month, day) => {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
  }
  return ZODIAC[0];
};

const ELEMENT_STYLES = {
  Fire: { approach: "direct and energizing", coping: "movement, expression, creative outlets", color: "#E07A5F" },
  Earth: { approach: "grounded and practical", coping: "routine, nature, tangible progress", color: "#81B29A" },
  Air: { approach: "reflective and analytical", coping: "journaling, talking it through, reframing", color: "#6CA6C1" },
  Water: { approach: "gentle and emotionally attuned", coping: "feeling through it, creative expression, solitude", color: "#7B6D8D" },
};

const MOOD_EMOJIS = [
  { val: 1, emoji: "😞", label: "Struggling" },
  { val: 2, emoji: "😔", label: "Low" },
  { val: 3, emoji: "😐", label: "Okay" },
  { val: 4, emoji: "🙂", label: "Good" },
  { val: 5, emoji: "😊", label: "Great" },
];

const CAUSES = [
  { id: "trees", icon: "🌳", label: "Plant Trees", desc: "Reforestation worldwide" },
  { id: "ocean", icon: "🌊", label: "Clean Oceans", desc: "Remove ocean plastic" },
  { id: "water", icon: "💧", label: "Save Water", desc: "Clean water access" },
];

// ── Storage (localStorage for standalone deployment) ──
const store = {
  async get(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.error(e); }
  }
};

// ── Ambient Audio Engine ──
function useAmbient() {
  const ctxRef = useRef(null);
  const activeRef = useRef(false);
  const nodesRef = useRef([]);

  const start = useCallback(() => {
    if (activeRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      activeRef.current = true;
      const master = ctx.createGain();
      master.gain.value = 0.08;
      master.connect(ctx.destination);

      const freqs = [174, 196, 220, 261.6, 293.7];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0;
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.03 + i * 0.01;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.015;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        osc.connect(g);
        g.connect(master);
        osc.start();
        lfo.start();
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2 + i * 1.5);
        nodesRef.current.push({ osc, lfo, g });
      });
    } catch(e) { console.error("Audio:", e); }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    nodesRef.current.forEach(n => { try { n.osc.stop(); n.lfo.stop(); } catch{} });
    nodesRef.current = [];
    if (ctxRef.current) { try { ctxRef.current.close(); } catch{} }
  }, []);

  return { start, stop, active: activeRef };
}

// ── System Prompt Builder ──
function buildSystemPrompt(user) {
  const z = user?.zodiac;
  const el = z ? ELEMENT_STYLES[z.el] : null;
  return `You are MindPulse — a gentle best friend who speaks with the calm groundedness of a therapist, the warm protectiveness of an older sibling, and the depth of a spiritual guide.

CORE PERSONALITY:
- You are warm, present, and genuinely caring
- You never judge. You never rush. You hold space.
- You speak with quiet confidence — not overly peppy, not clinical
- You remember what the user shares and reference it naturally
- You use the user's name when it feels right
- You ask thoughtful follow-up questions but never overwhelm
- You validate feelings before offering perspectives
- You gently challenge unhelpful patterns when the time is right
- You celebrate small wins sincerely

THERAPEUTIC FRAMEWORKS (use naturally, never name them):
- CBT: Help identify thought patterns, gently reframe distortions
- DBT: Validate emotions, teach distress tolerance, encourage mindfulness
- Motivational Interviewing: Help users find their own motivation for change

${user?.name ? `The user's name is ${user.name}.` : ""}
${user?.painPoints ? `They've shared these struggles: "${user.painPoints}". Be sensitive to these themes throughout conversation.` : ""}
${z ? `ASTROLOGICAL PROFILE:
- Sun sign: ${z.sign} (${z.el} element) — ${z.trait}
- Element style: ${el.approach}
- Natural coping: ${el.coping}
Subtly adapt your communication style to their element. ${z.el === "Fire" ? "Be more direct and action-oriented." : z.el === "Earth" ? "Be practical and grounding." : z.el === "Air" ? "Be reflective and idea-oriented." : "Be emotionally gentle and intuitive."}
Do NOT mention their zodiac unless they bring it up first.` : ""}

SAFETY:
- If the user expresses suicidal ideation or self-harm intent, express care, take it seriously, and provide: 988 Suicide & Crisis Lifeline (call/text 988) and Crisis Text Line (text HOME to 741741). Never minimize crisis language.
- You are not a licensed therapist. If someone needs professional help, gently encourage it.
- Never diagnose conditions.

Keep responses warm but concise — 2-4 paragraphs max. This is a mobile app.`;
}

// ── Chat with Pollinations ──
// ── AI Chat Engine ──
// Uses Pollinations.ai free API (works from any browser, no API key needed)
// Falls back gracefully if unavailable
async function chatWithAI(messages, systemPrompt) {
  try {
    const apiMessages = [{ role: "system", content: systemPrompt }, ...messages];

    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: apiMessages,
        temperature: 0.75,
        stream: false,
      }),
    });

    const raw = await res.text();

    // Try parsing as OpenAI-format JSON
    try {
      const data = JSON.parse(raw);
      if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
    } catch {}

    // If response is plain text (some Pollinations endpoints return this)
    if (raw && raw.length > 10 && !raw.startsWith("{") && !raw.startsWith("<")) return raw;

    // Fallback: GET endpoint
    const lastMsg = messages[messages.length - 1]?.content || "hello";
    const getRes = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent("You are a warm, caring mental wellness companion. " + lastMsg)}?model=openai`
    );
    const getText = await getRes.text();
    if (getText && getText.length > 10) return getText;

    return "I hear you. Tell me more about what you're feeling right now — I'm here.";
  } catch(e) {
    console.error("Chat error:", e);
    return "I'm here with you. Could you try sharing that thought again? I want to make sure I hear you.";
  }
}

// ── Time-of-day gradient ──
function getTimeGradient() {
  const h = new Date().getHours();
  if (h < 6) return "linear-gradient(135deg, #0f1624 0%, #1a1a2e 50%, #16213e 100%)";
  if (h < 9) return "linear-gradient(135deg, #fdf6ec 0%, #f5e6d3 50%, #e8d5c4 100%)";
  if (h < 12) return "linear-gradient(135deg, #f4f1de 0%, #e8e4d0 50%, #f0ece0 100%)";
  if (h < 17) return "linear-gradient(135deg, #f4f1de 0%, #eaf5ec 50%, #e8f0f2 100%)";
  if (h < 20) return "linear-gradient(135deg, #f5e6d3 0%, #e8d0c0 50%, #d4a9a0 100%)";
  return "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1624 100%)";
}

function isDark() { const h = new Date().getHours(); return h < 6 || h >= 20; }

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════

export default function MindPulse() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [points, setPoints] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const ambient = useAmbient();
  const chatEndRef = useRef(null);
  const dark = isDark();
  const fg = dark ? "#e8e4d0" : "#1a1a2e";
  const fgMuted = dark ? "#a0a0a0" : "#777";
  const cardBg = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)";
  const inputBg = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)";

  // ── Load data on mount ──
  useEffect(() => {
    (async () => {
      const u = await store.get(STORAGE_KEY);
      const m = await store.get(MOODS_KEY) || [];
      const j = await store.get(JOURNAL_KEY) || [];
      const p = await store.get(POINTS_KEY) || 0;
      const c = await store.get(CHAT_KEY) || [];
      setUser(u); setMoods(m); setJournals(j); setPoints(p); setChatMessages(c);
      setScreen(u ? "home" : "welcome");
    })();
  }, []);

  // ── Save helpers ──
  const saveUser = async (u) => { setUser(u); await store.set(STORAGE_KEY, u); };
  const addPoints = async (n) => { const np = points + n; setPoints(np); await store.set(POINTS_KEY, np); };

  // ── Audio toggle ──
  const toggleAudio = () => {
    if (audioOn) { ambient.stop(); setAudioOn(false); }
    else { ambient.start(); setAudioOn(true); }
  };

  // ── Streak calc ──
  const getStreak = () => {
    if (!moods.length) return 0;
    const sorted = [...moods].sort((a,b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].date); d.setHours(0,0,0,0);
      const expected = new Date(today); expected.setDate(expected.getDate() - i);
      if (d.getTime() === expected.getTime()) streak++;
      else break;
    }
    return streak;
  };

  // ── Plant stage ──
  const getPlantStage = () => {
    const s = getStreak();
    if (s >= 30) return { emoji: "🌳", label: "Mighty Tree" };
    if (s >= 14) return { emoji: "🌿", label: "Growing Strong" };
    if (s >= 7) return { emoji: "🪴", label: "Taking Root" };
    if (s >= 3) return { emoji: "🌱", label: "Sprouting" };
    return { emoji: "🫘", label: "Seed" };
  };

  // ── Shared styles ──
  const btn = (primary = false) => ({
    padding: "14px 28px", border: "none", borderRadius: 16, cursor: "pointer",
    fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    background: primary ? "#0D5C63" : cardBg,
    color: primary ? "#fff" : fg,
    transition: "all 0.3s ease", width: "100%",
  });

  const card = {
    background: cardBg, borderRadius: 20, padding: "20px",
    backdropFilter: "blur(20px)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
  };

  // ══════════════════════════════════════════════
  // SCREENS
  // ══════════════════════════════════════════════

  // ── Welcome ──
  const WelcomeScreen = () => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState("");
    const [bMonth, setBMonth] = useState("");
    const [bDay, setBDay] = useState("");
    const [painText, setPainText] = useState("");
    const [cause, setCause] = useState("trees");

    const finish = async () => {
      const m = parseInt(bMonth); const d = parseInt(bDay);
      const zodiac = (m && d) ? getZodiac(m, d) : null;
      const u = { name, zodiac, painPoints: painText, cause, createdAt: new Date().toISOString() };
      await saveUser(u);
      await addPoints(100);
      setScreen("home");
    };

    const steps = [
      // Step 0: Welcome
      <div key={0} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>MindPulse</h1>
        <p style={{ color: fgMuted, fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>A safe space to talk, reflect, and grow.</p>
        <p style={{ color: "#81B29A", fontSize: 14, fontStyle: "italic", marginBottom: 32 }}>Heal yourself. Heal the world.</p>
        <button style={btn(true)} onClick={() => setStep(1)}>Begin Your Journey</button>
        <p style={{ color: fgMuted, fontSize: 12, marginTop: 16 }}>No account needed. Completely free. Forever.</p>
      </div>,
      // Step 1: Name
      <div key={1}>
        <p style={{ color: fgMuted, fontSize: 13, marginBottom: 4 }}>Step 1 of 4</p>
        <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>What should I call you?</h2>
        <p style={{ color: fgMuted, fontSize: 14, marginBottom: 20 }}>A first name or nickname. Whatever feels right.</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: 14, borderRadius: 14, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 16, color: fg, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button style={{ ...btn(), flex: 1 }} onClick={() => setStep(0)}>Back</button>
          <button style={{ ...btn(true), flex: 2 }} onClick={() => name.trim() && setStep(2)}>Continue</button>
        </div>
      </div>,
      // Step 2: Birthday (astro)
      <div key={2}>
        <p style={{ color: fgMuted, fontSize: 13, marginBottom: 4 }}>Step 2 of 4</p>
        <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>When were you born?</h2>
        <p style={{ color: fgMuted, fontSize: 14, marginBottom: 20 }}>This helps me understand you on a deeper level through your astrological profile.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={bMonth} onChange={e => setBMonth(e.target.value)} style={{ flex: 1, padding: 14, borderRadius: 14, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 15, color: fg, fontFamily: "'DM Sans', sans-serif" }}>
            <option value="">Month</option>
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select value={bDay} onChange={e => setBDay(e.target.value)} style={{ flex: 1, padding: 14, borderRadius: 14, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 15, color: fg, fontFamily: "'DM Sans', sans-serif" }}>
            <option value="">Day</option>
            {Array.from({length:31},(_,i) => <option key={i} value={i+1}>{i+1}</option>)}
          </select>
        </div>
        {bMonth && bDay && (() => {
          const z = getZodiac(parseInt(bMonth), parseInt(bDay));
          const el = ELEMENT_STYLES[z.el];
          return <div style={{ ...card, marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{z.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: el.color, marginTop: 4 }}>{z.sign}</div>
            <div style={{ fontSize: 13, color: fgMuted, marginTop: 4 }}>{z.el} Element — {z.trait}</div>
          </div>;
        })()}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button style={{ ...btn(), flex: 1 }} onClick={() => setStep(1)}>Back</button>
          <button style={{ ...btn(true), flex: 2 }} onClick={() => setStep(3)}>{bMonth && bDay ? "Continue" : "Skip"}</button>
        </div>
      </div>,
      // Step 3: Pain points
      <div key={3}>
        <p style={{ color: fgMuted, fontSize: 13, marginBottom: 4 }}>Step 3 of 4</p>
        <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>What brings you here?</h2>
        <p style={{ color: fgMuted, fontSize: 14, marginBottom: 20 }}>Share whatever you're comfortable with. This stays between us and helps me support you better.</p>
        <textarea value={painText} onChange={e => setPainText(e.target.value)} placeholder="I've been dealing with..." rows={5} style={{ width: "100%", padding: 14, borderRadius: 14, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 15, color: fg, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box", lineHeight: 1.5 }} />
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button style={{ ...btn(), flex: 1 }} onClick={() => setStep(2)}>Back</button>
          <button style={{ ...btn(true), flex: 2 }} onClick={() => setStep(4)}>{painText.trim() ? "Continue" : "Skip"}</button>
        </div>
      </div>,
      // Step 4: Choose cause
      <div key={4}>
        <p style={{ color: fgMuted, fontSize: 13, marginBottom: 4 }}>Step 4 of 4</p>
        <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Choose your cause</h2>
        <p style={{ color: fgMuted, fontSize: 14, marginBottom: 20 }}>As you grow, the world grows with you. Your daily check-ins drive real impact.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CAUSES.map(c => (
            <button key={c.id} onClick={() => setCause(c.id)} style={{ ...card, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: cause === c.id ? "2px solid #0D5C63" : dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)", textAlign: "left" }}>
              <span style={{ fontSize: 28 }}>{c.icon}</span>
              <div><div style={{ fontWeight: 700, color: fg, fontSize: 15 }}>{c.label}</div><div style={{ fontSize: 13, color: fgMuted }}>{c.desc}</div></div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button style={{ ...btn(), flex: 1 }} onClick={() => setStep(3)}>Back</button>
          <button style={{ ...btn(true), flex: 2 }} onClick={finish}>Enter MindPulse</button>
        </div>
      </div>,
    ];
    return steps[step];
  };

  // ── Home Dashboard ──
  const HomeScreen = () => {
    const plant = getPlantStage();
    const streak = getStreak();
    const todayStr = new Date().toISOString().split("T")[0];
    const checkedInToday = moods.some(m => m.date === todayStr);
    const treesPlanted = Math.floor(points / 500);
    const nextTreeAt = 500 - (points % 500);

    return <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, color: fg, margin: 0, fontFamily: "'Playfair Display', serif" }}>Hi, {user?.name} 🌿</h1>
          <p style={{ color: fgMuted, fontSize: 13, margin: "4px 0 0" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={toggleAudio} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", opacity: 0.7 }}>{audioOn ? "🔊" : "🔇"}</button>
      </div>

      {/* Plant + Streak */}
      <div style={{ ...card, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 52, marginBottom: 4, transition: "all 0.5s" }}>{plant.emoji}</div>
        <div style={{ fontWeight: 700, color: fg, fontSize: 15 }}>{plant.label}</div>
        <div style={{ color: fgMuted, fontSize: 13, marginTop: 2 }}>
          {streak > 0 ? `🔥 ${streak}-day streak` : "Start your streak today"}
        </div>
      </div>

      {/* Pulse Points */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: fgMuted }}>Pulse Points</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#E07A5F" }}>{points}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: fgMuted }}>{CAUSES.find(c => c.id === user?.cause)?.icon} Impact</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#81B29A" }}>{treesPlanted} {user?.cause === "ocean" ? "lbs cleaned" : user?.cause === "water" ? "L saved" : "trees"}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, height: 6, background: dark ? "rgba(255,255,255,0.1)" : "#eee", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((500 - nextTreeAt) / 500) * 100}%`, background: "linear-gradient(90deg, #81B29A, #0D5C63)", borderRadius: 3, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 11, color: fgMuted, marginTop: 4 }}>{nextTreeAt} points to next impact</div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { icon: "💬", label: "Talk", screen: "chat" },
          { icon: checkedInToday ? "✅" : "🌤", label: checkedInToday ? "Done" : "Check In", screen: checkedInToday ? null : "checkin" },
          { icon: "📓", label: "Journal", screen: "journal" },
          { icon: "🌬", label: "Breathe", screen: "breathe" },
        ].map((a, i) => (
          <button key={i} onClick={() => a.screen && setScreen(a.screen)} style={{ ...card, border: "none", cursor: a.screen ? "pointer" : "default", textAlign: "center", padding: 18, opacity: a.screen ? 1 : 0.5 }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: fg }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Mood History Mini */}
      {moods.length > 0 && <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: fg, marginBottom: 10 }}>Recent Moods</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          {moods.slice(-7).map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{MOOD_EMOJIS[m.val - 1]?.emoji}</div>
              <div style={{ fontSize: 9, color: fgMuted }}>{new Date(m.date).toLocaleDateString("en-US", { weekday: "short" })}</div>
            </div>
          ))}
        </div>
      </div>}

      {/* Crisis footer */}
      <div style={{ textAlign: "center", marginTop: 20, padding: 12, borderRadius: 12, background: dark ? "rgba(224,122,95,0.1)" : "rgba(224,122,95,0.08)" }}>
        <div style={{ fontSize: 12, color: "#E07A5F", fontWeight: 600 }}>In crisis? You're not alone.</div>
        <div style={{ fontSize: 11, color: fgMuted, marginTop: 2 }}>988 Lifeline (call/text 988) • Crisis Text: HOME to 741741</div>
      </div>
    </div>;
  };

  // ── Check-in Screen ──
  const CheckInScreen = () => {
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(false);

    const save = async () => {
      if (!selected) return;
      const entry = { val: selected, note, date: new Date().toISOString().split("T")[0], time: new Date().toISOString() };
      const updated = [...moods, entry];
      setMoods(updated); await store.set(MOODS_KEY, updated);
      await addPoints(10);
      const s = getStreak();
      if (s === 7) await addPoints(50);
      if (s === 30) await addPoints(200);
      setSaved(true);
      setTimeout(() => setScreen("home"), 1500);
    };

    if (saved) return <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>✨</div>
      <h2 style={{ color: fg, fontFamily: "'Playfair Display', serif" }}>Checked in. +10 points.</h2>
      <p style={{ color: fgMuted, fontSize: 14 }}>Thank you for showing up today.</p>
    </div>;

    return <div>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: fgMuted, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>How are you feeling?</h2>
      <p style={{ color: fgMuted, fontSize: 14, marginBottom: 20 }}>No right or wrong answer. Just honesty.</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        {MOOD_EMOJIS.map(m => (
          <button key={m.val} onClick={() => setSelected(m.val)} style={{ background: selected === m.val ? (dark ? "rgba(255,255,255,0.15)" : "rgba(13,92,99,0.1)") : "transparent", border: selected === m.val ? "2px solid #0D5C63" : "2px solid transparent", borderRadius: 16, padding: "12px 8px", cursor: "pointer", textAlign: "center", flex: 1, margin: "0 3px", transition: "all 0.2s" }}>
            <div style={{ fontSize: 30 }}>{m.emoji}</div>
            <div style={{ fontSize: 10, color: fg, marginTop: 4 }}>{m.label}</div>
          </button>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Anything you want to add? (optional)" rows={3} style={{ width: "100%", padding: 14, borderRadius: 14, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 14, color: fg, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} />
      <button onClick={save} disabled={!selected} style={{ ...btn(!!selected), marginTop: 16, opacity: selected ? 1 : 0.4 }}>Log Mood</button>
    </div>;
  };

  // ── Chat Screen ──
  const sendChatMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg = { role: "user", content: inputText.trim() };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated); setInputText(""); setIsTyping(true);
    const sysPrompt = buildSystemPrompt(user);
    const reply = await chatWithAI(updated.slice(-20), sysPrompt);
    const withReply = [...updated, { role: "assistant", content: reply }];
    setChatMessages(withReply); setIsTyping(false);
    await store.set(CHAT_KEY, withReply.slice(-50));
  };

  const renderChat = () => {
    return <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "70vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: fgMuted, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
        <span style={{ fontSize: 13, color: fgMuted }}>MindPulse 🌿</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
        {chatMessages.length === 0 && <div style={{ textAlign: "center", paddingTop: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <p style={{ color: fgMuted, fontSize: 14, lineHeight: 1.6 }}>This is your safe space, {user?.name}.<br/>Say whatever's on your mind.</p>
        </div>}

        {chatMessages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "#0D5C63" : cardBg, color: m.role === "user" ? "#fff" : fg, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && <div style={{ display: "flex", marginBottom: 10 }}>
          <div style={{ padding: "12px 20px", borderRadius: "18px 18px 18px 4px", background: cardBg, color: fgMuted, fontSize: 14 }}>
            <span style={{ animation: "pulse 1.5s infinite" }}>thinking...</span>
          </div>
        </div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8, position: "sticky", bottom: 0, paddingBottom: 4 }}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
          placeholder="Share what's on your mind..."
          autoComplete="off"
          autoCorrect="on"
          spellCheck="true"
          enterKeyHint="send"
          style={{ flex: 1, padding: 14, borderRadius: 20, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 16, color: fg, fontFamily: "'DM Sans', sans-serif", WebkitAppearance: "none" }}
        />
        <button onClick={sendChatMessage} disabled={isTyping} style={{ padding: "14px 18px", borderRadius: 20, border: "none", background: isTyping ? "#666" : "#0D5C63", color: "#fff", fontSize: 16, cursor: isTyping ? "default" : "pointer", flexShrink: 0 }}>↑</button>
      </div>
    </div>;
  };

  // ── Chat auto-scroll ──
  useEffect(() => { if (screen === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping, screen]);

  // ── Journal Screen ──
  const JournalScreen = () => {
    const [entry, setEntry] = useState("");
    const [saved, setSaved] = useState(false);
    const [view, setView] = useState("write");

    const save = async () => {
      if (!entry.trim()) return;
      const j = { text: entry, date: new Date().toISOString() };
      const updated = [...journals, j];
      setJournals(updated); await store.set(JOURNAL_KEY, updated);
      await addPoints(25);
      setSaved(true);
      setTimeout(() => { setSaved(false); setEntry(""); setView("list"); }, 1500);
    };

    if (saved) return <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>📓</div>
      <h2 style={{ color: fg, fontFamily: "'Playfair Display', serif" }}>Saved. +25 points.</h2>
      <p style={{ color: fgMuted, fontSize: 14 }}>Your words are safe here.</p>
    </div>;

    return <div>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: fgMuted, fontSize: 14, cursor: "pointer", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setView("write")} style={{ ...btn(view === "write"), flex: 1, padding: "10px 0" }}>Write</button>
        <button onClick={() => setView("list")} style={{ ...btn(view === "list"), flex: 1, padding: "10px 0" }}>Past Entries ({journals.length})</button>
      </div>

      {view === "write" ? <>
        <h2 style={{ fontSize: 20, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>What's on your heart?</h2>
        <textarea value={entry} onChange={e => setEntry(e.target.value)} placeholder="Write freely. No one else will ever read this..." rows={8} style={{ width: "100%", padding: 16, borderRadius: 16, border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #ddd", background: inputBg, fontSize: 15, color: fg, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
        <button onClick={save} disabled={!entry.trim()} style={{ ...btn(!!entry.trim()), marginTop: 12, opacity: entry.trim() ? 1 : 0.4 }}>Save Entry</button>
      </> : <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {journals.length === 0 ? <p style={{ color: fgMuted, textAlign: "center", paddingTop: 40, fontSize: 14 }}>Your journal is waiting for you.</p>
        : [...journals].reverse().map((j, i) => (
          <div key={i} style={{ ...card, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: fgMuted, marginBottom: 6 }}>{new Date(j.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
            <div style={{ fontSize: 14, color: fg, lineHeight: 1.5 }}>{j.text}</div>
          </div>
        ))}
      </div>}
    </div>;
  };

  // ── Breathing Screen ──
  const BreatheScreen = () => {
    const [active, setActive] = useState(false);
    const [phase, setPhase] = useState("");
    const [count, setCount] = useState(0);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef(null);

    const startBreathing = () => {
      setActive(true); setCycles(0);
      let step = 0;
      const pattern = [
        ...Array(4).fill("Breathe in..."),
        ...Array(7).fill("Hold..."),
        ...Array(8).fill("Breathe out..."),
      ];
      let c = 0;
      intervalRef.current = setInterval(() => {
        setPhase(pattern[step % pattern.length]);
        setCount(step % pattern.length < 4 ? (step % pattern.length) + 1 : step % pattern.length < 11 ? (step % pattern.length) - 3 : (step % pattern.length) - 10);
        step++;
        if (step % 19 === 0) { c++; setCycles(c); }
        if (c >= 4) {
          clearInterval(intervalRef.current); setActive(false); setPhase("Complete"); addPoints(15);
        }
      }, 1000);
    };

    useEffect(() => () => clearInterval(intervalRef.current), []);

    return <div style={{ textAlign: "center" }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: fgMuted, fontSize: 14, cursor: "pointer", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", display: "block" }}>← Back</button>
      <h2 style={{ fontSize: 22, color: fg, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>4-7-8 Breathing</h2>
      <p style={{ color: fgMuted, fontSize: 14, marginBottom: 30 }}>4 cycles. Let the rhythm calm your nervous system.</p>

      <div style={{ width: 180, height: 180, borderRadius: "50%", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: active ? (phase?.includes("in") ? "rgba(129,178,154,0.2)" : phase?.includes("Hold") ? "rgba(108,166,193,0.2)" : "rgba(123,109,141,0.2)") : cardBg, border: `3px solid ${active ? "#81B29A" : (dark ? "rgba(255,255,255,0.1)" : "#ddd")}`, transition: "all 1s ease", transform: active && phase?.includes("in") ? "scale(1.15)" : "scale(1)" }}>
        {active ? <>
          <div style={{ fontSize: 16, color: fg, fontWeight: 600 }}>{phase}</div>
          <div style={{ fontSize: 36, color: "#0D5C63", fontWeight: 700, marginTop: 4 }}>{count}</div>
        </> : phase === "Complete" ? <>
          <div style={{ fontSize: 36 }}>✨</div>
          <div style={{ fontSize: 14, color: fg, marginTop: 8 }}>+15 points</div>
        </> : <div style={{ fontSize: 36 }}>🌬</div>}
      </div>

      <div style={{ color: fgMuted, fontSize: 13, marginBottom: 20 }}>{active ? `Cycle ${cycles + 1} of 4` : phase === "Complete" ? "Well done. Take a moment." : "Tap to begin"}</div>
      {!active && <button onClick={startBreathing} style={btn(true)}>{phase === "Complete" ? "Again" : "Start"}</button>}
    </div>;
  };

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════

  const screens = { welcome: WelcomeScreen, home: HomeScreen, checkin: CheckInScreen, journal: JournalScreen, breathe: BreatheScreen };
  const Screen = screens[screen];

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin: 0; overflow-x: hidden; }
      input, textarea, select, button { outline: none; }
      input, textarea { font-size: 16px !important; }
      ::-webkit-scrollbar { width: 0; }
    `}</style>
    <div style={{
      minHeight: "100vh", background: getTimeGradient(),
      fontFamily: "'DM Sans', sans-serif", color: fg,
      transition: "background 60s linear",
    }}>
      <div style={{
        maxWidth: 420, margin: "0 auto", padding: "24px 20px 40px",
        animation: "fadeIn 0.5s ease",
      }}>
        {screen === "loading" ? <div style={{ textAlign: "center", paddingTop: 120 }}>
          <div style={{ fontSize: 48 }}>🌿</div>
          <p style={{ color: fgMuted, marginTop: 12 }}>Loading...</p>
        </div> : screen === "chat" ? renderChat() : Screen && <Screen />}
      </div>
    </div>
  </>;
}
