import { useState, useEffect, useRef, useCallback, useMemo } from “react”;

// ═══════════════════════════════════════════════════════════
// MINDPULSE — “Heal Yourself, Heal the World”
// ═══════════════════════════════════════════════════════════

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
if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS[11];
return ZODIAC_SIGNS[0];
};

const ZODIAC_COMPATIBILITY = {
Aries: { match: “Leo”, reason: “Two fires that fuel each other — passionate, bold, and unstoppable together” },
Taurus: { match: “Cancer”, reason: “Earth meets water — nurturing, loyal, and deeply secure in each other” },
Gemini: { match: “Aquarius”, reason: “Two brilliant minds — endless conversation, freedom, and intellectual spark” },
Cancer: { match: “Pisces”, reason: “Deep emotional understanding — two souls that feel each other without words” },
Leo: { match: “Sagittarius”, reason: “Fire and adventure — you inspire each other to dream bigger and shine brighter” },
Virgo: { match: “Taurus”, reason: “Earth harmony — grounded, patient, and building something beautiful together” },
Libra: { match: “Gemini”, reason: “Air and charm — witty, social, and effortlessly in sync” },
Scorpio: { match: “Cancer”, reason: “Emotional depth meets fierce loyalty — an unbreakable bond” },
Sagittarius: { match: “Aries”, reason: “Fire and freedom — adventurous spirits who never hold each other back” },
Capricorn: { match: “Virgo”, reason: “Two earth signs building empires — disciplined, devoted, and unstoppable” },
Aquarius: { match: “Libra”, reason: “Visionary minds — progressive, fair, and deeply connected through ideas” },
Pisces: { match: “Scorpio”, reason: “Mystical connection — intuitive, transformative, and spiritually bonded” },
};

const INTENTIONS = [
{ id: “anxiety”, label: “Tame My Anxiety”, desc: “Find calm in the chaos” },
{ id: “sleep”, label: “Sleep Better”, desc: “Quiet the mind at night” },
{ id: “grief”, label: “Process Grief”, desc: “Honor what you’ve lost” },
{ id: “growth”, label: “Grow Spiritually”, desc: “Expand your consciousness” },
{ id: “stress”, label: “Manage Stress”, desc: “Release the pressure” },
{ id: “confidence”, label: “Build Confidence”, desc: “Reclaim your power” },
{ id: “relationships”, label: “Heal Relationships”, desc: “Repair and reconnect” },
{ id: “purpose”, label: “Find Purpose”, desc: “Discover your path” },
];

