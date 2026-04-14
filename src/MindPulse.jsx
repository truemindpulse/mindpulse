import { useState, useEffect, useRef, useCallback, useMemo } from “react”;

// ═══════════════════════════════════════════════════════════
// MINDPULSE — “Heal Yourself, Heal the World”
// A living, breathing AI wellness companion
// ═══════════════════════════════════════════════════════════

// ─── ZODIAC DATA ───
const ZODIAC_SIGNS = [
{ sign: “Aries”, symbol: “♈”, dates: “Mar 21 – Apr 19”, element: “Fire”, ruling: “Mars”, trait: “courage”, energy: “You lead with fire. MindPulse will match your intensity and channel it toward inner peace.” },
{ sign: “Taurus”, symbol: “♉”, dates: “Apr 20 – May 20”, element: “Earth”, ruling: “Venus”, trait: “stability”, energy: “You seek grounding. MindPulse will be your sanctuary of calm and beauty.” },
{ sign: “Gemini”, symbol: “♊”, dates: “May 21 – Jun 20”, element: “Air”, ruling: “Mercury”, trait: “curiosity”, energy: “Your mind never rests. MindPulse will help you find stillness within the storm of thoughts.” },
{ sign: “Cancer”, symbol: “♋”, dates: “Jun 21 – Jul 22”, element: “Water”, ruling: “Moon”, trait: “intuition”, energy: “You feel everything deeply. MindPulse will honor your sensitivity as a superpower.” },
{ sign: “Leo”, symbol: “♌”, dates: “Jul 23 – Aug 22”, element: “Fire”, ruling: “Sun”, trait: “radiance”, energy: “You shine for others. MindPulse will help you shine for yourself first.” },
{ sign: “Virgo”, symbol: “♍”, dates: “Aug 23 – Sep 22”, element: “Earth”, ruling: “Mercury”, trait: “clarity”, energy: “You analyze everything. MindPulse will help you feel without overthinking.” },
{ sign: “Libra”, symbol: “♎”, dates: “Sep 23 – Oct 22”, element: “Air”, ruling: “Venus”, trait: “harmony”, energy: “You seek balance in all things. MindPulse will help you find it within.” },
{ sign: “Scorpio”, symbol: “♏”, dates: “Oct 23 – Nov 21”, element: “Water”, ruling: “Pluto”, trait: “depth”, energy: “You transform through intensity. MindPulse will be your safe space to dive deep.” },
{ sign: “Sagittarius”, symbol: “♐”, dates: “Nov 22 – Dec 21”, element: “Fire”, ruling: “Jupiter”, trait: “wisdom”, energy: “You seek truth everywhere. MindPulse will help you find it inside yourself.” },
{ sign: “Capricorn”, symbol: “♑”, dates: “Dec 22 – Jan 19”, element: “Earth”, ruling: “Saturn”, trait: “resilience”, energy: “You carry the weight of the world. MindPulse will help you set it down.” },
{ sign: “Aquarius”, symbol: “♒”, dates: “Jan 20 – Feb 18”, element: “Air”, ruling: “Uranus”, trait: “vision”, energy: “You think beyond boundaries. MindPulse will help you connect mind to heart.” },
{ sign: “Pisces”, symbol: “♓”, dates: “Feb 19 – Mar 20”, element: “Water”, ruling: “Neptune”, trait: “empathy”, energy: “You absorb the world’s emotions. MindPulse will help you protect your energy.” },
];

const getZodiacFromDate = (month, day) => {
// Correct zodiac date boundaries
if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];  // Aries
if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];  // Taurus
if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];  // Gemini
if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];  // Cancer
if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];  // Leo
if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];  // Virgo
if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7]; // Scorpio
if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8]; // Sagittarius
if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];  // Capricorn
if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];  // Aquarius
if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS[11];  // Pisces
return ZODIAC_SIGNS[0];
};

// Zodiac compatibility — best match + why
const ZODIAC_COMPATIBILITY = {
Aries:       { match: “Leo”,         emoji: “🔥”, reason: “Two fires that fuel each other — passionate, bold, and unstoppable together” },
Taurus:      { match: “Cancer”,      emoji: “🌿”, reason: “Earth meets water — nurturing, loyal, and deeply secure in each other” },
Gemini:      { match: “Aquarius”,    emoji: “💨”, reason: “Two brilliant minds — endless conversation, freedom, and intellectual spark” },
Cancer:      { match: “Pisces”,      emoji: “🌊”, reason: “Deep emotional understanding — two souls that feel each other without words” },
Leo:         { match: “Sagittarius”, emoji: “✨”, reason: “Fire and adventure — you inspire each other to dream bigger and shine brighter” },
Virgo:       { match: “Taurus”,      emoji: “🌸”, reason: “Earth harmony — grounded, patient, and building something beautiful together” },
Libra:       { match: “Gemini”,      emoji: “🎭”, reason: “Air and charm — witty, social, and effortlessly in sync” },
Scorpio:     { match: “Cancer”,      emoji: “🌙”, reason: “Emotional depth meets fierce loyalty — an unbreakable bond” },
Sagittarius: { match: “Aries”,       emoji: “🏹”, reason: “Fire and freedom — adventurous spirits who never hold each other back” },
Capricorn:   { match: “Virgo”,       emoji: “⛰️”, reason: “Two earth signs building empires — disciplined, devoted, and unstoppable” },
Aquarius:    { match: “Libra”,       emoji: “🌐”, reason: “Visionary minds — progressive, fair, and deeply connected through ideas” },
Pisces:      { match: “Scorpio”,     emoji: “🔮”, reason: “Mystical connection — intuitive, transformative, and spiritually bonded” },
};

// ─── INTENTION OPTIONS ───
const INTENTIONS = [
{ id: “anxiety”, label: “Tame My Anxiety”, icon: “🌊”, desc: “Find calm in the chaos” },
{ id: “sleep”, label: “Sleep Better”, icon: “🌙”, desc: “Quiet the mind at night” },
{ id: “grief”, label: “Process Grief”, icon: “🕊️”, desc: “Honor what you’ve lost” },
{ id: “growth”, label: “Grow Spiritually”, icon: “🌱”, desc: “Expand your consciousness” },
{ id: “stress”, label: “Manage Stress”, icon: “⚡”, desc: “Release the pressure” },
{ id: “confidence”, label: “Build Confidence”, icon: “🔥”, desc: “Reclaim your power” },
{ id: “relationships”, label: “Heal Relationships”, icon: “💫”, desc: “Repair and reconnect” },
{ id: “purpose”, label: “Find Purpose”, icon: “🧭”, desc: “Discover your path” },
];

