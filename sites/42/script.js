const $ = (id) => document.getElementById(id);
const enterBtn = $("enterBtn"), hintBtn = $("hintBtn"), hintText = $("hintText");
const creepyMessage = $("creepyMessage"), messageText = $("messageText");
const secretRoom = $("secretRoom"), closeBtn = $("closeBtn");
const cursorShadow = $("cursorShadow"), visitorName = $("visitorName");
const heart = $("heart"), bpmEl = $("bpm"), moodEl = $("mood"), statusText = $("statusText");
const eyes = $("eyes"), soundBtn = $("soundBtn");
const nameForm = $("nameForm"), nameInput = $("nameInput"), nameNote = $("nameNote");

const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
let userName = store.get("hw_name") || "";
let visits = parseInt(store.get("hw_visits") || "0", 10) + 1;
store.set("hw_visits", visits);

const messages = [
    "I can see you.", "Don't look behind you.", "You're not alone.",
    "Something just moved.", "Why did you come here?", "Leave while you can."
];
const hints = [
    "Some things are easier to find when you type...",
    "Five letters. One word.",
    "You might see it in a haunted house."
];
let messageIndex = 0, hintNumber = 0, secretCode = "";

let fear = 0;
let soundOn = false, audioCtx = null;
let lastActivity = Date.now(), idleStage = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const withName = (t) => (userName ? t.replace("{n}", userName) : t.replace(/,? ?\{n\}/, ""));

let msgToken = 0, hideTimer = null;

async function showMessage(text, hold = 2200) {
    const token = ++msgToken;
    clearTimeout(hideTimer);
    creepyMessage.classList.add("show", "typing");
    messageText.textContent = "";
    speak(text);

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let out = "";
    for (const ch of text) {
        if (token !== msgToken) return;
        if (/[a-z]/i.test(ch) && Math.random() < 0.04 && out.length > 2) {
            messageText.textContent = out + letters[Math.floor(Math.random() * 26)];
            await sleep(rand(220, 380));
            messageText.textContent = out;
            await sleep(rand(120, 260));
        }
        out += ch;
        messageText.textContent = out;
        await sleep(/[.,?!]/.test(ch) ? rand(260, 520) : rand(40, 110));
    }
    if (token !== msgToken) return;
    creepyMessage.classList.remove("typing");
    hideTimer = setTimeout(() => creepyMessage.classList.remove("show"), hold);
}

function thump() {
    if (!soundOn || !audioCtx) return;
    const t = audioCtx.currentTime;
    [0, 0.16].forEach((d, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(i ? 48 : 60, t + d);
        g.gain.setValueAtTime(0.0001, t + d);
        g.gain.exponentialRampToValueAtTime(i ? 0.18 : 0.3, t + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
        o.connect(g).connect(audioCtx.destination);
        o.start(t + d); o.stop(t + d + 0.2);
    });
}

function speak(text) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 0.4; u.rate = 0.7; u.volume = 0.5;
    speechSynthesis.speak(u);
}

soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn && !audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    soundBtn.textContent = "SOUND: " + (soundOn ? "ON" : "OFF");
    soundBtn.setAttribute("aria-pressed", soundOn);
    if (soundOn) showMessage(withName("You can hear me now, {n}."));
    else speechSynthesis && speechSynthesis.cancel();
});

function bump(amount) { fear = Math.min(100, fear + amount); }

function beatLoop() {
    const bpm = Math.round(60 + fear * 2.5);
    bpmEl.textContent = bpm + " BPM";
    heart.classList.remove("beat"); void heart.offsetWidth; heart.classList.add("beat");
    thump();

    moodEl.textContent = fear > 70 ? "TERRIFIED" : fear > 40 ? "ANXIOUS" : fear > 15 ? "UNEASY" : "CALM";
    statusText.textContent = fear > 70 ? "PANICKING" : fear > 40 ? "HUNTING" : "WATCHING";
    setTimeout(beatLoop, 60000 / bpm);
}
beatLoop();
setInterval(() => { fear = Math.max(0, fear - 1.5); }, 700);

const pupils = eyes.querySelectorAll(".pupil");
let mouseX = innerWidth / 2, mouseY = innerHeight / 2;

function lookAtMouse() {
    pupils.forEach((p) => {
        const r = p.parentElement.getBoundingClientRect();
        const a = Math.atan2(mouseY - (r.top + r.height / 2), mouseX - (r.left + r.width / 2));
        p.style.transform = `translate(${Math.cos(a) * 7}px, ${Math.sin(a) * 3}px)`;
    });
}