const MOODS = [
{ id: “radiant”, label: “Radiant”, color: “#D4A574”, desc: “Glowing from within” },
{ id: “peaceful”, label: “Peaceful”, color: “#8FAE8B”, desc: “Still waters” },
{ id: “hopeful”, label: “Hopeful”, color: “#D4956A”, desc: “Light on the horizon” },
{ id: “neutral”, label: “Neutral”, color: “#A89F91”, desc: “Just existing” },
{ id: “anxious”, label: “Anxious”, color: “#B88BA2”, desc: “Mind racing” },
{ id: “heavy”, label: “Heavy”, color: “#7A8B99”, desc: “Carrying weight” },
{ id: “lost”, label: “Lost”, color: “#6B6560”, desc: “Can’t see the path” },
{ id: “angry”, label: “Frustrated”, color: “#C47A6C”, desc: “Heat rising” },
];

const BREATHWORK = [
{ id: “calm”, name: “4-7-8 Calm”, desc: “The anti-anxiety breath”, phases: [{ label: “Breathe In”, duration: 4, color: “#8FAE8B” }, { label: “Hold”, duration: 7, color: “#7A8B99” }, { label: “Breathe Out”, duration: 8, color: “#B88BA2” }], cycles: 4 },
{ id: “box”, name: “Box Breathing”, desc: “Navy SEAL focus technique”, phases: [{ label: “Breathe In”, duration: 4, color: “#8FAE8B” }, { label: “Hold”, duration: 4, color: “#7A8B99” }, { label: “Breathe Out”, duration: 4, color: “#B88BA2” }, { label: “Hold”, duration: 4, color: “#D4A574” }], cycles: 4 },
{ id: “energize”, name: “Energizing Breath”, desc: “Wake up your nervous system”, phases: [{ label: “Sharp In”, duration: 2, color: “#D4956A” }, { label: “Power Out”, duration: 2, color: “#C47A6C” }], cycles: 8 },
{ id: “sleep”, name: “Sleep Descent”, desc: “Drift into deep rest”, phases: [{ label: “Gentle In”, duration: 4, color: “#7A8B99” }, { label: “Soft Hold”, duration: 7, color: “#6B6560” }, { label: “Long Out”, duration: 10, color: “#4A4540” }], cycles: 3 },
];

const GROUNDING_EXERCISES = [
{ id: “5senses”, name: “5-4-3-2-1 Senses”, desc: “Anchor to the present moment”, steps: [{ prompt: “Name 5 things you can SEE right now”, count: 5 }, { prompt: “Name 4 things you can TOUCH”, count: 4 }, { prompt: “Name 3 things you can HEAR”, count: 3 }, { prompt: “Name 2 things you can SMELL”, count: 2 }, { prompt: “Name 1 thing you can TASTE”, count: 1 }] },
{ id: “bodyscan”, name: “Body Scan”, desc: “Release tension from head to toe”, regions: [“Crown of your head”, “Forehead & temples”, “Jaw & throat”, “Shoulders & neck”, “Chest & heart space”, “Belly & solar plexus”, “Hips & lower back”, “Legs & knees”, “Feet & toes”] },
{ id: “affirmation”, name: “Mirror Work”, desc: “Rewire your inner dialogue”, affirmations: [“I am exactly where I need to be”, “My feelings are valid and temporary”, “I choose peace over perfection”, “I am worthy of love and rest”, “I release what I cannot control”] },
];

const JOURNAL_PROMPTS = [“What emotion is asking for your attention right now?”, “Write a letter to your younger self. What do they need to hear?”, “What are you holding onto that no longer serves you?”, “Describe your perfect day in vivid detail.”, “What boundary do you need to set this week?”, “What would you do if you weren’t afraid?”, “Name three things your body is grateful for today.”, “What pattern keeps showing up in your life?”, “If your anxiety had a voice, what would it say? Now respond to it.”, “What does your soul need that your mind keeps ignoring?”];

const FONTS = “@import url(‘https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;600&display=swap’);”;

const CSS = “* { margin: 0; padding: 0; box-sizing: border-box; } :root { –bg: #F5F0EB; –bg2: #EDE7E0; –bg3: #E5DDD5; –surface: #FFFFFF; –surface2: #FAF7F4; –border: #DDD5CC; –ink: #2C2825; –ink2: #5A534D; –ink3: #8A837C; –ink4: #B0A99F; –terra: #C47A5A; –sage: #6B8F71; –clay: #B88BA2; –warm: #D4956A; –serif: ‘Fraunces’, Georgia, serif; –sans: ‘Outfit’, system-ui, sans-serif; –radius: 16px; –radius-sm: 10px; –shadow: 0 1px 3px rgba(44,40,37,0.06), 0 4px 12px rgba(44,40,37,0.04); } body { background: var(–bg); color: var(–ink); font-family: var(–sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; } input, textarea, button, select { font-family: inherit; border: none; outline: none; background: none; color: inherit; } button { cursor: pointer; } ::selection { background: rgba(196,122,90,0.2); } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(–border); border-radius: 10px; } @keyframes enter { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } @keyframes fade { from { opacity: 0; } to { opacity: 1; } } @keyframes breathe-expand { 0%,100% { transform: scale(0.6); opacity: 0.4; } 50% { transform: scale(1); opacity: 1; } } @keyframes gentle-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes typeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }”;

const useSoundscape = () => {
const ctxRef = useRef(null); const nodesRef = useRef([]); const [playing, setPlaying] = useState(false);
const start = useCallback(() => { if (ctxRef.current) return; const ctx = new (window.AudioContext || window.webkitAudioContext)(); ctxRef.current = ctx; const master = ctx.createGain(); master.gain.value = 0.1; master.connect(ctx.destination); [174, 261, 349].forEach((freq) => { const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = “sine”; osc.frequency.value = freq; g.gain.value = 0.06; osc.connect(g).connect(master); osc.start(); nodesRef.current.push(osc); const lfo = ctx.createOscillator(); const lfoG = ctx.createGain(); lfo.frequency.value = 0.08 + Math.random() * 0.15; lfoG.gain.value = 1.2; lfo.connect(lfoG).connect(osc.frequency); lfo.start(); nodesRef.current.push(lfo); }); setPlaying(true); }, []);
const stop = useCallback(() => { nodesRef.current.forEach((n) => { try { n.stop(); } catch(e){} }); nodesRef.current = []; if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; } setPlaying(false); }, []);
const toggle = useCallback(() => { playing ? stop() : start(); }, [playing, start, stop]);
return { playing, toggle };
};

const usePulsePoints = () => {
const [points, setPoints] = useState(() => { try { return parseInt(localStorage.getItem(“mp_points”) || “0”); } catch { return 0; } });
const earn = useCallback((amount) => { setPoints((p) => { const n = p + amount; try { localStorage.setItem(“mp_points”, n); } catch {} return n; }); }, []);
return { points, earn };
};

const haptic = (s) => { try { navigator.vibrate && navigator.vibrate(s === “heavy” ? 30 : 10); } catch {} };

const Card = ({ children, style, onClick }) => (<div onClick={onClick} style={{ background: “var(–surface)”, borderRadius: “var(–radius)”, border: “1px solid var(–border)”, padding: 24, boxShadow: “var(–shadow)”, transition: “all 0.25s ease”, …style }}>{children}</div>);

const Pill = ({ children, active, onClick, style }) => (<button onClick={onClick} style={{ padding: “10px 20px”, borderRadius: 100, background: active ? “var(–terra)” : “var(–surface)”, color: active ? “#fff” : “var(–ink2)”, border: active ? “1px solid var(–terra)” : “1px solid var(–border)”, fontSize: 13, fontWeight: 500, transition: “all 0.2s ease”, boxShadow: active ? “0 2px 8px rgba(196,122,90,0.25)” : “none”, …style }}>{children}</button>);

export default function MindPulse() {
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
const { playing: soundPlaying, toggle: toggleSound } = useSoundscape();
const { points, earn } = usePulsePoints();
const chatEndRef = useRef(null);
const breathIntervalRef = useRef(null);

const userContext = useMemo(() => ({ name: userName, zodiac: zodiac ? { sign: zodiac.sign, element: zodiac.element, trait: zodiac.trait } : null, intentions: intentions.map(i => INTENTIONS.find(x => x.id === i)?.label), recentMoods: moodHistory.slice(-5).map(m => ({ mood: m.mood, note: m.note, date: m.date })), currentMood, journalThemes: journalEntries.slice(-3).map(j => j.tags).flat(), sessionCount: moodHistory.length, pulsePoints: points }), [userName, zodiac, intentions, moodHistory, currentMood, journalEntries, points]);

const buildSystemPrompt = useCallback(() => {
const ctx = userContext; const hour = new Date().getHours();
const timeOfDay = hour < 6 ? “deep night” : hour < 12 ? “morning” : hour < 17 ? “afternoon” : hour < 21 ? “evening” : “night”;
return `You are MindPulse — a living, breathing AI wellness companion. You are NOT a chatbot. You are a presence.\n\nCORE IDENTITY: You blend four archetypes:\n1. PRIMARY — Gentle best friend: warm, real, never performative\n2. Calm professional: grounded in CBT/DBT therapeutic frameworks\n3. Older sibling: protective, honest, sometimes tough-love\n4. Spiritual depth: connected to something larger, speaks to the soul\n\nYOUR PHILOSOPHY: "Heal Yourself, Heal the World"\n\nCURRENT USER CONTEXT:\n- Name: ${ctx.name || "friend"}\n- Zodiac: ${ctx.zodiac ? ctx.zodiac.sign + " (" + ctx.zodiac.element + " sign, core trait: " + ctx.zodiac.trait + ")" : "unknown"}\n- Why they are here: ${ctx.intentions?.join(", ") || "exploring"}\n- Current mood: ${ctx.currentMood || "not checked in yet"}\n- Recent mood pattern: ${ctx.recentMoods?.map(m => m.mood).join(" > ") || "no history yet"}\n- Journal themes: ${ctx.journalThemes?.join(", ") || "none yet"}\n- Sessions completed: ${ctx.sessionCount}\n- Time of day: ${timeOfDay}\n- Pulse Points earned: ${ctx.pulsePoints}\n\nBEHAVIORAL RULES:\n- Use their zodiac traits to personalize metaphors and advice\n- Reference their stated intentions naturally\n- If they have had recurring negative moods, gently acknowledge the pattern\n- Adapt your energy to the time of day\n- Keep responses concise but warm (2-4 sentences usually)\n- Use therapeutic techniques naturally: cognitive reframing, emotional validation, mindfulness\n- Never be preachy. Never be fake-positive. Be real.\n- Celebrate their consistency without being cheesy\n\nNEVER: diagnose, prescribe medication, minimize their pain, use corporate wellness speak, or be generic.\nALWAYS: validate first, then gently guide. Meet them where they are.`;
}, [userContext]);

const navigate = useCallback((target) => { setScreen(target); }, []);

const handleOnboardNext = () => {
if (onboardStep === 0 && !userName.trim()) return;
if (onboardStep === 1 && (!birthMonth || !birthDay)) return;
if (onboardStep === 1) setZodiac(getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay)));
if (onboardStep === 2 && intentions.length === 0) return;
if (onboardStep < 3) setOnboardStep(onboardStep + 1);
else { earn(50); navigate(“home”); }
};

const toggleIntention = (id) => { setIntentions((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? […prev, id] : prev); haptic(); };

const submitMood = () => { if (!currentMood) return; setMoodHistory((prev) => […prev, { mood: currentMood, note: moodNote, date: new Date().toISOString(), id: Date.now() }]); earn(10); haptic(“heavy”); navigate(“home”); };

const sendChat = useCallback(async () => {
if (!chatInput.trim() || chatLoading) return;
const userMsg = { role: “user”, content: chatInput.trim() };
setChatMessages((prev) => […prev, userMsg]); setChatInput(””); setChatLoading(true);
try {
const res = await fetch(“https://text.pollinations.ai/openai/chat/completions”, { method: “POST”, headers: { “Content-Type”: “application/json” }, body: JSON.stringify({ model: “openai”, messages: [{ role: “system”, content: buildSystemPrompt() }, …chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })), max_tokens: 500, temperature: 0.85 }) });
const data = await res.json();
setChatMessages((prev) => […prev, { role: “assistant”, content: data.choices?.[0]?.message?.content || “I am here with you. Tell me more.” }]); earn(5);
} catch { setChatMessages((prev) => […prev, { role: “assistant”, content: “I felt a disruption in our connection. Let us try again.” }]); }
setChatLoading(false);
}, [chatInput, chatLoading, chatMessages, buildSystemPrompt, earn]);

useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: “smooth” }); }, [chatMessages]);

const startBreathing = useCallback((exercise) => { setBreathExercise(exercise); setBreathPhase(0); setBreathCycle(0); setBreathTimer(exercise.phases[0].duration); setBreathActive(true); navigate(“breathe”); }, [navigate]);

useEffect(() => {
if (!breathActive || !breathExercise) return;
breathIntervalRef.current = setInterval(() => {
setBreathTimer((t) => { if (t <= 1) { setBreathPhase((p) => { const next = p + 1; if (next >= breathExercise.phases.length) { setBreathCycle((c) => { if (c + 1 >= breathExercise.cycles) { setBreathActive(false); earn(15); return 0; } return c + 1; }); setBreathTimer(breathExercise.phases[0].duration); return 0; } setBreathTimer(breathExercise.phases[next].duration); return next; }); return 0; } return t - 1; });
}, 1000);
return () => clearInterval(breathIntervalRef.current);
}, [breathActive, breathExercise, earn]);

const newJournalPrompt = () => setJournalPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
const saveJournal = () => { if (!journalText.trim()) return; setJournalEntries((prev) => […prev, { id: Date.now(), text: journalText, prompt: journalPrompt, tags: journalTags, mood: currentMood, date: new Date().toISOString() }]); setJournalText(””); setJournalPrompt(””); setJournalTags([]); earn(20); haptic(“heavy”); };
const toggleJournalTag = (tag) => setJournalTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : […prev, tag]);
const startGrounding = (exercise) => { setGroundingExercise(exercise); setGroundingStep(0); setGroundingInputs([]); setBodyScanRegion(0); setAffirmationIndex(0); navigate(“grounding”); };

useEffect(() => { if (screen === “splash”) { const t = setTimeout(() => navigate(“onboard”), 2800); return () => clearTimeout(t); } }, [screen, navigate]);

return (
<>
<style>{FONTS}{CSS}</style>
<div style={{ minHeight: “100vh”, width: “100%”, background: “var(–bg)” }}>
<div style={{ maxWidth: 480, margin: “0 auto”, minHeight: “100vh”, position: “relative” }}>


      {screen === "splash" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 40, animation: "fade 1s ease" }}>
          <div style={{ position: "relative", width: 100, height: 100, marginBottom: 40 }}>
            <div style={{ position: "absolute", inset: 0, border: "2px solid var(--terra)", borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%", animation: "gentle-spin 20s linear infinite" }} />
            <div style={{ position: "absolute", inset: 12, border: "1.5px solid var(--sage)", borderRadius: "40% 60% 50% 50% / 60% 40% 50% 50%", animation: "gentle-spin 15s linear infinite reverse" }} />
            <div style={{ position: "absolute", inset: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, letterSpacing: 3, color: "var(--ink)" }}>mindpulse</h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--ink3)", letterSpacing: 3, marginTop: 10, fontStyle: "italic" }}>heal yourself · heal the world</p>
        </div>
      )}

      {screen === "onboard" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", animation: "enter 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 48 }}>
            {[0,1,2,3].map((i) => (<div key={i} style={{ width: i === onboardStep ? 28 : 8, height: 4, borderRadius: 2, background: i <= onboardStep ? "var(--terra)" : "var(--border)", transition: "all 0.4s ease" }} />))}
          </div>

          {onboardStep === 0 && (
            <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--terra)", letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>Welcome</p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>What should I<br/>call you?</h2>
              <p style={{ color: "var(--ink3)", fontSize: 14, marginBottom: 40 }}>I'm MindPulse — your companion on this journey.</p>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "18px 0", borderBottom: "2px solid var(--border)", fontSize: 20, fontFamily: "var(--serif)", textAlign: "center", color: "var(--ink)", background: "transparent" }} onKeyDown={(e) => e.key === "Enter" && handleOnboardNext()} autoFocus />
            </div>
          )}

          {onboardStep === 1 && (
            <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--clay)", letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>Cosmic Alignment</p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>When were you born,<br/>{userName}?</h2>
              <p style={{ color: "var(--ink3)", fontSize: 13, marginBottom: 32, maxWidth: 300, margin: "0 auto 32px" }}>Your birth chart shapes how I speak to you — the metaphors, the energy, the wisdom.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 28 }}>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} style={{ padding: "14px 20px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, color: "var(--ink)", width: 130, boxShadow: "var(--shadow)" }}>
                  <option value="">Month</option>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (<option key={m} value={i + 1}>{m}</option>))}
                </select>
                <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} style={{ padding: "14px 20px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, color: "var(--ink)", width: 90, boxShadow: "var(--shadow)" }}>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              {birthMonth && birthDay && (() => { const z = getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay)); const compat = ZODIAC_COMPATIBILITY[z.sign]; return (
                <div style={{ animation: "enter 0.5s ease" }}>
                  <Card style={{ textAlign: "center", border: "1px solid rgba(196,122,90,0.3)", background: "var(--surface2)" }}>
                    <div style={{ fontSize: 42, marginBottom: 8, fontFamily: "var(--serif)" }}>{z.symbol}</div>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, color: "var(--terra)" }}>{z.sign}</h3>
                    <p style={{ fontSize: 12, color: "var(--ink4)", letterSpacing: 2, margin: "6px 0 14px", textTransform: "uppercase" }}>{z.element} · {z.ruling} · {z.trait}</p>
                    <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6, fontStyle: "italic", fontFamily: "var(--serif)" }}>{z.energy}</p>
                  </Card>
                  {compat && (<Card style={{ textAlign: "center", marginTop: 12, padding: "18px 20px", border: "1px solid rgba(184,139,162,0.3)", background: "var(--surface2)" }}>
                    <p style={{ fontSize: 11, color: "var(--ink4)", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Highest Compatibility</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{z.symbol}</span>
                      <span style={{ fontSize: 13, color: "var(--clay)" }}>×</span>
                      <span style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{ZODIAC_SIGNS.find(s => s.sign === compat.match)?.symbol}</span>
                    </div>
                    <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 500, color: "var(--clay)", marginBottom: 6 }}>{z.sign} & {compat.match}</p>
                    <p style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.5, fontStyle: "italic", fontFamily: "var(--serif)" }}>{compat.reason}</p>
                  </Card>)}
                </div>
              ); })()}
            </div>
          )}

          {onboardStep === 2 && (
            <div style={{ animation: "enter 0.5s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--sage)", letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>Your Intention</p>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>Why are you here?</h2>
                <p style={{ color: "var(--ink3)", fontSize: 13 }}>Choose up to 3. This shapes how I guide you.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {INTENTIONS.map((item) => { const sel = intentions.includes(item.id); return (
                  <Card key={item.id} onClick={() => toggleIntention(item.id)} style={{ cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", border: sel ? "1.5px solid var(--terra)" : "1px solid var(--border)", background: sel ? "rgba(196,122,90,0.04)" : "var(--surface)" }}>
                    <div><div style={{ fontSize: 14, fontWeight: 500, color: sel ? "var(--terra)" : "var(--ink)" }}>{item.label}</div><div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 2 }}>{item.desc}</div></div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: sel ? "2px solid var(--terra)" : "2px solid var(--border)", background: sel ? "var(--terra)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", flexShrink: 0 }}>{sel && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}</div>
                  </Card>); })}
              </div>
            </div>
          )}

          {onboardStep === 3 && (
            <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
              <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px" }}>
                <div style={{ position: "absolute", inset: 0, border: "2px solid var(--terra)", borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%", animation: "gentle-spin 12s linear infinite" }} />
                <div style={{ position: "absolute", inset: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontFamily: "var(--serif)" }}>{zodiac?.symbol || "✦"}</div>
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, marginBottom: 12, lineHeight: 1.3 }}>I see you, {userName}.</h2>
              <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 16px", fontFamily: "var(--serif)", fontStyle: "italic" }}>A {zodiac?.sign} soul seeking {intentions.map(i => INTENTIONS.find(x => x.id === i)?.label.toLowerCase()).join(" & ")}.</p>
              <p style={{ color: "var(--ink3)", fontSize: 13, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>Every interaction between us plants seeds — in you, and in the world.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(107,143,113,0.1)", marginTop: 20, border: "1px solid rgba(107,143,113,0.2)" }}><span style={{ fontSize: 12, color: "var(--sage)", fontWeight: 500 }}>+50 Pulse Points earned</span></div>
            </div>
          )}

          <button onClick={handleOnboardNext} style={{ width: "100%", padding: 18, borderRadius: 100, marginTop: 40, background: "var(--terra)", color: "#fff", fontWeight: 600, fontSize: 15, letterSpacing: 0.5, boxShadow: "0 4px 16px rgba(196,122,90,0.3)", opacity: (onboardStep === 0 && !userName.trim()) || (onboardStep === 1 && (!birthMonth || !birthDay)) || (onboardStep === 2 && intentions.length === 0) ? 0.4 : 1, transition: "all 0.3s ease" }}>
            {onboardStep === 3 ? "Begin My Journey" : "Continue"}
          </button>
        </div>
      )}

      {screen === "home" && (
        <div style={{ padding: "24px 20px 120px", animation: "enter 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--ink4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>mindpulse</p>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>{new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {userName}</h2>
            </div>
            <button onClick={toggleSound} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "var(--shadow)" }}>{soundPlaying ? "♪" : "♩"}</button>
          </div>

          <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", marginBottom: 20, background: "var(--surface2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage) 0%, var(--terra) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>✦</div>
              <div><div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--serif)", color: "var(--ink)" }}>{points}</div><div style={{ fontSize: 11, color: "var(--ink4)" }}>Pulse Points</div></div>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: "var(--sage)", fontWeight: 500 }}>{Math.floor(points / 100)} trees planted</div><div style={{ fontSize: 10, color: "var(--ink4)" }}>Your healing ripples outward</div></div>
          </Card>

          <Card onClick={() => navigate("checkin")} style={{ cursor: "pointer", marginBottom: 20, padding: "28px 24px", background: currentMood ? "var(--surface2)" : "linear-gradient(135deg, rgba(196,122,90,0.06) 0%, rgba(107,143,113,0.06) 100%)", border: currentMood ? "1.5px solid " + (MOODS.find(m=>m.id===currentMood)?.color || "var(--border)") + "40" : "1px solid var(--border)" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: currentMood ? MOODS.find(m=>m.id===currentMood)?.color : "var(--terra)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{currentMood ? "Today's Energy" : "Daily Check-in"}</p>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400 }}>{currentMood ? "Feeling " + MOODS.find(m => m.id === currentMood)?.label.toLowerCase() : "How are you really feeling?"}</h3>
            <p style={{ fontSize: 12, color: "var(--ink4)", marginTop: 6 }}>{currentMood ? MOODS.find(m => m.id === currentMood)?.desc : "Tap to check in · +10 pts"}</p>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[{ label: "Talk to Me", sub: "AI companion", target: "chat", color: "var(--terra)", icon: "◉" }, { label: "Breathwork", sub: "4 exercises", target: "breathwork", color: "var(--sage)", icon: "○" }, { label: "Journal", sub: "Guided writing", target: "journal", color: "var(--warm)", icon: "▢" }, { label: "Grounding", sub: "3 techniques", target: "ground-select", color: "var(--clay)", icon: "△" }].map((item) => (
              <Card key={item.label} onClick={() => navigate(item.target)} style={{ cursor: "pointer", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid " + item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div><div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 1 }}>{item.sub}</div></div>
                <span style={{ color: "var(--ink4)", fontSize: 14 }}>→</span>
              </Card>
            ))}
          </div>

          {zodiac && (<div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface2)" }}>
            <span style={{ fontSize: 24, fontFamily: "var(--serif)" }}>{zodiac.symbol}</span>
            <div><div style={{ fontSize: 13, fontWeight: 500, color: "var(--clay)" }}>{zodiac.sign} · {zodiac.element}</div><div style={{ fontSize: 11, color: "var(--ink4)" }}>Core trait: {zodiac.trait}</div></div>
          </div>)}
        </div>
      )}

      {screen === "checkin" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%", background: currentMood ? MOODS.find(m=>m.id===currentMood)?.color : "var(--bg3)", transition: "background 0.4s ease", opacity: currentMood ? 0.8 : 0.4, boxShadow: currentMood ? "0 8px 32px " + MOODS.find(m=>m.id===currentMood)?.color + "30" : "none" }} />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>{currentMood ? MOODS.find(m => m.id === currentMood)?.label : "Feel into this moment"}</h2>
            <p style={{ color: "var(--ink4)", fontSize: 13, fontFamily: "var(--serif)", fontStyle: "italic" }}>{currentMood ? MOODS.find(m => m.id === currentMood)?.desc : "No judgment. Just honesty."}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
            {MOODS.map((mood) => (<Pill key={mood.id} active={currentMood === mood.id} onClick={() => { setCurrentMood(mood.id); haptic(); }} style={{ background: currentMood === mood.id ? mood.color : "var(--surface)", borderColor: currentMood === mood.id ? mood.color : "var(--border)", boxShadow: currentMood === mood.id ? "0 2px 8px " + mood.color + "30" : "none" }}>{mood.label}</Pill>))}
          </div>
          {currentMood && (<div style={{ animation: "enter 0.4s ease" }}>
            <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)} placeholder="What's behind this feeling? (optional)" rows={3} style={{ width: "100%", padding: 18, borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 14, resize: "none", color: "var(--ink)", lineHeight: 1.6, boxShadow: "var(--shadow)" }} />
            <button onClick={submitMood} style={{ width: "100%", padding: 18, borderRadius: 100, marginTop: 16, background: MOODS.find(m => m.id === currentMood)?.color, color: "#fff", fontWeight: 600, fontSize: 15, boxShadow: "0 4px 16px " + MOODS.find(m => m.id === currentMood)?.color + "30" }}>Log This Feeling · +10 pts</button>
          </div>)}
        </div>
      )}

      {screen === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--ink3)" }}>←</button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)" }} />
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>MindPulse</div><div style={{ fontSize: 11, color: chatLoading ? "var(--terra)" : "var(--sage)" }}>{chatLoading ? "thinking..." : "present · attuned"}</div></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: "var(--bg)" }}>
            {chatMessages.length === 0 && (<div style={{ textAlign: "center", padding: "60px 20px", animation: "fade 1s ease" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)", opacity: 0.6 }} />
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink2)", lineHeight: 1.6 }}>I'm here, {userName}.</p>
              <p style={{ color: "var(--ink4)", fontSize: 13, marginTop: 4 }}>Whatever you need to say — I'm listening.</p>
            </div>)}
            {chatMessages.map((msg, i) => (<div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, animation: "typeIn 0.3s ease" }}>
              <div style={{ maxWidth: "82%", padding: "14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "var(--terra)" : "var(--surface)", color: msg.role === "user" ? "#fff" : "var(--ink)", border: msg.role === "user" ? "none" : "1px solid var(--border)", fontSize: 14, lineHeight: 1.65, boxShadow: "var(--shadow)" }}>{msg.content}</div>
            </div>))}
            {chatLoading && (<div style={{ display: "flex", gap: 6, padding: "14px 18px" }}>{[0,1,2].map((i) => (<div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terra)", animation: "breathe-expand 1.2s ease " + (i * 0.2) + "s infinite" }} />))}</div>)}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "12px 16px 28px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Speak your truth..." rows={1} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} style={{ flex: 1, padding: "14px 18px", borderRadius: 24, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 14, resize: "none", maxHeight: 120, color: "var(--ink)" }} />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ width: 44, height: 44, borderRadius: "50%", background: chatInput.trim() ? "var(--terra)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: chatInput.trim() ? "#fff" : "var(--ink4)", transition: "all 0.3s ease", flexShrink: 0 }}>↑</button>
          </div>
        </div>
      )}

      {screen === "breathwork" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--sage)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Breathwork</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>Choose your breath</h2><p style={{ color: "var(--ink4)", fontSize: 13, marginTop: 6 }}>Each pattern serves a different purpose</p></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BREATHWORK.map((ex) => (<Card key={ex.id} onClick={() => startBreathing(ex)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: ex.phases[0].color + "18", border: "1.5px solid " + ex.phases[0].color + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: ex.phases[0].color, fontWeight: 600, flexShrink: 0, fontFamily: "var(--serif)" }}>{ex.phases.map(p => p.duration).join("·")}</div>
              <div><div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{ex.name}</div><div style={{ fontSize: 12, color: "var(--ink4)" }}>{ex.desc}</div></div>
            </Card>))}
          </div>
        </div>
      )}

      {screen === "breathe" && breathExercise && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, animation: "fade 0.5s ease" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink4)", letterSpacing: 3, marginBottom: 48, textTransform: "uppercase" }}>{breathExercise.name}</p>
          <div style={{ position: "relative", width: 200, height: 200, marginBottom: 48 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid " + (breathActive ? breathExercise.phases[breathPhase]?.color : "var(--border)"), transition: "border-color 0.5s ease", animation: breathActive ? "breathe-expand " + breathExercise.phases[breathPhase]?.duration + "s ease infinite" : "none" }} />
            <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: breathActive ? breathExercise.phases[breathPhase]?.color : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.5s ease", opacity: breathActive ? 0.8 : 0.3, boxShadow: breathActive ? "0 8px 40px " + breathExercise.phases[breathPhase]?.color + "30" : "none" }}>
              <span style={{ fontSize: 28, fontFamily: "var(--serif)", fontWeight: 600, color: breathActive ? "#fff" : "var(--ink3)" }}>{breathActive ? breathTimer : "●"}</span>
            </div>
          </div>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, marginBottom: 8, color: breathActive ? breathExercise.phases[breathPhase]?.color : "var(--ink)", transition: "color 0.5s ease" }}>{breathActive ? breathExercise.phases[breathPhase]?.label : "Ready?"}</h3>
          <p style={{ fontSize: 12, color: "var(--ink4)", marginBottom: 40 }}>{breathActive ? "Cycle " + (breathCycle + 1) + " of " + breathExercise.cycles : breathExercise.cycles + " cycles"}</p>
          <div style={{ display: "flex", gap: 12 }}>
            {breathActive ? (<button onClick={() => { setBreathActive(false); clearInterval(breathIntervalRef.current); }} style={{ padding: "14px 40px", borderRadius: 100, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink2)", fontSize: 14, boxShadow: "var(--shadow)" }}>Stop</button>
            ) : (<>
              <button onClick={() => navigate("breathwork")} style={{ padding: "14px 30px", borderRadius: 100, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink3)", fontSize: 14 }}>Back</button>
              <button onClick={() => { setBreathPhase(0); setBreathCycle(0); setBreathTimer(breathExercise.phases[0].duration); setBreathActive(true); }} style={{ padding: "14px 40px", borderRadius: 100, background: breathExercise.phases[0].color, color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px " + breathExercise.phases[0].color + "30" }}>Begin</button>
            </>)}
          </div>
          {!breathActive && breathCycle > 0 && (<div style={{ marginTop: 32, padding: "12px 20px", borderRadius: 100, background: "rgba(107,143,113,0.1)", border: "1px solid rgba(107,143,113,0.2)", animation: "enter 0.4s ease" }}><span style={{ fontSize: 13, color: "var(--sage)", fontWeight: 500 }}>+15 Pulse Points earned</span></div>)}
        </div>
      )}

      {screen === "ground-select" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--clay)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Grounding</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>Come back to earth</h2><p style={{ color: "var(--ink4)", fontSize: 13, marginTop: 6 }}>Anchor yourself in the present</p></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {GROUNDING_EXERCISES.map((ex) => (<Card key={ex.id} onClick={() => startGrounding(ex)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(184,139,162,0.1)", border: "1.5px solid rgba(184,139,162,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--clay)", fontWeight: 500, flexShrink: 0 }}>{ex.id === "5senses" ? "5" : ex.id === "bodyscan" ? "9" : "5"}</div>
              <div><div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{ex.name}</div><div style={{ fontSize: 12, color: "var(--ink4)" }}>{ex.desc}</div></div>
            </Card>))}
          </div>
        </div>
      )}

      {screen === "grounding" && groundingExercise && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
          <button onClick={() => navigate("ground-select")} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>← back</button>
          {groundingExercise.id === "5senses" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, margin: "0 auto 24px", borderRadius: "50%", background: "var(--clay)", opacity: 0.15 + groundingStep * 0.18, transition: "all 0.5s ease" }} />
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--clay)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Step {groundingStep + 1} of 5</p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, marginBottom: 28, lineHeight: 1.4 }}>{groundingExercise.steps[groundingStep]?.prompt}</h3>
              {Array.from({ length: groundingExercise.steps[groundingStep]?.count || 0 }, (_, i) => (<input key={groundingStep + "-" + i} placeholder={(i+1) + "."} value={groundingInputs[i] || ""} onChange={(e) => { const n = [...groundingInputs]; n[i] = e.target.value; setGroundingInputs(n); }} style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 14, marginBottom: 8, color: "var(--ink)", boxShadow: "var(--shadow)" }} />))}
              <button onClick={() => { if (groundingStep < 4) { setGroundingStep(groundingStep + 1); setGroundingInputs([]); } else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, marginTop: 16, background: "var(--clay)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{groundingStep < 4 ? "Next Sense →" : "Complete · +20 pts"}</button>
            </div>
          )}
          {groundingExercise.id === "bodyscan" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--sage)", letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>Body Scan</p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, marginBottom: 8 }}>Bring awareness to your</h3>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, color: "var(--sage)", marginBottom: 28 }}>{groundingExercise.regions[bodyScanRegion]}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 }}>{groundingExercise.regions.map((r, i) => (<div key={r} style={{ height: 3, borderRadius: 2, transition: "all 0.5s ease", background: i <= bodyScanRegion ? "var(--sage)" : "var(--border)", opacity: i <= bodyScanRegion ? 1 : 0.3 }} />))}</div>
              <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, fontFamily: "var(--serif)", fontStyle: "italic" }}>Breathe into this area. Notice any tension, warmth, or sensation. Don't change it — just observe.</p>
              <button onClick={() => { if (bodyScanRegion < groundingExercise.regions.length - 1) setBodyScanRegion(bodyScanRegion + 1); else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, background: "var(--sage)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{bodyScanRegion < groundingExercise.regions.length - 1 ? "Move Awareness ↓" : "Complete · +20 pts"}</button>
            </div>
          )}
          {groundingExercise.id === "affirmation" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--terra)", letterSpacing: 2, marginBottom: 28, textTransform: "uppercase" }}>Mirror Work</p>
              <Card style={{ padding: "40px 24px", marginBottom: 28, background: "var(--surface2)", border: "1px solid rgba(196,122,90,0.2)" }}>
                <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, lineHeight: 1.5, color: "var(--terra)" }}>"{groundingExercise.affirmations[affirmationIndex]}"</p>
              </Card>
              <p style={{ color: "var(--ink4)", fontSize: 13, marginBottom: 28 }}>Say this out loud. Let it sink in. Repeat it until you feel it.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>{groundingExercise.affirmations.map((_, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= affirmationIndex ? "var(--terra)" : "var(--border)", transition: "all 0.3s ease" }} />))}</div>
              <button onClick={() => { if (affirmationIndex < groundingExercise.affirmations.length - 1) setAffirmationIndex(affirmationIndex + 1); else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, background: "var(--terra)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{affirmationIndex < groundingExercise.affirmations.length - 1 ? "Next Affirmation →" : "Complete · +20 pts"}</button>
            </div>
          )}
        </div>
      )}

      {screen === "journal" && (
        <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
          <button onClick={() => navigate("home")} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>← back</button>
          <div style={{ textAlign: "center", marginBottom: 24 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--warm)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Journal</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Pour it out</h2><p style={{ color: "var(--ink4)", fontSize: 13 }}>Unfiltered. Unjudged. Yours.</p></div>
          <Card onClick={newJournalPrompt} style={{ cursor: "pointer", textAlign: "center", marginBottom: 20, padding: "18px 20px", border: journalPrompt ? "1px solid rgba(212,149,106,0.3)" : "1px solid var(--border)", background: journalPrompt ? "var(--surface2)" : "var(--surface)" }}>
            {journalPrompt ? (<p style={{ fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic", color: "var(--warm)", lineHeight: 1.5 }}>"{journalPrompt}"</p>) : (<p style={{ fontSize: 13, color: "var(--ink4)" }}>Tap for a writing prompt</p>)}
          </Card>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["grateful", "anxious", "hopeful", "sad", "angry", "peaceful", "confused", "inspired"].map((tag) => (<Pill key={tag} active={journalTags.includes(tag)} onClick={() => toggleJournalTag(tag)} style={{ padding: "6px 14px", fontSize: 12 }}>{tag}</Pill>))}
          </div>
          <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Start writing..." rows={8} style={{ width: "100%", padding: 20, borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, resize: "none", color: "var(--ink)", lineHeight: 1.8, fontFamily: "var(--serif)", boxShadow: "var(--shadow)" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}><span style={{ fontSize: 11, color: "var(--ink4)" }}>{journalText.length} chars</span></div>
          <button onClick={saveJournal} disabled={!journalText.trim()} style={{ width: "100%", padding: 18, borderRadius: 100, marginTop: 12, background: journalText.trim() ? "var(--warm)" : "var(--bg3)", color: journalText.trim() ? "#fff" : "var(--ink4)", fontWeight: 600, fontSize: 15, transition: "all 0.3s ease", boxShadow: journalText.trim() ? "0 4px 16px rgba(212,149,106,0.3)" : "none" }}>Save Entry · +20 pts</button>
          {journalEntries.length > 0 && (<div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink4)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Past Entries</p>
            {journalEntries.slice().reverse().map((entry) => (<Card key={entry.id} style={{ marginBottom: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{entry.tags.map((t) => (<span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "var(--bg)", color: "var(--ink3)", border: "1px solid var(--border)" }}>{t}</span>))}</div>
                <span style={{ fontSize: 10, color: "var(--ink4)" }}>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
              {entry.prompt && (<p style={{ fontSize: 12, color: "var(--warm)", fontStyle: "italic", marginBottom: 6, fontFamily: "var(--serif)" }}>"{entry.prompt}"</p>)}
              <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>{entry.text.length > 150 ? entry.text.slice(0, 150) + "..." : entry.text}</p>
            </Card>))}
          </div>)}
        </div>
      )}

    </div>
  </div>
</>


);
}