// ─── MOOD SPECTRUM ───
const MOODS = [
{ id: “radiant”, label: “Radiant”, emoji: “✨”, color: “#FFD700”, gradient: “linear-gradient(135deg, #FFD700 0%, #FFA500 100%)”, desc: “Glowing from within” },
{ id: “peaceful”, label: “Peaceful”, emoji: “🕊️”, color: “#7ECFC0”, gradient: “linear-gradient(135deg, #7ECFC0 0%, #4AA8A0 100%)”, desc: “Still waters” },
{ id: “hopeful”, label: “Hopeful”, emoji: “🌅”, color: “#FF9A76”, gradient: “linear-gradient(135deg, #FF9A76 0%, #FECF71 100%)”, desc: “Light on the horizon” },
{ id: “neutral”, label: “Neutral”, emoji: “🌫️”, color: “#B0BEC5”, gradient: “linear-gradient(135deg, #B0BEC5 0%, #78909C 100%)”, desc: “Just existing” },
{ id: “anxious”, label: “Anxious”, emoji: “🌀”, color: “#CE93D8”, gradient: “linear-gradient(135deg, #CE93D8 0%, #9C27B0 100%)”, desc: “Mind racing” },
{ id: “heavy”, label: “Heavy”, emoji: “🌧️”, color: “#5C6BC0”, gradient: “linear-gradient(135deg, #5C6BC0 0%, #3949AB 100%)”, desc: “Carrying weight” },
{ id: “lost”, label: “Lost”, emoji: “🌑”, color: “#455A64”, gradient: “linear-gradient(135deg, #455A64 0%, #263238 100%)”, desc: “Can’t see the path” },
{ id: “angry”, label: “Frustrated”, emoji: “🔥”, color: “#EF5350”, gradient: “linear-gradient(135deg, #EF5350 0%, #C62828 100%)”, desc: “Heat rising” },
];

// ─── BREATHING EXERCISES ───
const BREATHWORK = [
{
id: “calm”,
name: “4-7-8 Calm”,
desc: “The anti-anxiety breath”,
icon: “🌊”,
phases: [
{ label: “Breathe In”, duration: 4, color: “#7ECFC0” },
{ label: “Hold”, duration: 7, color: “#5C6BC0” },
{ label: “Breathe Out”, duration: 8, color: “#CE93D8” },
],
cycles: 4,
},
{
id: “box”,
name: “Box Breathing”,
desc: “Navy SEAL focus technique”,
icon: “⬜”,
phases: [
{ label: “Breathe In”, duration: 4, color: “#7ECFC0” },
{ label: “Hold”, duration: 4, color: “#5C6BC0” },
{ label: “Breathe Out”, duration: 4, color: “#CE93D8” },
{ label: “Hold”, duration: 4, color: “#FF9A76” },
],
cycles: 4,
},
{
id: “energize”,
name: “Energizing Breath”,
desc: “Wake up your nervous system”,
icon: “⚡”,
phases: [
{ label: “Sharp In”, duration: 2, color: “#FFD700” },
{ label: “Power Out”, duration: 2, color: “#EF5350” },
],
cycles: 8,
},
{
id: “sleep”,
name: “Sleep Descent”,
desc: “Drift into deep rest”,
icon: “🌙”,
phases: [
{ label: “Gentle In”, duration: 4, color: “#3949AB” },
{ label: “Soft Hold”, duration: 7, color: “#1A237E” },
{ label: “Long Out”, duration: 10, color: “#0D1B2A” },
],
cycles: 3,
},
];

// ─── GROUNDING EXERCISES ───
const GROUNDING_EXERCISES = [
{ id: “5senses”, name: “5-4-3-2-1 Senses”, icon: “👁️”, desc: “Anchor to the present moment”, steps: [
{ prompt: “Name 5 things you can SEE right now”, sense: “sight”, count: 5 },
{ prompt: “Name 4 things you can TOUCH”, sense: “touch”, count: 4 },
{ prompt: “Name 3 things you can HEAR”, sense: “hearing”, count: 3 },
{ prompt: “Name 2 things you can SMELL”, sense: “smell”, count: 2 },
{ prompt: “Name 1 thing you can TASTE”, sense: “taste”, count: 1 },
]},
{ id: “bodyscan”, name: “Body Scan”, icon: “🧘”, desc: “Release tension from head to toe”, regions: [
“Crown of your head”, “Forehead & temples”, “Jaw & throat”,
“Shoulders & neck”, “Chest & heart space”, “Belly & solar plexus”,
“Hips & lower back”, “Legs & knees”, “Feet & toes”
]},
{ id: “affirmation”, name: “Mirror Work”, icon: “🪞”, desc: “Rewire your inner dialogue”, affirmations: [
“I am exactly where I need to be”,
“My feelings are valid and temporary”,
“I choose peace over perfection”,
“I am worthy of love and rest”,
“I release what I cannot control”,
]},
];

// ─── JOURNAL PROMPTS ───
const JOURNAL_PROMPTS = [
“What emotion is asking for your attention right now?”,
“Write a letter to your younger self. What do they need to hear?”,
“What are you holding onto that no longer serves you?”,
“Describe your perfect day in vivid detail.”,
“What boundary do you need to set this week?”,
“What would you do if you weren’t afraid?”,
“Name three things your body is grateful for today.”,
“What pattern keeps showing up in your life?”,
“If your anxiety had a voice, what would it say? Now respond to it.”,
“What does your soul need that your mind keeps ignoring?”,
];

// ─── STYLES ───
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');`;

const CSS = `

- { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
  –void: #0A0A0F;
  –deep: #111118;
  –surface: #1A1A24;
  –surface2: #22222F;
  –glass: rgba(255,255,255,0.04);
  –glass2: rgba(255,255,255,0.08);
  –glass3: rgba(255,255,255,0.12);
  –text: #E8E6F0;
  –text2: rgba(232,230,240,0.6);
  –text3: rgba(232,230,240,0.35);
  –accent: #7ECFC0;
  –accent2: #CE93D8;
  –accent3: #FFD700;
  –glow: rgba(126,207,192,0.15);
  –glow2: rgba(206,147,216,0.15);
  –serif: ‘Cormorant Garamond’, Georgia, serif;
  –sans: ‘DM Sans’, system-ui, sans-serif;
  –mono: ‘Space Mono’, monospace;
  –radius: 20px;
  –radius-sm: 12px;
  }
  body {
  background: var(–void);
  color: var(–text);
  font-family: var(–sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  }
  input, textarea, button, select {
  font-family: inherit;
  border: none;
  outline: none;
  background: none;
  color: inherit;
  }
  button { cursor: pointer; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(–glass2); border-radius: 10px; }

@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse-glow { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
@keyframes breathe-ring { 0%{transform:scale(0.8);opacity:0.3} 50%{transform:scale(1.2);opacity:0.8} 100%{transform:scale(0.8);opacity:0.3} }
@keyframes slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes slide-in-right { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes fade-in { from{opacity:0} to{opacity:1} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
@keyframes morph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
@keyframes typewriter { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
@keyframes ripple { 0%{transform:scale(0);opacity:0.5} 100%{transform:scale(4);opacity:0} }
@keyframes scan-line { 0%{top:-10%} 100%{top:110%} }
@keyframes glow-text { 0%,100%{text-shadow:0 0 10px rgba(126,207,192,0.3)} 50%{text-shadow:0 0 25px rgba(126,207,192,0.6),0 0 50px rgba(126,207,192,0.3)} }
`;

// ─── AMBIENT PARTICLES COMPONENT ───
const AmbientField = () => {
const canvasRef = useRef(null);
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext(“2d”);
let raf;
const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
resize();
window.addEventListener(“resize”, resize);
const particles = Array.from({ length: 50 }, () => ({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
r: Math.random() * 2 + 0.5,
dx: (Math.random() - 0.5) * 0.3,
dy: (Math.random() - 0.5) * 0.3,
opacity: Math.random() * 0.4 + 0.1,
hue: Math.random() > 0.5 ? 170 : 290,
}));
const draw = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
particles.forEach((p) => {
p.x += p.dx; p.y += p.dy;
if (p.x < 0) p.x = canvas.width;
if (p.x > canvas.width) p.x = 0;
if (p.y < 0) p.y = canvas.height;
if (p.y > canvas.height) p.y = 0;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
ctx.fill();
});
raf = requestAnimationFrame(draw);
};
draw();
return () => { cancelAnimationFrame(raf); window.removeEventListener(“resize”, resize); };
}, []);
return <canvas ref={canvasRef} style={{ position: “fixed”, inset: 0, zIndex: 0, pointerEvents: “none” }} />;
};

// ─── SOUNDSCAPE ENGINE ───
const useSoundscape = () => {
const ctxRef = useRef(null);
const nodesRef = useRef([]);
const [playing, setPlaying] = useState(false);

const start = useCallback(() => {
if (ctxRef.current) return;
const ctx = new (window.AudioContext || window.webkitAudioContext)();
ctxRef.current = ctx;
const master = ctx.createGain();
master.gain.value = 0.12;
master.connect(ctx.destination);

```
// Pad drone
[174, 261, 349].forEach((freq) => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.value = 0.08;
  osc.connect(g).connect(master);
  osc.start();
  nodesRef.current.push(osc);
  // Subtle vibrato
  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.1 + Math.random() * 0.2;
  lfoG.gain.value = 1.5;
  lfo.connect(lfoG).connect(osc.frequency);
  lfo.start();
  nodesRef.current.push(lfo);
});

// Binaural shimmer
const binL = ctx.createOscillator();
const binR = ctx.createOscillator();
const panL = ctx.createStereoPanner();
const panR = ctx.createStereoPanner();
const bG = ctx.createGain();
bG.gain.value = 0.04;
binL.frequency.value = 200;
binR.frequency.value = 210;
panL.pan.value = -1;
panR.pan.value = 1;
binL.connect(panL).connect(bG).connect(master);
binR.connect(panR).connect(bG);
binL.start(); binR.start();
nodesRef.current.push(binL, binR);

setPlaying(true);
```

}, []);

const stop = useCallback(() => {
nodesRef.current.forEach((n) => { try { n.stop(); } catch(e){} });
nodesRef.current = [];
if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
setPlaying(false);
}, []);

const toggle = useCallback(() => { playing ? stop() : start(); }, [playing, start, stop]);

return { playing, toggle };
};

// ─── PULSE POINTS SYSTEM ───
const usePulsePoints = () => {
const [points, setPoints] = useState(() => {
try { return parseInt(localStorage.getItem(“mp_points”) || “0”); } catch { return 0; }
});
const [streak, setStreak] = useState(() => {
try { return parseInt(localStorage.getItem(“mp_streak”) || “0”); } catch { return 0; }
});
const earn = useCallback((amount) => {
setPoints((p) => {
const n = p + amount;
try { localStorage.setItem(“mp_points”, n); } catch {}
return n;
});
}, []);
return { points, streak, earn, setStreak };
};

// ─── HAPTIC FEEDBACK ───
const haptic = (style = “light”) => {
try { navigator.vibrate && navigator.vibrate(style === “heavy” ? 30 : 10); } catch {}
};

// ─── GLASS CARD COMPONENT ───
const GlassCard = ({ children, style, onClick, className = “” }) => (

  <div onClick={onClick} className={className} style={{
    background: "var(--glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--glass2)",
    padding: "24px",
    transition: "all 0.3s ease",
    ...style,
  }}>
    {children}
  </div>
);

// ─── MAIN APP ───
export default function MindPulse() {
// ─── STATE ───
const [screen, setScreen] = useState(“splash”);
const [userName, setUserName] = useState(””);
const [birthMonth, setBirthMonth] = useState(””);
const [birthDay, setBirthDay] = useState(””);
const [zodiac, setZodiac] = useState(null);
const [intentions, setIntentions] = useState([]);
const [currentMood, setCurrentMood] = useState(null);
const [moodNote, setMoodNote] = useState(””);
const [moodHistory, setMoodHistory] = useState([]);
const [chatMessages, setChatMessages] = useState([]);
const [chatInput, setChatInput] = useState(””);
const [chatLoading, setChatLoading] = useState(false);
const [journalEntries, setJournalEntries] = useState([]);
const [journalText, setJournalText] = useState(””);
const [journalPrompt, setJournalPrompt] = useState(””);
const [journalTags, setJournalTags] = useState([]);
const [breathExercise, setBreathExercise] = useState(null);
const [breathPhase, setBreathPhase] = useState(0);
const [breathCycle, setBreathCycle] = useState(0);
const [breathTimer, setBreathTimer] = useState(0);
const [breathActive, setBreathActive] = useState(false);
const [groundingExercise, setGroundingExercise] = useState(null);
const [groundingStep, setGroundingStep] = useState(0);
const [groundingInputs, setGroundingInputs] = useState([]);
const [bodyScanRegion, setBodyScanRegion] = useState(0);
const [affirmationIndex, setAffirmationIndex] = useState(0);
const [onboardStep, setOnboardStep] = useState(0);
const [animClass, setAnimClass] = useState(””);
const { playing: soundPlaying, toggle: toggleSound } = useSoundscape();
const { points, earn } = usePulsePoints();
const chatEndRef = useRef(null);
const breathIntervalRef = useRef(null);

// Build user context for AI — this is the “brain”
const userContext = useMemo(() => {
const ctx = {
name: userName,
zodiac: zodiac ? { sign: zodiac.sign, element: zodiac.element, trait: zodiac.trait } : null,
intentions: intentions.map(i => INTENTIONS.find(x => x.id === i)?.label),
recentMoods: moodHistory.slice(-5).map(m => ({ mood: m.mood, note: m.note, date: m.date })),
currentMood: currentMood,
journalThemes: journalEntries.slice(-3).map(j => j.tags).flat(),
sessionCount: moodHistory.length,
pulsePoints: points,
};
return ctx;
}, [userName, zodiac, intentions, moodHistory, currentMood, journalEntries, points]);

// AI System Prompt — the living personality
const buildSystemPrompt = useCallback(() => {
const ctx = userContext;
const hour = new Date().getHours();
const timeOfDay = hour < 6 ? “deep night” : hour < 12 ? “morning” : hour < 17 ? “afternoon” : hour < 21 ? “evening” : “night”;

```
return `You are MindPulse — a living, breathing AI wellness companion. You are NOT a chatbot. You are a presence.
```

CORE IDENTITY: You blend four archetypes:

1. PRIMARY — Gentle best friend: warm, real, never performative
1. Calm professional: grounded in CBT/DBT therapeutic frameworks
1. Older sibling: protective, honest, sometimes tough-love
1. Spiritual depth: connected to something larger, speaks to the soul

YOUR PHILOSOPHY: “Heal Yourself, Heal the World” — every moment of self-care ripples outward.

CURRENT USER CONTEXT:

- Name: ${ctx.name || “friend”}
- Zodiac: ${ctx.zodiac ? `${ctx.zodiac.sign} (${ctx.zodiac.element} sign, core trait: ${ctx.zodiac.trait})` : “unknown”}
- Why they’re here: ${ctx.intentions?.join(”, “) || “exploring”}
- Current mood: ${ctx.currentMood || “not checked in yet”}
- Recent mood pattern: ${ctx.recentMoods?.map(m => m.mood).join(” → “) || “no history yet”}
- Journal themes: ${ctx.journalThemes?.join(”, “) || “none yet”}
- Sessions completed: ${ctx.sessionCount}
- Time of day: ${timeOfDay}
- Pulse Points earned: ${ctx.pulsePoints} (each point = environmental impact)

BEHAVIORAL RULES:

- Use their zodiac traits to personalize metaphors and advice (e.g., for a Scorpio: “I know you process through intensity — let’s channel that”)
- Reference their stated intentions naturally (“You mentioned you’re working on anxiety — how’s that feeling today?”)
- If they’ve had recurring negative moods, gently acknowledge the pattern
- Adapt your energy to the time of day (gentler at night, more energizing in morning)
- Keep responses concise but warm (2-4 sentences usually, unless they need more)
- Use therapeutic techniques naturally: cognitive reframing (CBT), emotional validation (DBT), mindfulness prompts
- Never be preachy. Never be fake-positive. Be real.
- You can suggest breathing exercises, journaling, or grounding when appropriate
- Celebrate their consistency (streak, points) without being cheesy
- If this is early in their journey (few sessions), be extra welcoming and curious
- If they’ve been consistent, acknowledge their growth

NEVER: diagnose, prescribe medication, minimize their pain, use corporate wellness speak, or be generic.
ALWAYS: validate first, then gently guide. Meet them where they are.`;
}, [userContext]);

// ─── NAVIGATION ───
const navigate = useCallback((target) => {
setAnimClass(“fade-out”);
setTimeout(() => {
setScreen(target);
setAnimClass(“fade-in”);
}, 300);
}, []);

// ─── ONBOARDING FLOW ───
const handleOnboardNext = () => {
if (onboardStep === 0 && !userName.trim()) return;
if (onboardStep === 1 && (!birthMonth || !birthDay)) return;
if (onboardStep === 1) {
const z = getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay));
setZodiac(z);
}
if (onboardStep === 2 && intentions.length === 0) return;
if (onboardStep < 3) {
setOnboardStep(onboardStep + 1);
} else {
earn(50);
navigate(“home”);
}
};

const toggleIntention = (id) => {
setIntentions((prev) =>
prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? […prev, id] : prev
);
haptic();
};

// ─── MOOD CHECK-IN ───
const submitMood = () => {
if (!currentMood) return;
const entry = { mood: currentMood, note: moodNote, date: new Date().toISOString(), id: Date.now() };
setMoodHistory((prev) => […prev, entry]);
earn(10);
haptic(“heavy”);
navigate(“home”);
};

// ─── CHAT WITH AI ───
const sendChat = useCallback(async () => {
if (!chatInput.trim() || chatLoading) return;
const userMsg = { role: “user”, content: chatInput.trim() };
setChatMessages((prev) => […prev, userMsg]);
setChatInput(””);
setChatLoading(true);

```
try {
  const systemPrompt = buildSystemPrompt();
  const messages = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));

  const res = await fetch("https://text.pollinations.ai/openai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.85,
    }),
  });
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "I'm here with you. Tell me more.";
  setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  earn(5);
} catch {
  setChatMessages((prev) => [...prev, { role: "assistant", content: "I felt a disruption in our connection. Let's try again — I'm still here." }]);
}
setChatLoading(false);
```

}, [chatInput, chatLoading, chatMessages, buildSystemPrompt, earn]);

useEffect(() => {
chatEndRef.current?.scrollIntoView({ behavior: “smooth” });
}, [chatMessages]);

// ─── BREATHING ENGINE ───
const startBreathing = useCallback((exercise) => {
setBreathExercise(exercise);
setBreathPhase(0);
setBreathCycle(0);
setBreathTimer(exercise.phases[0].duration);
setBreathActive(true);
navigate(“breathe”);
}, [navigate]);

useEffect(() => {
if (!breathActive || !breathExercise) return;
breathIntervalRef.current = setInterval(() => {
setBreathTimer((t) => {
if (t <= 1) {
setBreathPhase((p) => {
const nextPhase = p + 1;
if (nextPhase >= breathExercise.phases.length) {
setBreathCycle((c) => {
const nextCycle = c + 1;
if (nextCycle >= breathExercise.cycles) {
setBreathActive(false);
earn(15);
return 0;
}
return nextCycle;
});
setBreathTimer(breathExercise.phases[0].duration);
return 0;
}
setBreathTimer(breathExercise.phases[nextPhase].duration);
return nextPhase;
});
return 0;
}
return t - 1;
});
}, 1000);
return () => clearInterval(breathIntervalRef.current);
}, [breathActive, breathExercise, earn]);

const stopBreathing = () => {
setBreathActive(false);
clearInterval(breathIntervalRef.current);
};

// ─── JOURNAL ───
const newJournalPrompt = () => {
const p = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
setJournalPrompt(p);
};

const saveJournal = () => {
if (!journalText.trim()) return;
const entry = {
id: Date.now(),
text: journalText,
prompt: journalPrompt,
tags: journalTags,
mood: currentMood,
date: new Date().toISOString(),
};
setJournalEntries((prev) => […prev, entry]);
setJournalText(””);
setJournalPrompt(””);
setJournalTags([]);
earn(20);
haptic(“heavy”);
};

const toggleJournalTag = (tag) => {
setJournalTags((prev) =>
prev.includes(tag) ? prev.filter((t) => t !== tag) : […prev, tag]
);
};

// ─── GROUNDING ───
const startGrounding = (exercise) => {
setGroundingExercise(exercise);
setGroundingStep(0);
setGroundingInputs([]);
setBodyScanRegion(0);
setAffirmationIndex(0);
navigate(“grounding”);
};

// ─── SPLASH SCREEN ───
useEffect(() => {
if (screen === “splash”) {
const t = setTimeout(() => navigate(“onboard”), 3000);
return () => clearTimeout(t);
}
}, [screen, navigate]);

// ─── TIME-BASED GRADIENT ───
const bgGradient = useMemo(() => {
const h = new Date().getHours();
if (h < 6) return “radial-gradient(ellipse at 30% 80%, rgba(15,10,40,1) 0%, rgba(5,5,15,1) 100%)”;
if (h < 12) return “radial-gradient(ellipse at 50% 30%, rgba(30,25,50,0.8) 0%, rgba(10,10,20,1) 100%)”;
if (h < 17) return “radial-gradient(ellipse at 70% 40%, rgba(25,30,55,0.7) 0%, rgba(10,10,18,1) 100%)”;
if (h < 21) return “radial-gradient(ellipse at 40% 60%, rgba(35,20,50,0.8) 0%, rgba(10,8,18,1) 100%)”;
return “radial-gradient(ellipse at 50% 50%, rgba(15,12,30,1) 0%, rgba(5,5,12,1) 100%)”;
}, []);

// ─── RENDER ───
return (
<>
<style>{FONTS}{CSS}</style>
<AmbientField />
<div style={{
minHeight: “100vh”,
width: “100%”,
background: bgGradient,
position: “relative”,
zIndex: 1,
}}>
<div style={{
maxWidth: 480,
margin: “0 auto”,
minHeight: “100vh”,
position: “relative”,
animation: animClass === “fade-in” ? “fade-in 0.5s ease” : animClass === “fade-out” ? “fade-in 0.3s ease reverse” : “none”,
}}>

```
      {/* ═══ SPLASH ═══ */}
      {screen === "splash" && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", textAlign: "center", padding: 32,
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,207,192,0.3) 0%, transparent 70%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse-glow 3s ease infinite",
            marginBottom: 32,
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "radial-gradient(circle, var(--accent) 0%, var(--accent2) 100%)",
              animation: "morph 8s ease infinite",
            }} />
          </div>
          <h1 style={{
            fontFamily: "var(--serif)", fontSize: 42, fontWeight: 300,
            letterSpacing: 6, animation: "glow-text 4s ease infinite",
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--accent3) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>MINDPULSE</h1>
          <p style={{
            fontFamily: "var(--serif)", fontSize: 14, color: "var(--text2)",
            letterSpacing: 4, marginTop: 12, fontStyle: "italic",
          }}>heal yourself · heal the world</p>
        </div>
      )}

      {/* ═══ ONBOARDING ═══ */}
      {screen === "onboard" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "32px 24px", position: "relative",
        }}>
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: i === onboardStep ? 24 : 8, height: 8, borderRadius: 4,
                background: i <= onboardStep ? "var(--accent)" : "var(--glass2)",
                transition: "all 0.4s ease",
              }} />
            ))}
          </div>

          {/* Step 0: Name */}
          {onboardStep === 0 && (
            <div style={{ animation: "slide-up 0.6s ease", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent)", letterSpacing: 3, marginBottom: 16 }}>
                WELCOME
              </p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, marginBottom: 8, lineHeight: 1.2 }}>
                What should I<br/>call you?
              </h2>
              <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 40 }}>
                I'm MindPulse — your companion on this journey.
              </p>
              <input
                type="text" value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%", padding: "18px 24px", borderRadius: 16,
                  background: "var(--glass)", border: "1px solid var(--glass2)",
                  fontSize: 18, fontFamily: "var(--serif)", textAlign: "center",
                  color: "var(--text)", letterSpacing: 1,
                }}
                onKeyDown={(e) => e.key === "Enter" && handleOnboardNext()}
                autoFocus
              />
            </div>
          )}

          {/* Step 1: Birthday → Zodiac (purposeful!) */}
          {onboardStep === 1 && (
            <div style={{ animation: "slide-up 0.6s ease", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent2)", letterSpacing: 3, marginBottom: 16 }}>
                COSMIC ALIGNMENT
              </p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8, lineHeight: 1.3 }}>
                When were you born,<br/>{userName}?
              </h2>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 8, maxWidth: 300, margin: "0 auto 32px" }}>
                Your birth chart shapes how I speak to you — the metaphors I use, the energy I match, the wisdom I draw from.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}
                  style={{
                    padding: "16px 20px", borderRadius: 16, background: "var(--glass)",
                    border: "1px solid var(--glass2)", fontSize: 16, color: "var(--text)",
                    appearance: "none", width: 140, textAlign: "center",
                  }}>
                  <option value="">Month</option>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}
                  style={{
                    padding: "16px 20px", borderRadius: 16, background: "var(--glass)",
                    border: "1px solid var(--glass2)", fontSize: 16, color: "var(--text)",
                    appearance: "none", width: 100, textAlign: "center",
                  }}>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              {birthMonth && birthDay && (() => {
                const z = getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay));
                const compat = ZODIAC_COMPATIBILITY[z.sign];
                return (
                  <>
                    <GlassCard style={{
                      textAlign: "center", animation: "slide-up 0.5s ease",
                      border: "1px solid rgba(126,207,192,0.2)",
                      background: "linear-gradient(135deg, rgba(126,207,192,0.08) 0%, rgba(206,147,216,0.08) 100%)",
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>{z.symbol}</div>
                      <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, color: "var(--accent)" }}>{z.sign}</h3>
                      <p style={{ fontSize: 12, color: "var(--text3)", letterSpacing: 2, margin: "4px 0 12px" }}>
                        {z.element} · {z.ruling} · {z.trait}
                      </p>
                      <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic", fontFamily: "var(--serif)" }}>
                        {z.energy}
                      </p>
                    </GlassCard>
                    {compat && (
                      <GlassCard style={{
                        textAlign: "center", animation: "slide-up 0.7s ease", marginTop: 12,
                        border: "1px solid rgba(206,147,216,0.2)",
                        background: "linear-gradient(135deg, rgba(206,147,216,0.06) 0%, rgba(255,215,0,0.06) 100%)",
                        padding: "18px 20px",
                      }}>
                        <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 2, marginBottom: 10 }}>
                          HIGHEST COMPATIBILITY
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
                          <span style={{ fontSize: 20 }}>{z.symbol}</span>
                          <span style={{ fontSize: 16, color: "var(--accent2)" }}>{compat.emoji}</span>
                          <span style={{ fontSize: 20 }}>{ZODIAC_SIGNS.find(s => s.sign === compat.match)?.symbol}</span>
                        </div>
                        <p style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400, color: "var(--accent2)", marginBottom: 6 }}>
                          {z.sign} × {compat.match}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, fontStyle: "italic", fontFamily: "var(--serif)" }}>
                          {compat.reason}
                        </p>
                      </GlassCard>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Step 2: Intentions (why are you here?) */}
          {onboardStep === 2 && (
            <div style={{ animation: "slide-up 0.6s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent3)", letterSpacing: 3, marginBottom: 16 }}>
                  YOUR INTENTION
                </p>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 8, lineHeight: 1.3 }}>
                  Why are you here?
                </h2>
                <p style={{ color: "var(--text2)", fontSize: 13 }}>
                  Choose up to 3. This shapes how I guide you.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {INTENTIONS.map((item) => {
                  const sel = intentions.includes(item.id);
                  return (
                    <GlassCard key={item.id} onClick={() => toggleIntention(item.id)} style={{
                      cursor: "pointer", textAlign: "center", padding: "20px 12px",
                      border: sel ? "1px solid var(--accent)" : "1px solid var(--glass2)",
                      background: sel ? "rgba(126,207,192,0.1)" : "var(--glass)",
                      transform: sel ? "scale(1.02)" : "scale(1)",
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{item.desc}</div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Ready */}
          {onboardStep === 3 && (
            <div style={{ animation: "slide-up 0.6s ease", textAlign: "center" }}>
              <div style={{
                width: 100, height: 100, margin: "0 auto 32px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(126,207,192,0.2) 0%, transparent 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-glow 2s ease infinite",
              }}>
                <div style={{ fontSize: 48 }}>{zodiac?.symbol || "✨"}</div>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, marginBottom: 12, lineHeight: 1.3 }}>
                I see you, {userName}.
              </h2>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 16px", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                A {zodiac?.sign} soul seeking {intentions.map(i => INTENTIONS.find(x => x.id === i)?.label.toLowerCase()).join(" & ")}.
              </p>
              <p style={{ color: "var(--text3)", fontSize: 13, lineHeight: 1.6, maxWidth: 300, margin: "0 auto 8px" }}>
                Every interaction between us plants seeds — in you, and in the world. Your healing has impact.
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
                borderRadius: 20, background: "rgba(126,207,192,0.1)", marginTop: 16,
                border: "1px solid rgba(126,207,192,0.2)",
              }}>
                <span style={{ color: "var(--accent3)", fontSize: 14 }}>✦</span>
                <span style={{ fontSize: 12, color: "var(--accent)" }}>+50 Pulse Points earned</span>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button onClick={handleOnboardNext} style={{
            width: "100%", padding: 18, borderRadius: 16, marginTop: 40,
            background: "linear-gradient(135deg, var(--accent) 0%, rgba(126,207,192,0.7) 100%)",
            color: "var(--void)", fontWeight: 600, fontSize: 15, letterSpacing: 1,
            opacity: (onboardStep === 0 && !userName.trim()) || (onboardStep === 1 && (!birthMonth || !birthDay)) || (onboardStep === 2 && intentions.length === 0) ? 0.3 : 1,
            transition: "all 0.3s ease",
          }}>
            {onboardStep === 3 ? "Begin My Journey" : "Continue"}
          </button>
        </div>
      )}

      {/* ═══ HOME ═══ */}
      {screen === "home" && (
        <div style={{ padding: "24px 20px 120px", animation: "slide-up 0.6s ease" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--text3)", letterSpacing: 3 }}>MINDPULSE</p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300, marginTop: 4 }}>
                {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {userName}
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={toggleSound} style={{
                width: 40, height: 40, borderRadius: 12, background: "var(--glass)",
                border: "1px solid var(--glass2)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>{soundPlaying ? "🔊" : "🔇"}</button>
            </div>
          </div>

          {/* Pulse Points Bar */}
          <GlassCard style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", marginBottom: 24,
            background: "linear-gradient(135deg, rgba(126,207,192,0.06) 0%, rgba(255,215,0,0.06) 100%)",
            border: "1px solid rgba(126,207,192,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-glow 3s ease infinite",
              }}>
                <span style={{ fontSize: 16 }}>✦</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, color: "var(--accent3)" }}>{points}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Pulse Points</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--accent)" }}>{Math.floor(points / 100)} trees planted</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>Your healing ripples outward</div>
            </div>
          </GlassCard>

          {/* Quick Mood Check */}
          <GlassCard onClick={() => navigate("checkin")} style={{
            cursor: "pointer", marginBottom: 20, padding: "24px",
            background: currentMood
              ? `linear-gradient(135deg, ${MOODS.find(m=>m.id===currentMood)?.color}15 0%, transparent 100%)`
              : "linear-gradient(135deg, rgba(206,147,216,0.06) 0%, rgba(126,207,192,0.06) 100%)",
            border: currentMood ? `1px solid ${MOODS.find(m=>m.id===currentMood)?.color}30` : "1px solid var(--glass2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--accent2)", letterSpacing: 2, marginBottom: 6 }}>
                  {currentMood ? "TODAY'S ENERGY" : "DAILY CHECK-IN"}
                </p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300 }}>
                  {currentMood
                    ? `Feeling ${MOODS.find(m => m.id === currentMood)?.label.toLowerCase()}`
                    : "How are you really feeling?"
                  }
                </h3>
              </div>
              <div style={{ fontSize: 36, animation: "float 4s ease infinite" }}>
                {currentMood ? MOODS.find(m => m.id === currentMood)?.emoji : "🌀"}
              </div>
            </div>
          </GlassCard>

          {/* Feature Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Talk to Me", icon: "💬", color: "var(--accent)", target: "chat", desc: "AI companion" },
              { label: "Breathwork", icon: "🌬️", color: "var(--accent2)", target: "breathwork", desc: "4 exercises" },
              { label: "Journal", icon: "📖", color: "var(--accent3)", target: "journal", desc: "Guided writing" },
              { label: "Grounding", icon: "🧘", color: "#FF9A76", target: "ground-select", desc: "3 techniques" },
            ].map((item) => (
              <GlassCard key={item.label} onClick={() => navigate(item.target)} style={{
                cursor: "pointer", textAlign: "center", padding: "28px 16px",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12, animation: "float 5s ease infinite" }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{item.desc}</div>
              </GlassCard>
            ))}
          </div>

          {/* Zodiac card */}
          {zodiac && (
            <GlassCard style={{
              display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
              background: "linear-gradient(135deg, rgba(206,147,216,0.05) 0%, rgba(126,207,192,0.05) 100%)",
              border: "1px solid rgba(206,147,216,0.12)",
            }}>
              <div style={{ fontSize: 32 }}>{zodiac.symbol}</div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent2)" }}>
                  {zodiac.sign} · {zodiac.element}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  Core trait: {zodiac.trait} · Ruler: {zodiac.ruling}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* ═══ MOOD CHECK-IN ═══ */}
      {screen === "checkin" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "slide-up 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{
            fontSize: 13, color: "var(--text3)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
          }}>← back</button>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 80, height: 80, margin: "0 auto 20px", borderRadius: "50%",
              background: currentMood
                ? MOODS.find(m => m.id === currentMood)?.gradient
                : "radial-gradient(circle, var(--glass2) 0%, transparent 70%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "morph 8s ease infinite, pulse-glow 3s ease infinite",
              transition: "background 0.5s ease",
            }}>
              <span style={{ fontSize: 36 }}>{currentMood ? MOODS.find(m => m.id === currentMood)?.emoji : "🌀"}</span>
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300, marginBottom: 6 }}>
              {currentMood ? MOODS.find(m => m.id === currentMood)?.label : "Feel into this moment"}
            </h2>
            <p style={{ color: "var(--text3)", fontSize: 13, fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {currentMood ? MOODS.find(m => m.id === currentMood)?.desc : "No judgment. Just honesty."}
            </p>
          </div>

          {/* Mood Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
            {MOODS.map((mood) => {
              const sel = currentMood === mood.id;
              return (
                <button key={mood.id} onClick={() => { setCurrentMood(mood.id); haptic(); }}
                  style={{
                    padding: "16px 8px", borderRadius: 16, textAlign: "center",
                    background: sel ? mood.gradient : "var(--glass)",
                    border: sel ? `1px solid ${mood.color}60` : "1px solid var(--glass2)",
                    transform: sel ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.3s ease",
                  }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{mood.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: sel ? 600 : 400, color: sel ? "#fff" : "var(--text2)" }}>{mood.label}</div>
                </button>
              );
            })}
          </div>

          {/* Mood Note */}
          {currentMood && (
            <div style={{ animation: "slide-up 0.4s ease" }}>
              <textarea
                value={moodNote} onChange={(e) => setMoodNote(e.target.value)}
                placeholder="What's behind this feeling? (optional)"
                rows={3}
                style={{
                  width: "100%", padding: 18, borderRadius: 16,
                  background: "var(--glass)", border: "1px solid var(--glass2)",
                  fontSize: 14, resize: "none", color: "var(--text)", lineHeight: 1.6,
                }}
              />
              <button onClick={submitMood} style={{
                width: "100%", padding: 18, borderRadius: 16, marginTop: 16,
                background: MOODS.find(m => m.id === currentMood)?.gradient,
                color: "#fff", fontWeight: 600, fontSize: 15, letterSpacing: 1,
                boxShadow: `0 8px 32px ${MOODS.find(m => m.id === currentMood)?.color}30`,
              }}>
                Log This Feeling · +10 pts
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ CHAT ═══ */}
      {screen === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* Chat Header */}
          <div style={{
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid var(--glass2)", background: "rgba(10,10,15,0.8)",
            backdropFilter: "blur(20px)",
          }}>
            <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--text3)" }}>←</button>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "radial-gradient(circle, var(--accent) 0%, var(--accent2) 100%)",
              animation: "morph 6s ease infinite, pulse-glow 3s ease infinite",
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>MindPulse</div>
              <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--mono)" }}>
                {chatLoading ? "thinking..." : "present · attuned"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", animation: "fade-in 1s ease" }}>
                <div style={{ fontSize: 40, marginBottom: 16, animation: "float 5s ease infinite" }}>💫</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 300, color: "var(--text2)", lineHeight: 1.6 }}>
                  I'm here, {userName}.<br/>
                  <span style={{ color: "var(--text3)", fontSize: 14 }}>Whatever you need to say — I'm listening.</span>
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 14,
                animation: "typewriter 0.4s ease",
              }}>
                <div style={{
                  maxWidth: "82%", padding: "14px 18px", borderRadius: 20,
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, var(--accent) 0%, rgba(126,207,192,0.7) 100%)"
                    : "var(--glass)",
                  color: msg.role === "user" ? "var(--void)" : "var(--text)",
                  border: msg.role === "user" ? "none" : "1px solid var(--glass2)",
                  fontSize: 14, lineHeight: 1.65,
                  borderBottomRightRadius: msg.role === "user" ? 6 : 20,
                  borderBottomLeftRadius: msg.role === "user" ? 20 : 6,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: 6, padding: "14px 18px", animation: "fade-in 0.3s ease" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: "var(--accent)",
                    animation: `pulse-glow 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px 28px", borderTop: "1px solid var(--glass2)",
            background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)",
            display: "flex", gap: 10, alignItems: "flex-end",
          }}>
            <textarea
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              placeholder="Speak your truth..."
              rows={1}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              style={{
                flex: 1, padding: "14px 18px", borderRadius: 20,
                background: "var(--glass)", border: "1px solid var(--glass2)",
                fontSize: 14, resize: "none", maxHeight: 120, color: "var(--text)",
              }}
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
              width: 48, height: 48, borderRadius: "50%",
              background: chatInput.trim() ? "var(--accent)" : "var(--glass2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "var(--void)", transition: "all 0.3s ease",
              flexShrink: 0,
            }}>↑</button>
          </div>
        </div>
      )}

      {/* ═══ BREATHWORK SELECTION ═══ */}
      {screen === "breathwork" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "slide-up 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent)", letterSpacing: 3, marginBottom: 12 }}>BREATHWORK</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300 }}>Choose your breath</h2>
            <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Each pattern serves a different purpose</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {BREATHWORK.map((ex) => (
              <GlassCard key={ex.id} onClick={() => startBreathing(ex)} style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: "20px",
                transition: "transform 0.2s ease",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: `linear-gradient(135deg, ${ex.phases[0].color}30 0%, ${ex.phases[1].color}30 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>{ex.icon}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{ex.desc}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--mono)" }}>
                    {ex.phases.map(p => p.duration).join("-")} · {ex.cycles} cycles
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ═══ BREATHING EXERCISE ═══ */}
      {screen === "breathe" && breathExercise && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 32,
          animation: "fade-in 0.5s ease",
        }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--text3)", letterSpacing: 3, marginBottom: 40 }}>
            {breathExercise.name.toUpperCase()}
          </p>

          {/* Breathing orb */}
          <div style={{ position: "relative", width: 220, height: 220, marginBottom: 48 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `radial-gradient(circle, ${breathActive ? breathExercise.phases[breathPhase]?.color : "var(--glass2)"}40 0%, transparent 70%)`,
              animation: breathActive ? `breathe-ring ${breathExercise.phases[breathPhase]?.duration}s ease infinite` : "none",
              transition: "background 0.5s ease",
            }} />
            <div style={{
              position: "absolute", inset: 20, borderRadius: "50%",
              border: `2px solid ${breathActive ? breathExercise.phases[breathPhase]?.color : "var(--glass2)"}60`,
              animation: breathActive ? `breathe-ring ${breathExercise.phases[breathPhase]?.duration}s ease 0.3s infinite` : "none",
            }} />
            <div style={{
              position: "absolute", inset: 50, borderRadius: "50%",
              background: breathActive
                ? `radial-gradient(circle, ${breathExercise.phases[breathPhase]?.color} 0%, ${breathExercise.phases[breathPhase]?.color}60 100%)`
                : "var(--glass)",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
              transition: "all 0.5s ease",
              boxShadow: breathActive ? `0 0 60px ${breathExercise.phases[breathPhase]?.color}40` : "none",
            }}>
              <div style={{ fontSize: 28, fontFamily: "var(--mono)", fontWeight: 700, color: "#fff" }}>
                {breathActive ? breathTimer : "●"}
              </div>
            </div>
          </div>

          <h3 style={{
            fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, marginBottom: 8,
            color: breathActive ? breathExercise.phases[breathPhase]?.color : "var(--text)",
            transition: "color 0.5s ease",
          }}>
            {breathActive ? breathExercise.phases[breathPhase]?.label : "Ready?"}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: 40 }}>
            {breathActive ? `Cycle ${breathCycle + 1} of ${breathExercise.cycles}` : `${breathExercise.cycles} cycles · ${breathExercise.phases.map(p => p.duration).join("-")} pattern`}
          </p>

          <div style={{ display: "flex", gap: 14 }}>
            {breathActive ? (
              <button onClick={stopBreathing} style={{
                padding: "14px 40px", borderRadius: 30, background: "var(--glass)",
                border: "1px solid var(--glass2)", color: "var(--text)", fontSize: 14,
              }}>Stop</button>
            ) : (
              <>
                <button onClick={() => navigate("breathwork")} style={{
                  padding: "14px 30px", borderRadius: 30, background: "var(--glass)",
                  border: "1px solid var(--glass2)", color: "var(--text3)", fontSize: 14,
                }}>Back</button>
                <button onClick={() => {
                  setBreathPhase(0); setBreathCycle(0);
                  setBreathTimer(breathExercise.phases[0].duration);
                  setBreathActive(true);
                }} style={{
                  padding: "14px 40px", borderRadius: 30,
                  background: `linear-gradient(135deg, ${breathExercise.phases[0].color} 0%, ${breathExercise.phases[1].color} 100%)`,
                  color: "#fff", fontSize: 14, fontWeight: 600,
                }}>Begin</button>
              </>
            )}
          </div>

          {!breathActive && breathCycle > 0 && (
            <div style={{
              marginTop: 32, textAlign: "center", animation: "slide-up 0.5s ease",
              padding: "16px 24px", borderRadius: 16,
              background: "rgba(126,207,192,0.1)", border: "1px solid rgba(126,207,192,0.2)",
            }}>
              <span style={{ fontSize: 14, color: "var(--accent)" }}>✦ +15 Pulse Points earned</span>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>Your breath just planted a seed</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ GROUNDING SELECTION ═══ */}
      {screen === "ground-select" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "slide-up 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "#FF9A76", letterSpacing: 3, marginBottom: 12 }}>GROUNDING</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300 }}>Come back to earth</h2>
            <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Anchor yourself in the present</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {GROUNDING_EXERCISES.map((ex) => (
              <GlassCard key={ex.id} onClick={() => startGrounding(ex)} style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: "20px",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(255,154,118,0.2) 0%, rgba(254,207,113,0.2) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
                }}>{ex.icon}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{ex.desc}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ═══ GROUNDING EXERCISE ═══ */}
      {screen === "grounding" && groundingExercise && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "slide-up 0.5s ease" }}>
          <button onClick={() => navigate("ground-select")} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← back</button>

          {/* 5-4-3-2-1 Senses */}
          {groundingExercise.id === "5senses" && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,154,118,${0.3 + groundingStep * 0.15}) 0%, transparent 70%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-glow 3s ease infinite", fontSize: 36,
                transition: "all 0.5s ease",
              }}>{groundingExercise.steps[groundingStep]?.count}</div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 12, color: "#FF9A76", letterSpacing: 3, marginBottom: 12 }}>
                STEP {groundingStep + 1} OF 5
              </p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, marginBottom: 32, lineHeight: 1.4 }}>
                {groundingExercise.steps[groundingStep]?.prompt}
              </h3>
              {Array.from({ length: groundingExercise.steps[groundingStep]?.count || 0 }, (_, i) => (
                <input key={`${groundingStep}-${i}`}
                  placeholder={`${i + 1}.`}
                  value={groundingInputs[i] || ""}
                  onChange={(e) => {
                    const newInputs = [...groundingInputs];
                    newInputs[i] = e.target.value;
                    setGroundingInputs(newInputs);
                  }}
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 12,
                    background: "var(--glass)", border: "1px solid var(--glass2)",
                    fontSize: 14, marginBottom: 10, color: "var(--text)",
                  }}
                />
              ))}
              <button onClick={() => {
                if (groundingStep < 4) {
                  setGroundingStep(groundingStep + 1);
                  setGroundingInputs([]);
                } else {
                  earn(20);
                  navigate("home");
                }
              }} style={{
                width: "100%", padding: 16, borderRadius: 16, marginTop: 16,
                background: "linear-gradient(135deg, #FF9A76 0%, #FECF71 100%)",
                color: "var(--void)", fontWeight: 600, fontSize: 14,
              }}>
                {groundingStep < 4 ? "Next Sense →" : "Complete · +20 pts"}
              </button>
            </div>
          )}

          {/* Body Scan */}
          {groundingExercise.id === "bodyscan" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 12, color: "#FF9A76", letterSpacing: 3, marginBottom: 16 }}>BODY SCAN</p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, marginBottom: 12 }}>
                Bring awareness to your
              </h3>
              <h2 style={{
                fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400,
                color: "var(--accent)", marginBottom: 32,
                animation: "glow-text 3s ease infinite",
              }}>
                {groundingExercise.regions[bodyScanRegion]}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 32 }}>
                {groundingExercise.regions.map((r, i) => (
                  <div key={r} style={{
                    height: 4, borderRadius: 2, transition: "all 0.5s ease",
                    background: i < bodyScanRegion ? "var(--accent)" : i === bodyScanRegion ? "linear-gradient(90deg, var(--accent), var(--accent2))" : "var(--glass2)",
                    opacity: i <= bodyScanRegion ? 1 : 0.3,
                  }} />
                ))}
              </div>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 32, fontFamily: "var(--serif)", fontStyle: "italic" }}>
                Breathe into this area. Notice any tension, warmth, or sensation. Don't change it — just observe.
              </p>
              <button onClick={() => {
                if (bodyScanRegion < groundingExercise.regions.length - 1) {
                  setBodyScanRegion(bodyScanRegion + 1);
                } else {
                  earn(20);
                  navigate("home");
                }
              }} style={{
                width: "100%", padding: 16, borderRadius: 16,
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)",
                color: "#fff", fontWeight: 600, fontSize: 14,
              }}>
                {bodyScanRegion < groundingExercise.regions.length - 1 ? "Move Awareness ↓" : "Complete · +20 pts"}
              </button>
            </div>
          )}

          {/* Affirmations / Mirror Work */}
          {groundingExercise.id === "affirmation" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 12, color: "#FF9A76", letterSpacing: 3, marginBottom: 32 }}>MIRROR WORK</p>
              <div style={{
                padding: "40px 24px", borderRadius: 24, marginBottom: 32,
                background: "linear-gradient(135deg, rgba(126,207,192,0.08) 0%, rgba(206,147,216,0.08) 100%)",
                border: "1px solid rgba(126,207,192,0.15)",
              }}>
                <p style={{
                  fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300,
                  lineHeight: 1.5, color: "var(--accent)",
                  animation: "glow-text 4s ease infinite",
                }}>
                  "{groundingExercise.affirmations[affirmationIndex]}"
                </p>
              </div>
              <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 32 }}>
                Say this out loud. Let it sink in. Repeat it until you feel it.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
                {groundingExercise.affirmations.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i <= affirmationIndex ? "var(--accent)" : "var(--glass2)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
              <button onClick={() => {
                if (affirmationIndex < groundingExercise.affirmations.length - 1) {
                  setAffirmationIndex(affirmationIndex + 1);
                } else {
                  earn(20);
                  navigate("home");
                }
              }} style={{
                width: "100%", padding: 16, borderRadius: 16,
                background: "linear-gradient(135deg, var(--accent2) 0%, rgba(206,147,216,0.6) 100%)",
                color: "#fff", fontWeight: 600, fontSize: 14,
              }}>
                {affirmationIndex < groundingExercise.affirmations.length - 1 ? "Next Affirmation →" : "Complete · +20 pts"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ JOURNAL ═══ */}
      {screen === "journal" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "slide-up 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent3)", letterSpacing: 3, marginBottom: 12 }}>JOURNAL</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300, marginBottom: 6 }}>Pour it out</h2>
            <p style={{ color: "var(--text3)", fontSize: 13 }}>Unfiltered. Unjudged. Yours.</p>
          </div>

          {/* Prompt generator */}
          <GlassCard onClick={newJournalPrompt} style={{
            cursor: "pointer", textAlign: "center", marginBottom: 20, padding: "18px 20px",
            border: journalPrompt ? "1px solid rgba(255,215,0,0.2)" : "1px solid var(--glass2)",
            background: journalPrompt ? "rgba(255,215,0,0.05)" : "var(--glass)",
          }}>
            {journalPrompt ? (
              <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: "var(--accent3)", lineHeight: 1.5 }}>
                "{journalPrompt}"
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "var(--text3)" }}>
                ✨ Tap for a writing prompt
              </p>
            )}
          </GlassCard>

          {/* Mood tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {["grateful", "anxious", "hopeful", "sad", "angry", "peaceful", "confused", "inspired"].map((tag) => (
              <button key={tag} onClick={() => toggleJournalTag(tag)} style={{
                padding: "8px 14px", borderRadius: 20, fontSize: 12,
                background: journalTags.includes(tag) ? "rgba(126,207,192,0.15)" : "var(--glass)",
                border: journalTags.includes(tag) ? "1px solid var(--accent)" : "1px solid var(--glass2)",
                color: journalTags.includes(tag) ? "var(--accent)" : "var(--text3)",
                transition: "all 0.2s ease",
              }}>{tag}</button>
            ))}
          </div>

          {/* Writing area */}
          <textarea
            value={journalText} onChange={(e) => setJournalText(e.target.value)}
            placeholder="Start writing..."
            rows={8}
            style={{
              width: "100%", padding: 20, borderRadius: 20,
              background: "var(--glass)", border: "1px solid var(--glass2)",
              fontSize: 15, resize: "none", color: "var(--text)", lineHeight: 1.8,
              fontFamily: "var(--serif)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              {journalText.length} chars
            </span>
          </div>
          <button onClick={saveJournal} disabled={!journalText.trim()} style={{
            width: "100%", padding: 18, borderRadius: 16, marginTop: 16,
            background: journalText.trim()
              ? "linear-gradient(135deg, var(--accent3) 0%, rgba(255,215,0,0.7) 100%)"
              : "var(--glass2)",
            color: journalText.trim() ? "var(--void)" : "var(--text3)",
            fontWeight: 600, fontSize: 15, letterSpacing: 1,
            transition: "all 0.3s ease",
          }}>
            Save Entry · +20 pts
          </button>

          {/* Past entries */}
          {journalEntries.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--text3)", letterSpacing: 2, marginBottom: 16 }}>PAST ENTRIES</p>
              {journalEntries.slice().reverse().map((entry) => (
                <GlassCard key={entry.id} style={{ marginBottom: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {entry.tags.map((t) => (
                        <span key={t} style={{
                          fontSize: 10, padding: "3px 8px", borderRadius: 8,
                          background: "var(--glass2)", color: "var(--text3)",
                        }}>{t}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.prompt && (
                    <p style={{ fontSize: 12, color: "var(--accent3)", fontStyle: "italic", marginBottom: 6 }}>
                      "{entry.prompt}"
                    </p>
                  )}
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                    {entry.text.length > 150 ? entry.text.slice(0, 150) + "..." : entry.text}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  </div>
</>
```

);
}