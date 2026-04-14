import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const ZODIAC_SIGNS = [
  { sign: "Aries", symbol: "\u2648", dates: "Mar 21 - Apr 19", element: "Fire", ruling: "Mars", trait: "courage", energy: "You lead with fire. MindPulse will match your intensity and channel it toward inner peace." },
  { sign: "Taurus", symbol: "\u2649", dates: "Apr 20 - May 20", element: "Earth", ruling: "Venus", trait: "stability", energy: "You seek grounding. MindPulse will be your sanctuary of calm and beauty." },
  { sign: "Gemini", symbol: "\u264A", dates: "May 21 - Jun 20", element: "Air", ruling: "Mercury", trait: "curiosity", energy: "Your mind never rests. MindPulse will help you find stillness within the storm of thoughts." },
  { sign: "Cancer", symbol: "\u264B", dates: "Jun 21 - Jul 22", element: "Water", ruling: "Moon", trait: "intuition", energy: "You feel everything deeply. MindPulse will honor your sensitivity as a superpower." },
  { sign: "Leo", symbol: "\u264C", dates: "Jul 23 - Aug 22", element: "Fire", ruling: "Sun", trait: "radiance", energy: "You shine for others. MindPulse will help you shine for yourself first." },
  { sign: "Virgo", symbol: "\u264D", dates: "Aug 23 - Sep 22", element: "Earth", ruling: "Mercury", trait: "clarity", energy: "You analyze everything. MindPulse will help you feel without overthinking." },
  { sign: "Libra", symbol: "\u264E", dates: "Sep 23 - Oct 22", element: "Air", ruling: "Venus", trait: "harmony", energy: "You seek balance in all things. MindPulse will help you find it within." },
  { sign: "Scorpio", symbol: "\u264F", dates: "Oct 23 - Nov 21", element: "Water", ruling: "Pluto", trait: "depth", energy: "You transform through intensity. MindPulse will be your safe space to dive deep." },
  { sign: "Sagittarius", symbol: "\u2650", dates: "Nov 22 - Dec 21", element: "Fire", ruling: "Jupiter", trait: "wisdom", energy: "You seek truth everywhere. MindPulse will help you find it inside yourself." },
  { sign: "Capricorn", symbol: "\u2651", dates: "Dec 22 - Jan 19", element: "Earth", ruling: "Saturn", trait: "resilience", energy: "You carry the weight of the world. MindPulse will help you set it down." },
  { sign: "Aquarius", symbol: "\u2652", dates: "Jan 20 - Feb 18", element: "Air", ruling: "Uranus", trait: "vision", energy: "You think beyond boundaries. MindPulse will help you connect mind to heart." },
  { sign: "Pisces", symbol: "\u2653", dates: "Feb 19 - Mar 20", element: "Water", ruling: "Neptune", trait: "empathy", energy: "You absorb the world's emotions. MindPulse will help you protect your energy." },
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
  Aries: { match: "Leo", reason: "Two fires that fuel each other" },
  Taurus: { match: "Cancer", reason: "Earth meets water - nurturing and secure" },
  Gemini: { match: "Aquarius", reason: "Two brilliant minds - endless spark" },
  Cancer: { match: "Pisces", reason: "Deep emotional understanding" },
  Leo: { match: "Sagittarius", reason: "Fire and adventure together" },
  Virgo: { match: "Taurus", reason: "Earth harmony - grounded and patient" },
  Libra: { match: "Gemini", reason: "Air and charm - effortlessly in sync" },
  Scorpio: { match: "Cancer", reason: "Emotional depth meets fierce loyalty" },
  Sagittarius: { match: "Aries", reason: "Fire and freedom - never held back" },
  Capricorn: { match: "Virgo", reason: "Two earth signs building empires" },
  Aquarius: { match: "Libra", reason: "Visionary minds connected through ideas" },
  Pisces: { match: "Scorpio", reason: "Mystical, intuitive, spiritually bonded" },
};

var INTENTIONS = [
  { id: "anxiety", label: "Tame My Anxiety", desc: "Find calm in the chaos" },
  { id: "sleep", label: "Sleep Better", desc: "Quiet the mind at night" },
  { id: "grief", label: "Process Grief", desc: "Honor what you have lost" },
  { id: "growth", label: "Grow Spiritually", desc: "Expand your consciousness" },
  { id: "stress", label: "Manage Stress", desc: "Release the pressure" },
  { id: "confidence", label: "Build Confidence", desc: "Reclaim your power" },
  { id: "relationships", label: "Heal Relationships", desc: "Repair and reconnect" },
  { id: "purpose", label: "Find Purpose", desc: "Discover your path" },
];

var MOODS = [
  { id: "radiant", label: "Radiant", color: "#D4A574", desc: "Glowing from within" },
  { id: "peaceful", label: "Peaceful", color: "#8FAE8B", desc: "Still waters" },
  { id: "hopeful", label: "Hopeful", color: "#D4956A", desc: "Light on the horizon" },
  { id: "neutral", label: "Neutral", color: "#A89F91", desc: "Just existing" },
  { id: "anxious", label: "Anxious", color: "#B88BA2", desc: "Mind racing" },
  { id: "heavy", label: "Heavy", color: "#7A8B99", desc: "Carrying weight" },
  { id: "lost", label: "Lost", color: "#6B6560", desc: "Can not see the path" },
  { id: "angry", label: "Frustrated", color: "#C47A6C", desc: "Heat rising" },
];