function openEyes() {
    eyes.style.left = rand(8, 80) + "vw";
    eyes.style.top = rand(12, 70) + "vh";
    eyes.classList.add("show");
    lookAtMouse();
    setTimeout(() => eyes.classList.remove("show"), rand(2500, 5000));
}

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorShadow.style.left = mouseX + "px";
    cursorShadow.style.top = mouseY + "px";
    lookAtMouse();
    noteActivity();
});

function noteActivity() {
    lastActivity = Date.now();
    if (idleStage > 0) {
        if (idleStage >= 2) showMessage(withName("There you are, {n}."));
        idleStage = 0;
    }
}

setInterval(() => {
    const idle = (Date.now() - lastActivity) / 1000;
    if (idle > 10 && idleStage === 0) { idleStage = 1; openEyes(); showMessage(withName("Are you still there, {n}?")); }
    else if (idle > 25 && idleStage === 1) { idleStage = 2; openEyes(); showMessage("Don't go quiet on me."); bump(15); }
    else if (idle > 45 && idleStage === 2) { idleStage = 3; showMessage("I'm not going anywhere."); }
}, 1000);

const realTitle = document.title;
let leftAt = 0;
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        leftAt = Date.now();
        document.title = "Come back...";
    } else {
        document.title = realTitle;
        const secs = Math.round((Date.now() - leftAt) / 1000);
        bump(20);
        showMessage(secs > 5 ? `You were gone ${secs} seconds. I counted.` : "You left. I didn't like that.");
    }
});

function shake(ms = 300) {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), ms);
}

enterBtn.addEventListener("click", () => {
    noteActivity(); shake(); bump(15);
    const pool = userName ? [...messages, withName("Welcome back, {n}."), withName("{n}... that's a nice name.")] : messages;
    showMessage(pool[messageIndex % pool.length]);
    messageIndex++;
    if (fear > 60) openEyes();
    enterBtn.innerText = "TOO LATE";
    setTimeout(() => (enterBtn.innerText = "ENTER AGAIN"), 1800);
});

hintBtn.addEventListener("click", () => {
    noteActivity();
    if (hintNumber < hints.length) hintText.innerText = hints[hintNumber++];
    else hintText.innerText = "You already have enough clues...";
});

document.addEventListener("keydown", (e) => {
    noteActivity();
    if (e.target === nameInput) return;
    secretCode = (secretCode + e.key.toLowerCase()).slice(-5);
    if (secretCode === "ghost") { openSecretRoom(); secretCode = ""; }
});

function openSecretRoom() {
    secretRoom.classList.add("active");
    bump(30); shake(250);
    const rooms = parseInt(store.get("hw_room") || "0", 10) + 1;
    store.set("hw_room", rooms);
    $("visitCount").textContent = rooms;
    const t = new Date(); t.setMinutes(t.getMinutes() - 7);
    $("lastActive").textContent = userName ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "03:17 AM";
    visitorName.textContent = userName ? userName.toUpperCase() : ["UNKNOWN", "YOU", "VISITOR #13"][Math.floor(Math.random() * 3)];
    updateFinal();
    nameNote.textContent = userName ? "I remembered you." : "";
}

function updateFinal() {
    $("finalText").innerHTML = userName
        ? `Whatever you do, ${userName.replace(/[<>&]/g, "")}...<br>don't look behind you.`
        : "Whatever you do...<br>don't look behind you.";
}

nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = nameInput.value.trim().slice(0, 20);
    if (!n) { nameNote.textContent = "Even ghosts have names. What's yours?"; return; }
    userName = n; store.set("hw_name", n);
    visitorName.textContent = n.toUpperCase();
    nameNote.textContent = `Signed. Nice to meet you, ${n}. I won't forget.`;
    nameInput.value = ""; updateFinal(); bump(25);
    speak(`Hello, ${n}`);
});

closeBtn.addEventListener("click", () => {
    secretRoom.classList.remove("active");
    setTimeout(() => showMessage(withName("You can't leave that easily, {n}.")), 700);
});

setInterval(() => {
    if (Math.random() < 0.25) showMessage(messages[Math.floor(Math.random() * messages.length)]);
}, 8000);
setInterval(() => { if (Math.random() < 0.25) shake(250); }, 10000);
setInterval(() => { if (fear > 35 && Math.random() < 0.5) openEyes(); }, 9000);

setTimeout(() => {
    const h = new Date().getHours();
    let line;
    if (visits > 1 && userName) line = `You came back, ${userName}. Visit number ${visits}.`;
    else if (visits > 1) line = `You came back. That's visit number ${visits}.`;
    else if (h < 5) line = "It's the middle of the night. Why are you awake?";
    else if (h < 12) line = "Morning? Nothing good lives here at this hour.";
    else if (h < 18) line = "Daylight doesn't reach this far in.";
    else line = "It's getting dark. Good. I like it dark.";
    showMessage(line, 3200);
}, 1800);