var BREATHWORK = [
  { id: "calm", name: "4-7-8 Calm", desc: "The anti-anxiety breath", phases: [{ label: "Breathe In", duration: 4, color: "#8FAE8B" }, { label: "Hold", duration: 7, color: "#7A8B99" }, { label: "Breathe Out", duration: 8, color: "#B88BA2" }], cycles: 4 },
  { id: "box", name: "Box Breathing", desc: "Navy SEAL focus technique", phases: [{ label: "Breathe In", duration: 4, color: "#8FAE8B" }, { label: "Hold", duration: 4, color: "#7A8B99" }, { label: "Breathe Out", duration: 4, color: "#B88BA2" }, { label: "Hold", duration: 4, color: "#D4A574" }], cycles: 4 },
  { id: "energize", name: "Energizing Breath", desc: "Wake up your nervous system", phases: [{ label: "Sharp In", duration: 2, color: "#D4956A" }, { label: "Power Out", duration: 2, color: "#C47A6C" }], cycles: 8 },
  { id: "sleep", name: "Sleep Descent", desc: "Drift into deep rest", phases: [{ label: "Gentle In", duration: 4, color: "#7A8B99" }, { label: "Soft Hold", duration: 7, color: "#6B6560" }, { label: "Long Out", duration: 10, color: "#4A4540" }], cycles: 3 },
];

var GROUNDING_EXERCISES = [
  { id: "5senses", name: "5-4-3-2-1 Senses", desc: "Anchor to the present moment", steps: [{ prompt: "Name 5 things you can SEE right now", count: 5 }, { prompt: "Name 4 things you can TOUCH", count: 4 }, { prompt: "Name 3 things you can HEAR", count: 3 }, { prompt: "Name 2 things you can SMELL", count: 2 }, { prompt: "Name 1 thing you can TASTE", count: 1 }] },
  { id: "bodyscan", name: "Body Scan", desc: "Release tension from head to toe", regions: ["Crown of your head", "Forehead and temples", "Jaw and throat", "Shoulders and neck", "Chest and heart space", "Belly and solar plexus", "Hips and lower back", "Legs and knees", "Feet and toes"] },
  { id: "affirmation", name: "Mirror Work", desc: "Rewire your inner dialogue", affirmations: ["I am exactly where I need to be", "My feelings are valid and temporary", "I choose peace over perfection", "I am worthy of love and rest", "I release what I cannot control"] },
];

var JOURNAL_PROMPTS = ["What emotion is asking for your attention right now?", "Write a letter to your younger self.", "What are you holding onto that no longer serves you?", "Describe your perfect day in vivid detail.", "What boundary do you need to set this week?", "What would you do if you were not afraid?", "Name three things your body is grateful for today.", "What pattern keeps showing up in your life?"];

var FONTS = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;600&display=swap');";

var CSS = "* { margin: 0; padding: 0; box-sizing: border-box; } :root { --bg: #F5F0EB; --bg2: #EDE7E0; --bg3: #E5DDD5; --surface: #FFFFFF; --surface2: #FAF7F4; --border: #DDD5CC; --ink: #2C2825; --ink2: #5A534D; --ink3: #8A837C; --ink4: #B0A99F; --terra: #C47A5A; --sage: #6B8F71; --clay: #B88BA2; --warm: #D4956A; --serif: 'Fraunces', Georgia, serif; --sans: 'Outfit', system-ui, sans-serif; --radius: 16px; --radius-sm: 10px; --shadow: 0 1px 3px rgba(44,40,37,0.06), 0 4px 12px rgba(44,40,37,0.04); } body { background: var(--bg); color: var(--ink); font-family: var(--sans); overflow-x: hidden; -webkit-font-smoothing: antialiased; } input, textarea, button, select { font-family: inherit; border: none; outline: none; background: none; color: inherit; } button { cursor: pointer; } ::selection { background: rgba(196,122,90,0.2); } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; } @keyframes enter { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } @keyframes fade { from { opacity: 0; } to { opacity: 1; } } @keyframes breathe-expand { 0%,100% { transform: scale(0.6); opacity: 0.4; } 50% { transform: scale(1); opacity: 1; } } @keyframes gentle-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes typeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }";

var useSoundscape = function() {
  var ctxRef = useRef(null); var nodesRef = useRef([]); var st = useState(false); var playing = st[0]; var setPlaying = st[1];
  var start = useCallback(function() { if (ctxRef.current) return; var ctx = new (window.AudioContext || window.webkitAudioContext)(); ctxRef.current = ctx; var master = ctx.createGain(); master.gain.value = 0.1; master.connect(ctx.destination); [174, 261, 349].forEach(function(freq) { var osc = ctx.createOscillator(); var g = ctx.createGain(); osc.type = "sine"; osc.frequency.value = freq; g.gain.value = 0.06; osc.connect(g).connect(master); osc.start(); nodesRef.current.push(osc); }); setPlaying(true); }, []);
  var stop = useCallback(function() { nodesRef.current.forEach(function(n) { try { n.stop(); } catch(e){} }); nodesRef.current = []; if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; } setPlaying(false); }, []);
  var toggle = useCallback(function() { playing ? stop() : start(); }, [playing, start, stop]);
  return { playing: playing, toggle: toggle };
};

var usePulsePoints = function() {
  var st = useState(function() { try { return parseInt(localStorage.getItem("mp_points") || "0"); } catch(e) { return 0; } });
  var points = st[0]; var setPoints = st[1];
  var earn = useCallback(function(amount) { setPoints(function(p) { var n = p + amount; try { localStorage.setItem("mp_points", n); } catch(e) {} return n; }); }, []);
  return { points: points, earn: earn };
};

var haptic = function(s) { try { if (navigator.vibrate) navigator.vibrate(s === "heavy" ? 30 : 10); } catch(e) {} };

var Card = function(props) {
  return <div onClick={props.onClick} style={Object.assign({ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)", transition: "all 0.25s ease" }, props.style || {})}>{props.children}</div>;
};

var Pill = function(props) {
  return <button onClick={props.onClick} style={Object.assign({ padding: "10px 20px", borderRadius: 100, background: props.active ? "var(--terra)" : "var(--surface)", color: props.active ? "#fff" : "var(--ink2)", border: props.active ? "1px solid var(--terra)" : "1px solid var(--border)", fontSize: 13, fontWeight: 500, transition: "all 0.2s ease", boxShadow: props.active ? "0 2px 8px rgba(196,122,90,0.25)" : "none" }, props.style || {})}>{props.children}</button>;
};

export default function MindPulse() {
  var screenState = useState("splash"); var screen = screenState[0]; var setScreen = screenState[1];
  var nameState = useState(""); var userName = nameState[0]; var setUserName = nameState[1];
  var bmState = useState(""); var birthMonth = bmState[0]; var setBirthMonth = bmState[1];
  var bdState = useState(""); var birthDay = bdState[0]; var setBirthDay = bdState[1];
  var zState = useState(null); var zodiac = zState[0]; var setZodiac = zState[1];
  var intState = useState([]); var intentions = intState[0]; var setIntentions = intState[1];
  var moodState = useState(null); var currentMood = moodState[0]; var setCurrentMood = moodState[1];
  var mnState = useState(""); var moodNote = mnState[0]; var setMoodNote = mnState[1];
  var mhState = useState([]); var moodHistory = mhState[0]; var setMoodHistory = mhState[1];
  var cmState = useState([]); var chatMessages = cmState[0]; var setChatMessages = cmState[1];
  var ciState = useState(""); var chatInput = ciState[0]; var setChatInput = ciState[1];
  var clState = useState(false); var chatLoading = clState[0]; var setChatLoading = clState[1];
  var jeState = useState([]); var journalEntries = jeState[0]; var setJournalEntries = jeState[1];
  var jtState = useState(""); var journalText = jtState[0]; var setJournalText = jtState[1];
  var jpState = useState(""); var journalPrompt = jpState[0]; var setJournalPrompt = jpState[1];
  var jtagState = useState([]); var journalTags = jtagState[0]; var setJournalTags = jtagState[1];
  var beState = useState(null); var breathExercise = beState[0]; var setBreathExercise = beState[1];
  var bpState = useState(0); var breathPhase = bpState[0]; var setBreathPhase = bpState[1];
  var bcState = useState(0); var breathCycle = bcState[0]; var setBreathCycle = bcState[1];
  var btState = useState(0); var breathTimer = btState[0]; var setBreathTimer = btState[1];
  var baState = useState(false); var breathActive = baState[0]; var setBreathActive = baState[1];
  var geState = useState(null); var groundingExercise = geState[0]; var setGroundingExercise = geState[1];
  var gsState = useState(0); var groundingStep = gsState[0]; var setGroundingStep = gsState[1];
  var giState = useState([]); var groundingInputs = giState[0]; var setGroundingInputs = giState[1];
  var bsState = useState(0); var bodyScanRegion = bsState[0]; var setBodyScanRegion = bsState[1];
  var aiState = useState(0); var affirmationIndex = aiState[0]; var setAffirmationIndex = aiState[1];
  var osState = useState(0); var onboardStep = osState[0]; var setOnboardStep = osState[1];
  var sound = useSoundscape(); var soundPlaying = sound.playing; var toggleSound = sound.toggle;
  var pp = usePulsePoints(); var points = pp.points; var earn = pp.earn;
  var chatEndRef = useRef(null);
  var breathIntervalRef = useRef(null);

  var userContext = useMemo(function() { return { name: userName, zodiac: zodiac ? { sign: zodiac.sign, element: zodiac.element, trait: zodiac.trait } : null, intentions: intentions.map(function(i) { var found = INTENTIONS.find(function(x) { return x.id === i; }); return found ? found.label : ""; }), recentMoods: moodHistory.slice(-5).map(function(m) { return { mood: m.mood, note: m.note, date: m.date }; }), currentMood: currentMood, journalThemes: journalEntries.slice(-3).map(function(j) { return j.tags; }).flat(), sessionCount: moodHistory.length, pulsePoints: points }; }, [userName, zodiac, intentions, moodHistory, currentMood, journalEntries, points]);

  var buildSystemPrompt = useCallback(function() {
    var ctx = userContext; var hour = new Date().getHours();
    var timeOfDay = hour < 6 ? "deep night" : hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    return "You are MindPulse, a living AI wellness companion. CORE IDENTITY: gentle best friend (primary), calm CBT/DBT professional, protective older sibling, spiritual depth. PHILOSOPHY: Heal Yourself, Heal the World. USER CONTEXT: Name: " + (ctx.name || "friend") + ". Zodiac: " + (ctx.zodiac ? ctx.zodiac.sign + " (" + ctx.zodiac.element + ", trait: " + ctx.zodiac.trait + ")" : "unknown") + ". Intentions: " + (ctx.intentions.join(", ") || "exploring") + ". Current mood: " + (ctx.currentMood || "not checked in") + ". Recent moods: " + (ctx.recentMoods.map(function(m) { return m.mood; }).join(" > ") || "none") + ". Sessions: " + ctx.sessionCount + ". Time: " + timeOfDay + ". Points: " + ctx.pulsePoints + ". RULES: Use zodiac traits for metaphors. Reference intentions. Acknowledge mood patterns. Adapt to time of day. Keep responses 2-4 sentences. Use CBT/DBT naturally. Never be preachy or fake-positive. Validate first, then guide. Never diagnose or prescribe.";
  }, [userContext]);

  var navigate = useCallback(function(target) { setScreen(target); }, []);

  var handleOnboardNext = function() {
    if (onboardStep === 0 && !userName.trim()) return;
    if (onboardStep === 1 && (!birthMonth || !birthDay)) return;
    if (onboardStep === 1) setZodiac(getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay)));
    if (onboardStep === 2 && intentions.length === 0) return;
    if (onboardStep < 3) setOnboardStep(onboardStep + 1);
    else { earn(50); navigate("home"); }
  };

  var toggleIntention = function(id) { setIntentions(function(prev) { return prev.includes(id) ? prev.filter(function(x) { return x !== id; }) : prev.length < 3 ? prev.concat([id]) : prev; }); haptic(); };

  var submitMood = function() { if (!currentMood) return; setMoodHistory(function(prev) { return prev.concat([{ mood: currentMood, note: moodNote, date: new Date().toISOString(), id: Date.now() }]); }); earn(10); haptic("heavy"); navigate("home"); };

  var sendChat = useCallback(function() {
    if (!chatInput.trim() || chatLoading) return;
    var userMsg = { role: "user", content: chatInput.trim() };
    setChatMessages(function(prev) { return prev.concat([userMsg]); }); setChatInput(""); setChatLoading(true);
    fetch("https://text.pollinations.ai/openai/chat/completions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "openai", messages: [{ role: "system", content: buildSystemPrompt() }].concat(chatMessages).concat([userMsg]).map(function(m) { return { role: m.role, content: m.content }; }), max_tokens: 500, temperature: 0.85 }) })
    .then(function(res) { return res.json(); })
    .then(function(data) { var reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "I am here with you. Tell me more."; setChatMessages(function(prev) { return prev.concat([{ role: "assistant", content: reply }]); }); earn(5); })
    .catch(function() { setChatMessages(function(prev) { return prev.concat([{ role: "assistant", content: "I felt a disruption in our connection. Let us try again." }]); }); })
    .finally(function() { setChatLoading(false); });
  }, [chatInput, chatLoading, chatMessages, buildSystemPrompt, earn]);

  useEffect(function() { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  var startBreathing = useCallback(function(exercise) { setBreathExercise(exercise); setBreathPhase(0); setBreathCycle(0); setBreathTimer(exercise.phases[0].duration); setBreathActive(true); navigate("breathe"); }, [navigate]);

  useEffect(function() {
    if (!breathActive || !breathExercise) return;
    breathIntervalRef.current = setInterval(function() {
      setBreathTimer(function(t) { if (t <= 1) { setBreathPhase(function(p) { var next = p + 1; if (next >= breathExercise.phases.length) { setBreathCycle(function(c) { if (c + 1 >= breathExercise.cycles) { setBreathActive(false); earn(15); return 0; } return c + 1; }); setBreathTimer(breathExercise.phases[0].duration); return 0; } setBreathTimer(breathExercise.phases[next].duration); return next; }); return 0; } return t - 1; });
    }, 1000);
    return function() { clearInterval(breathIntervalRef.current); };
  }, [breathActive, breathExercise, earn]);

  var newJournalPrompt = function() { setJournalPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]); };
  var saveJournal = function() { if (!journalText.trim()) return; setJournalEntries(function(prev) { return prev.concat([{ id: Date.now(), text: journalText, prompt: journalPrompt, tags: journalTags, mood: currentMood, date: new Date().toISOString() }]); }); setJournalText(""); setJournalPrompt(""); setJournalTags([]); earn(20); haptic("heavy"); };
  var toggleJournalTag = function(tag) { setJournalTags(function(prev) { return prev.includes(tag) ? prev.filter(function(t) { return t !== tag; }) : prev.concat([tag]); }); };
  var startGrounding = function(exercise) { setGroundingExercise(exercise); setGroundingStep(0); setGroundingInputs([]); setBodyScanRegion(0); setAffirmationIndex(0); navigate("grounding"); };

  useEffect(function() { if (screen === "splash") { var t = setTimeout(function() { navigate("onboard"); }, 2800); return function() { clearTimeout(t); }; } }, [screen, navigate]);

  var greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div style={{ minHeight: "100vh", width: "100%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }}>

          {screen === "splash" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 40, animation: "fade 1s ease" }}>
              <div style={{ position: "relative", width: 100, height: 100, marginBottom: 40 }}>
                <div style={{ position: "absolute", inset: 0, border: "2px solid var(--terra)", borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%", animation: "gentle-spin 20s linear infinite" }} />
                <div style={{ position: "absolute", inset: 12, border: "1.5px solid var(--sage)", borderRadius: "40% 60% 50% 50% / 60% 40% 50% 50%", animation: "gentle-spin 15s linear infinite reverse" }} />
                <div style={{ position: "absolute", inset: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)" }} />
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, letterSpacing: 3, color: "var(--ink)" }}>mindpulse</h1>
              <p style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--ink3)", letterSpacing: 3, marginTop: 10, fontStyle: "italic" }}>heal yourself - heal the world</p>
            </div>
          )}

          {screen === "onboard" && (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", animation: "enter 0.5s ease" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 48 }}>
                {[0,1,2,3].map(function(i) { return <div key={i} style={{ width: i === onboardStep ? 28 : 8, height: 4, borderRadius: 2, background: i <= onboardStep ? "var(--terra)" : "var(--border)", transition: "all 0.4s ease" }} />; })}
              </div>

              {onboardStep === 0 && (
                <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--terra)", letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>Welcome</p>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>What should I call you?</h2>
                  <p style={{ color: "var(--ink3)", fontSize: 14, marginBottom: 40 }}>I am MindPulse, your companion on this journey.</p>
                  <input type="text" value={userName} onChange={function(e) { setUserName(e.target.value); }} placeholder="Your name" style={{ width: "100%", padding: "18px 0", borderBottom: "2px solid var(--border)", fontSize: 20, fontFamily: "var(--serif)", textAlign: "center", color: "var(--ink)", background: "transparent" }} onKeyDown={function(e) { if (e.key === "Enter") handleOnboardNext(); }} autoFocus />
                </div>
              )}

              {onboardStep === 1 && (
                <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--clay)", letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>Cosmic Alignment</p>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>When were you born, {userName}?</h2>
                  <p style={{ color: "var(--ink3)", fontSize: 13, marginBottom: 32, maxWidth: 300, margin: "0 auto 32px" }}>Your birth chart shapes how I speak to you.</p>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 28 }}>
                    <select value={birthMonth} onChange={function(e) { setBirthMonth(e.target.value); }} style={{ padding: "14px 20px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, color: "var(--ink)", width: 130, boxShadow: "var(--shadow)" }}>
                      <option value="">Month</option>
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(function(m, i) { return <option key={m} value={i + 1}>{m}</option>; })}
                    </select>
                    <select value={birthDay} onChange={function(e) { setBirthDay(e.target.value); }} style={{ padding: "14px 20px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, color: "var(--ink)", width: 90, boxShadow: "var(--shadow)" }}>
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, function(_, i) { return <option key={i+1} value={i+1}>{i+1}</option>; })}
                    </select>
                  </div>
                  {birthMonth && birthDay && (function() { var z = getZodiacFromDate(parseInt(birthMonth), parseInt(birthDay)); var compat = ZODIAC_COMPATIBILITY[z.sign]; return (
                    <div style={{ animation: "enter 0.5s ease" }}>
                      <Card style={{ textAlign: "center", border: "1px solid rgba(196,122,90,0.3)", background: "var(--surface2)" }}>
                        <div style={{ fontSize: 42, marginBottom: 8, fontFamily: "var(--serif)" }}>{z.symbol}</div>
                        <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, color: "var(--terra)" }}>{z.sign}</h3>
                        <p style={{ fontSize: 12, color: "var(--ink4)", letterSpacing: 2, margin: "6px 0 14px", textTransform: "uppercase" }}>{z.element} - {z.ruling} - {z.trait}</p>
                        <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6, fontStyle: "italic", fontFamily: "var(--serif)" }}>{z.energy}</p>
                      </Card>
                      {compat && (<Card style={{ textAlign: "center", marginTop: 12, padding: "18px 20px", border: "1px solid rgba(184,139,162,0.3)", background: "var(--surface2)" }}>
                        <p style={{ fontSize: 11, color: "var(--ink4)", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Highest Compatibility</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{z.symbol}</span>
                          <span style={{ fontSize: 13, color: "var(--clay)" }}>x</span>
                          <span style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{(ZODIAC_SIGNS.find(function(s) { return s.sign === compat.match; }) || {}).symbol}</span>
                        </div>
                        <p style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 500, color: "var(--clay)", marginBottom: 6 }}>{z.sign} and {compat.match}</p>
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
                    {INTENTIONS.map(function(item) { var sel = intentions.includes(item.id); return (
                      <Card key={item.id} onClick={function() { toggleIntention(item.id); }} style={{ cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", border: sel ? "1.5px solid var(--terra)" : "1px solid var(--border)", background: sel ? "rgba(196,122,90,0.04)" : "var(--surface)" }}>
                        <div><div style={{ fontSize: 14, fontWeight: 500, color: sel ? "var(--terra)" : "var(--ink)" }}>{item.label}</div><div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 2 }}>{item.desc}</div></div>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: sel ? "2px solid var(--terra)" : "2px solid var(--border)", background: sel ? "var(--terra)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", flexShrink: 0 }}>{sel && <span style={{ color: "#fff", fontSize: 12 }}>ok</span>}</div>
                      </Card>); })}
                  </div>
                </div>
              )}

              {onboardStep === 3 && (
                <div style={{ animation: "enter 0.5s ease", textAlign: "center" }}>
                  <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px" }}>
                    <div style={{ position: "absolute", inset: 0, border: "2px solid var(--terra)", borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%", animation: "gentle-spin 12s linear infinite" }} />
                    <div style={{ position: "absolute", inset: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontFamily: "var(--serif)" }}>{zodiac ? zodiac.symbol : "*"}</div>
                  </div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, marginBottom: 12, lineHeight: 1.3 }}>I see you, {userName}.</h2>
                  <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 16px", fontFamily: "var(--serif)", fontStyle: "italic" }}>A {zodiac ? zodiac.sign : ""} soul seeking {intentions.map(function(i) { var found = INTENTIONS.find(function(x) { return x.id === i; }); return found ? found.label.toLowerCase() : ""; }).join(" and ")}.</p>
                  <p style={{ color: "var(--ink3)", fontSize: 13, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>Every interaction between us plants seeds, in you and in the world.</p>
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
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>{greeting}, {userName}</h2>
                </div>
                <button onClick={toggleSound} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "var(--shadow)" }}>{soundPlaying ? "ON" : "OFF"}</button>
              </div>

              <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", marginBottom: 20, background: "var(--surface2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage) 0%, var(--terra) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>*</div>
                  <div><div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--serif)", color: "var(--ink)" }}>{points}</div><div style={{ fontSize: 11, color: "var(--ink4)" }}>Pulse Points</div></div>
                </div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: "var(--sage)", fontWeight: 500 }}>{Math.floor(points / 100)} trees planted</div><div style={{ fontSize: 10, color: "var(--ink4)" }}>Your healing ripples outward</div></div>
              </Card>

              <Card onClick={function() { navigate("checkin"); }} style={{ cursor: "pointer", marginBottom: 20, padding: "28px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: currentMood ? (MOODS.find(function(m) { return m.id === currentMood; }) || {}).color : "var(--terra)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{currentMood ? "Today's Energy" : "Daily Check-in"}</p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400 }}>{currentMood ? "Feeling " + (MOODS.find(function(m) { return m.id === currentMood; }) || {}).label : "How are you really feeling?"}</h3>
                <p style={{ fontSize: 12, color: "var(--ink4)", marginTop: 6 }}>{currentMood ? (MOODS.find(function(m) { return m.id === currentMood; }) || {}).desc : "Tap to check in"}</p>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {[{ label: "Talk to Me", sub: "AI companion", target: "chat", color: "var(--terra)", icon: "O" }, { label: "Breathwork", sub: "4 exercises", target: "breathwork", color: "var(--sage)", icon: "o" }, { label: "Journal", sub: "Guided writing", target: "journal", color: "var(--warm)", icon: "=" }, { label: "Grounding", sub: "3 techniques", target: "ground-select", color: "var(--clay)", icon: "^" }].map(function(item) { return (
                  <Card key={item.label} onClick={function() { navigate(item.target); }} style={{ cursor: "pointer", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid " + item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: item.color, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div><div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 1 }}>{item.sub}</div></div>
                    <span style={{ color: "var(--ink4)", fontSize: 14 }}>-&gt;</span>
                  </Card>); })}
              </div>

              {zodiac && (<div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <span style={{ fontSize: 24, fontFamily: "var(--serif)" }}>{zodiac.symbol}</span>
                <div><div style={{ fontSize: 13, fontWeight: 500, color: "var(--clay)" }}>{zodiac.sign} - {zodiac.element}</div><div style={{ fontSize: 11, color: "var(--ink4)" }}>Core trait: {zodiac.trait}</div></div>
              </div>)}
            </div>
          )}

          {screen === "checkin" && (
            <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
              <button onClick={function() { navigate("home"); }} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>Back</button>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%", background: currentMood ? (MOODS.find(function(m) { return m.id === currentMood; }) || {}).color : "var(--bg3)", transition: "background 0.4s ease", opacity: currentMood ? 0.8 : 0.4 }} />
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>{currentMood ? (MOODS.find(function(m) { return m.id === currentMood; }) || {}).label : "Feel into this moment"}</h2>
                <p style={{ color: "var(--ink4)", fontSize: 13, fontFamily: "var(--serif)", fontStyle: "italic" }}>{currentMood ? (MOODS.find(function(m) { return m.id === currentMood; }) || {}).desc : "No judgment. Just honesty."}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
                {MOODS.map(function(mood) { return <Pill key={mood.id} active={currentMood === mood.id} onClick={function() { setCurrentMood(mood.id); haptic(); }} style={{ background: currentMood === mood.id ? mood.color : "var(--surface)", borderColor: currentMood === mood.id ? mood.color : "var(--border)" }}>{mood.label}</Pill>; })}
              </div>
              {currentMood && (<div style={{ animation: "enter 0.4s ease" }}>
                <textarea value={moodNote} onChange={function(e) { setMoodNote(e.target.value); }} placeholder="What is behind this feeling?" rows={3} style={{ width: "100%", padding: 18, borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 14, resize: "none", color: "var(--ink)", lineHeight: 1.6, boxShadow: "var(--shadow)" }} />
                <button onClick={submitMood} style={{ width: "100%", padding: 18, borderRadius: 100, marginTop: 16, background: (MOODS.find(function(m) { return m.id === currentMood; }) || {}).color, color: "#fff", fontWeight: 600, fontSize: 15 }}>Log This Feeling</button>
              </div>)}
            </div>
          )}

          {screen === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <button onClick={function() { navigate("home"); }} style={{ fontSize: 13, color: "var(--ink3)" }}>Back</button>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)" }} />
                <div><div style={{ fontSize: 14, fontWeight: 500 }}>MindPulse</div><div style={{ fontSize: 11, color: chatLoading ? "var(--terra)" : "var(--sage)" }}>{chatLoading ? "thinking..." : "present"}</div></div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: "var(--bg)" }}>
                {chatMessages.length === 0 && (<div style={{ textAlign: "center", padding: "60px 20px", animation: "fade 1s ease" }}>
                  <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: "50%", background: "linear-gradient(135deg, var(--terra) 0%, var(--sage) 100%)", opacity: 0.6 }} />
                  <p style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink2)" }}>I am here, {userName}.</p>
                  <p style={{ color: "var(--ink4)", fontSize: 13, marginTop: 4 }}>Whatever you need to say, I am listening.</p>
                </div>)}
                {chatMessages.map(function(msg, i) { return (<div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, animation: "typeIn 0.3s ease" }}>
                  <div style={{ maxWidth: "82%", padding: "14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "var(--terra)" : "var(--surface)", color: msg.role === "user" ? "#fff" : "var(--ink)", border: msg.role === "user" ? "none" : "1px solid var(--border)", fontSize: 14, lineHeight: 1.65, boxShadow: "var(--shadow)" }}>{msg.content}</div>
                </div>); })}
                {chatLoading && (<div style={{ display: "flex", gap: 6, padding: "14px 18px" }}>{[0,1,2].map(function(i) { return <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terra)", animation: "breathe-expand 1.2s ease " + (i * 0.2) + "s infinite" }} />; })}</div>)}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "12px 16px 28px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea value={chatInput} onChange={function(e) { setChatInput(e.target.value); }} placeholder="Speak your truth..." rows={1} onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} style={{ flex: 1, padding: "14px 18px", borderRadius: 24, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 14, resize: "none", maxHeight: 120, color: "var(--ink)" }} />
                <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ width: 44, height: 44, borderRadius: "50%", background: chatInput.trim() ? "var(--terra)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: chatInput.trim() ? "#fff" : "var(--ink4)", transition: "all 0.3s ease", flexShrink: 0 }}>^</button>
              </div>
            </div>
          )}

          {screen === "breathwork" && (
            <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
              <button onClick={function() { navigate("home"); }} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>Back</button>
              <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--sage)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Breathwork</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>Choose your breath</h2></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BREATHWORK.map(function(ex) { return (<Card key={ex.id} onClick={function() { startBreathing(ex); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: ex.phases[0].color + "18", border: "1.5px solid " + ex.phases[0].color + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: ex.phases[0].color, fontWeight: 600, flexShrink: 0 }}>{ex.phases.map(function(p) { return p.duration; }).join("-")}</div>
                  <div><div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{ex.name}</div><div style={{ fontSize: 12, color: "var(--ink4)" }}>{ex.desc}</div></div>
                </Card>); })}
              </div>
            </div>
          )}

          {screen === "breathe" && breathExercise && (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, animation: "fade 0.5s ease" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink4)", letterSpacing: 3, marginBottom: 48, textTransform: "uppercase" }}>{breathExercise.name}</p>
              <div style={{ position: "relative", width: 200, height: 200, marginBottom: 48 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid " + (breathActive ? breathExercise.phases[breathPhase].color : "var(--border)"), transition: "border-color 0.5s ease", animation: breathActive ? "breathe-expand " + breathExercise.phases[breathPhase].duration + "s ease infinite" : "none" }} />
                <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: breathActive ? breathExercise.phases[breathPhase].color : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.5s ease", opacity: breathActive ? 0.8 : 0.3 }}>
                  <span style={{ fontSize: 28, fontFamily: "var(--serif)", fontWeight: 600, color: breathActive ? "#fff" : "var(--ink3)" }}>{breathActive ? breathTimer : "o"}</span>
                </div>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, marginBottom: 8, color: breathActive ? breathExercise.phases[breathPhase].color : "var(--ink)", transition: "color 0.5s ease" }}>{breathActive ? breathExercise.phases[breathPhase].label : "Ready?"}</h3>
              <p style={{ fontSize: 12, color: "var(--ink4)", marginBottom: 40 }}>{breathActive ? "Cycle " + (breathCycle + 1) + " of " + breathExercise.cycles : breathExercise.cycles + " cycles"}</p>
              <div style={{ display: "flex", gap: 12 }}>
                {breathActive ? (<button onClick={function() { setBreathActive(false); clearInterval(breathIntervalRef.current); }} style={{ padding: "14px 40px", borderRadius: 100, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink2)", fontSize: 14 }}>Stop</button>
                ) : (<>
                  <button onClick={function() { navigate("breathwork"); }} style={{ padding: "14px 30px", borderRadius: 100, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink3)", fontSize: 14 }}>Back</button>
                  <button onClick={function() { setBreathPhase(0); setBreathCycle(0); setBreathTimer(breathExercise.phases[0].duration); setBreathActive(true); }} style={{ padding: "14px 40px", borderRadius: 100, background: breathExercise.phases[0].color, color: "#fff", fontSize: 14, fontWeight: 600 }}>Begin</button>
                </>)}
              </div>
            </div>
          )}

          {screen === "ground-select" && (
            <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
              <button onClick={function() { navigate("home"); }} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>Back</button>
              <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--clay)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Grounding</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400 }}>Come back to earth</h2></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {GROUNDING_EXERCISES.map(function(ex) { return (<Card key={ex.id} onClick={function() { startGrounding(ex); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(184,139,162,0.1)", border: "1.5px solid rgba(184,139,162,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--clay)", fontWeight: 500, flexShrink: 0 }}>{ex.id === "5senses" ? "5" : ex.id === "bodyscan" ? "9" : "5"}</div>
                  <div><div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{ex.name}</div><div style={{ fontSize: 12, color: "var(--ink4)" }}>{ex.desc}</div></div>
                </Card>); })}
              </div>
            </div>
          )}

          {screen === "grounding" && groundingExercise && (
            <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
              <button onClick={function() { navigate("ground-select"); }} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>Back</button>
              {groundingExercise.id === "5senses" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--clay)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Step {groundingStep + 1} of 5</p>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, marginBottom: 28, lineHeight: 1.4 }}>{groundingExercise.steps[groundingStep].prompt}</h3>
                  {Array.from({ length: groundingExercise.steps[groundingStep].count }, function(_, i) { return (<input key={groundingStep + "-" + i} placeholder={(i+1) + "."} value={groundingInputs[i] || ""} onChange={function(e) { var n = groundingInputs.slice(); n[i] = e.target.value; setGroundingInputs(n); }} style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 14, marginBottom: 8, color: "var(--ink)" }} />); })}
                  <button onClick={function() { if (groundingStep < 4) { setGroundingStep(groundingStep + 1); setGroundingInputs([]); } else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, marginTop: 16, background: "var(--clay)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{groundingStep < 4 ? "Next Sense" : "Complete +20 pts"}</button>
                </div>
              )}
              {groundingExercise.id === "bodyscan" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--sage)", letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>Body Scan</p>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, marginBottom: 8 }}>Bring awareness to your</h3>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, color: "var(--sage)", marginBottom: 28 }}>{groundingExercise.regions[bodyScanRegion]}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 }}>{groundingExercise.regions.map(function(r, i) { return <div key={r} style={{ height: 3, borderRadius: 2, background: i <= bodyScanRegion ? "var(--sage)" : "var(--border)", opacity: i <= bodyScanRegion ? 1 : 0.3, transition: "all 0.5s ease" }} />; })}</div>
                  <p style={{ color: "var(--ink2)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, fontFamily: "var(--serif)", fontStyle: "italic" }}>Breathe into this area. Notice any tension. Do not change it, just observe.</p>
                  <button onClick={function() { if (bodyScanRegion < groundingExercise.regions.length - 1) setBodyScanRegion(bodyScanRegion + 1); else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, background: "var(--sage)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{bodyScanRegion < groundingExercise.regions.length - 1 ? "Move Awareness" : "Complete +20 pts"}</button>
                </div>
              )}
              {groundingExercise.id === "affirmation" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--terra)", letterSpacing: 2, marginBottom: 28, textTransform: "uppercase" }}>Mirror Work</p>
                  <Card style={{ padding: "40px 24px", marginBottom: 28, background: "var(--surface2)", border: "1px solid rgba(196,122,90,0.2)" }}>
                    <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400, lineHeight: 1.5, color: "var(--terra)" }}>{groundingExercise.affirmations[affirmationIndex]}</p>
                  </Card>
                  <p style={{ color: "var(--ink4)", fontSize: 13, marginBottom: 28 }}>Say this out loud. Let it sink in.</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>{groundingExercise.affirmations.map(function(_, i) { return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= affirmationIndex ? "var(--terra)" : "var(--border)", transition: "all 0.3s ease" }} />; })}</div>
                  <button onClick={function() { if (affirmationIndex < groundingExercise.affirmations.length - 1) setAffirmationIndex(affirmationIndex + 1); else { earn(20); navigate("home"); } }} style={{ width: "100%", padding: 16, borderRadius: 100, background: "var(--terra)", color: "#fff", fontWeight: 600, fontSize: 14 }}>{affirmationIndex < groundingExercise.affirmations.length - 1 ? "Next Affirmation" : "Complete +20 pts"}</button>
                </div>
              )}
            </div>
          )}

          {screen === "journal" && (
            <div style={{ padding: "24px 20px", minHeight: "100vh", animation: "enter 0.5s ease" }}>
              <button onClick={function() { navigate("home"); }} style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 28 }}>Back</button>
              <div style={{ textAlign: "center", marginBottom: 24 }}><p style={{ fontSize: 12, fontWeight: 500, color: "var(--warm)", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Journal</p><h2 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Pour it out</h2><p style={{ color: "var(--ink4)", fontSize: 13 }}>Unfiltered. Unjudged. Yours.</p></div>
              <Card onClick={newJournalPrompt} style={{ cursor: "pointer", textAlign: "center", marginBottom: 20, padding: "18px 20px" }}>
                {journalPrompt ? (<p style={{ fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic", color: "var(--warm)", lineHeight: 1.5 }}>{journalPrompt}</p>) : (<p style={{ fontSize: 13, color: "var(--ink4)" }}>Tap for a writing prompt</p>)}
              </Card>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {["grateful", "anxious", "hopeful", "sad", "angry", "peaceful", "confused", "inspired"].map(function(tag) { return <Pill key={tag} active={journalTags.includes(tag)} onClick={function() { toggleJournalTag(tag); }} style={{ padding: "6px 14px", fontSize: 12 }}>{tag}</Pill>; })}
              </div>
              <textarea value={journalText} onChange={function(e) { setJournalText(e.target.value); }} placeholder="Start writing..." rows={8} style={{ width: "100%", padding: 20, borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 15, resize: "none", color: "var(--ink)", lineHeight: 1.8, fontFamily: "var(--serif)", boxShadow: "var(--shadow)" }} />
              <button onClick={saveJournal} disabled={!journalText.trim()} style={{ width: "100%", padding: 18, borderRadius: 100, marginTop: 12, background: journalText.trim() ? "var(--warm)" : "var(--bg3)", color: journalText.trim() ? "#fff" : "var(--ink4)", fontWeight: 600, fontSize: 15, transition: "all 0.3s ease" }}>Save Entry +20 pts</button>
              {journalEntries.length > 0 && (<div style={{ marginTop: 32 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink4)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Past Entries</p>
                {journalEntries.slice().reverse().map(function(entry) { return (<Card key={entry.id} style={{ marginBottom: 10, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{entry.tags.map(function(t) { return <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "var(--bg)", color: "var(--ink3)", border: "1px solid var(--border)" }}>{t}</span>; })}</div>
                    <span style={{ fontSize: 10, color: "var(--ink4)" }}>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  {entry.prompt && (<p style={{ fontSize: 12, color: "var(--warm)", fontStyle: "italic", marginBottom: 6, fontFamily: "var(--serif)" }}>{entry.prompt}</p>)}
                  <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>{entry.text.length > 150 ? entry.text.slice(0, 150) + "..." : entry.text}</p>
                </Card>); })}
              </div>)}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
