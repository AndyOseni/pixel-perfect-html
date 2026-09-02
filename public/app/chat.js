/* NUT Eti-Osa COOP — Live Chat widget
   Members chat with the society; any of the three trustees (or the admin console)
   can respond in real time. Backed by Lovable Cloud (chat_messages table). */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const CHAT_URL = "https://urvgfaparanfrzwbaerl.supabase.co";
const CHAT_KEY = "sb_publishable_SMw8GXgXF2eyWQgI9SHNuw_IA-khkBz";
const db = createClient(CHAT_URL, CHAT_KEY, { auth: { persistSession: false } });

const TEAL = "#0f766e";
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (t) => {
  try {
    return new Date(t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};
const readLS = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch { return f; } };

/* ---------- session bridge (set from the app on login/logout) ---------- */
let session = null; // {role:'member'|'admin', id, name, employerNumber}
window.__nutSetSession = (s) => { session = s; render(); };
window.__nutClearSession = () => { session = null; render(); };

function trusteeIds() {
  const t = readLS("nut_trustees", {}) || {};
  return [t.president, t.treasurer, t.secretary].filter(Boolean);
}
function trusteeRoleFor(memberId) {
  const t = readLS("nut_trustees", {}) || {};
  if (t.president === memberId) return "President";
  if (t.treasurer === memberId) return "Treasurer";
  if (t.secretary === memberId) return "Secretary";
  return null;
}
function members() { return readLS("nut_etiosa_members", null) || readLS("nut_members", []) || []; }

/* Who am I in the chat? */
function identity() {
  if (!session) return null;
  if (session.role === "admin") return { kind: "trustee", label: "Admin (Secretariat)" };
  const role = trusteeRoleFor(session.id);
  if (role) return { kind: "trustee", label: `${session.name} (${role})` };
  return {
    kind: "member",
    label: session.name || "Member",
    conversation: "member:" + (session.employerNumber || session.id),
    memberNumber: session.employerNumber || "",
    memberName: session.name || "",
  };
}

/* ---------- DOM ---------- */
let root, launcher, panel, badge, open = false, msgs = [], activeConv = null, channel = null, unread = 0;

function mount() {
  root = document.createElement("div");
  root.id = "nut-chat-root";
  root.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:inherit";
  root.innerHTML = `
    <div id="nc-panel" style="display:none;width:min(94vw,380px);height:min(72vh,540px);background:#fff;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 18px 45px rgba(0,0,0,.22);overflow:hidden;flex-direction:column"></div>
    <button id="nc-launcher" aria-label="Open live chat" style="margin-top:10px;margin-left:auto;display:flex;align-items:center;gap:8px;background:${TEAL};color:#fff;border:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:600;box-shadow:0 10px 25px rgba(15,118,110,.35);cursor:pointer;position:relative">
      💬 Live Chat
      <span id="nc-badge" style="display:none;position:absolute;top:-4px;right:-4px;background:#dc2626;color:#fff;border-radius:999px;min-width:20px;height:20px;font-size:11px;line-height:20px;text-align:center;padding:0 5px"></span>
    </button>`;
  document.body.appendChild(root);
  panel = root.querySelector("#nc-panel");
  launcher = root.querySelector("#nc-launcher");
  badge = root.querySelector("#nc-badge");
  launcher.addEventListener("click", () => { open = !open; if (open) { unread = 0; stopFlash(); } render(); });
}

function render() {
  if (!root) return;
  const me = identity();
  if (!me) { root.style.display = "none"; open = false; teardown(); return; }
  root.style.display = "block";
  badge.style.display = unread > 0 && !open ? "block" : "none";
  badge.textContent = String(unread);
  panel.style.display = open ? "flex" : "none";
  if (!open) return;
  const prevInput = panel.querySelector("#nc-input");
  const draft = prevInput ? prevInput.value : "";
  const wasFocused = prevInput && document.activeElement === prevInput;

  if (me.kind === "member") {
    activeConv = me.conversation;
    panel.innerHTML = shell("Chat with Trustees", "Your messages go to the three trustees") + list(me) + composer();
  } else {
    panel.innerHTML = shell("Member Live Chat", me.label) + (activeConv ? list(me) + composer() : inbox());
  }
  wire(me, draft, wasFocused);
}

function shell(title, sub) {
  return `<div style="background:${TEAL};color:#fff;padding:12px 14px;display:flex;align-items:center;gap:8px">
    <div style="flex:1"><div style="font-weight:700;font-size:15px">${esc(title)}</div>
    <div style="font-size:11px;opacity:.85">${esc(sub)}</div></div>
    <button id="nc-back" style="display:none;background:rgba(255,255,255,.18);border:none;color:#fff;border-radius:8px;padding:4px 8px;font-size:12px;cursor:pointer">Inbox</button>
    <button id="nc-close" style="background:rgba(255,255,255,.18);border:none;color:#fff;border-radius:8px;width:26px;height:26px;font-size:14px;cursor:pointer">×</button></div>`;
}

function conversations() {
  const map = new Map();
  msgs.forEach((m) => {
    const c = map.get(m.conversation_id) || { id: m.conversation_id, name: m.member_name, number: m.member_number, last: m, unread: 0 };
    if (new Date(m.created_at) >= new Date(c.last.created_at)) c.last = m;
    if (m.sender_role === "member" && !m.read_by_trustee) c.unread++;
    if (m.member_name) c.name = m.member_name;
    if (m.member_number) c.number = m.member_number;
    map.set(m.conversation_id, c);
  });
  return [...map.values()].sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at));
}

function inbox() {
  const rows = conversations();
  const body = rows.length
    ? rows.map((c) => `<button class="nc-conv" data-id="${esc(c.id)}" style="width:100%;text-align:left;background:#fff;border:none;border-bottom:1px solid #f1f5f9;padding:12px 14px;cursor:pointer">
        <div style="display:flex;justify-content:space-between;gap:8px">
          <span style="font-weight:600;font-size:13px;color:#0f172a">${esc(c.name || "Member")} ${c.number ? `<span style="color:#64748b;font-weight:400">(${esc(c.number)})</span>` : ""}</span>
          ${c.unread ? `<span style="background:#dc2626;color:#fff;border-radius:999px;font-size:10px;padding:1px 7px">${c.unread}</span>` : ""}
        </div>
        <div style="font-size:12px;color:#64748b;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.last.sender_name)}: ${esc(c.last.body)}</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:2px">${fmt(c.last.created_at)}</div></button>`).join("")
    : `<div style="padding:24px;text-align:center;color:#64748b;font-size:13px">No member chats yet.</div>`;
  return `<div style="flex:1;overflow:auto;background:#fff">${body}</div>`;
}

function list(me) {
  const items = msgs.filter((m) => m.conversation_id === activeConv);
  const body = items.length
    ? items.map((m) => {
        const mine = me.kind === "member" ? m.sender_role === "member" : m.sender_role === "trustee";
        return `<div style="display:flex;justify-content:${mine ? "flex-end" : "flex-start"};margin-bottom:8px">
          <div style="max-width:78%;background:${mine ? TEAL : "#f1f5f9"};color:${mine ? "#fff" : "#0f172a"};padding:8px 11px;border-radius:14px">
            <div style="font-size:10px;opacity:.8;margin-bottom:2px">${esc(m.sender_name)}</div>
            <div style="font-size:13px;white-space:pre-wrap;word-break:break-word">${esc(m.body)}</div>
            <div style="font-size:9px;opacity:.7;margin-top:3px;text-align:right">${fmt(m.created_at)}</div>
          </div></div>`;
      }).join("")
    : `<div style="padding:22px;text-align:center;color:#64748b;font-size:13px">${me.kind === "member" ? "Send a message — a trustee will reply here." : "No messages in this conversation."}</div>`;
  return `<div id="nc-list" style="flex:1;overflow:auto;padding:12px;background:#f8fafc">${body}</div>`;
}

function composer() {
  return `<div style="border-top:1px solid #e5e7eb;padding:8px;display:flex;gap:8px;background:#fff">
    <textarea id="nc-input" rows="1" placeholder="Type a message…" style="flex:1;resize:none;border:1px solid #e5e7eb;border-radius:12px;padding:9px 11px;font-size:13px;outline:none;font-family:inherit;max-height:90px"></textarea>
    <button id="nc-send" style="background:${TEAL};color:#fff;border:none;border-radius:12px;width:40px;height:40px;font-size:15px;cursor:pointer;flex:none">➤</button></div>`;
}

function wire(me, draft, wasFocused) {
  const q = (s) => panel.querySelector(s);
  q("#nc-close").onclick = () => { open = false; render(); };
  const back = q("#nc-back");
  if (me.kind === "trustee" && activeConv) { back.style.display = "block"; back.onclick = () => { activeConv = null; render(); }; }
  panel.querySelectorAll(".nc-conv").forEach((b) => {
    b.onclick = () => { activeConv = b.dataset.id; markRead(activeConv); render(); };
  });
  const input = q("#nc-input");
  if (input) {
    input.value = draft || "";
    if (wasFocused) input.focus();
    input.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(me); } };
    q("#nc-send").onclick = () => send(me);
  }
  const l = q("#nc-list");
  if (l) l.scrollTop = l.scrollHeight;
  if (me.kind === "trustee" && activeConv) markRead(activeConv);
}

async function send(me) {
  const input = panel.querySelector("#nc-input");
  const text = (input.value || "").trim();
  if (!text) return;
  input.value = "";
  let row;
  if (me.kind === "member") {
    row = { conversation_id: me.conversation, member_number: me.memberNumber, member_name: me.memberName, sender_role: "member", sender_name: me.label, body: text };
  } else {
    const conv = conversations().find((c) => c.id === activeConv);
    row = { conversation_id: activeConv, member_number: conv?.number || null, member_name: conv?.name || null, sender_role: "trustee", sender_name: me.label, body: text, read_by_trustee: true };
  }
  const { data, error } = await db.from("chat_messages").insert(row).select().single();
  if (error) { alert("Message not sent: " + error.message); return; }
  upsert(data);
  render();
}

async function markRead(conv) {
  const pending = msgs.filter((m) => m.conversation_id === conv && m.sender_role === "member" && !m.read_by_trustee);
  if (!pending.length) return;
  pending.forEach((m) => { m.read_by_trustee = true; });
  await db.from("chat_messages").update({ read_by_trustee: true }).in("id", pending.map((m) => m.id));
}

function upsert(row) {
  if (!row) return;
  const i = msgs.findIndex((m) => m.id === row.id);
  if (i >= 0) msgs[i] = row; else msgs.push(row);
  msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

/* ---------- in-app notifications ---------- */
let seen = new Set(), toastWrap = null, baseTitle = document.title, titleTimer = null;

function toastHost() {
  if (toastWrap) return toastWrap;
  toastWrap = document.createElement("div");
  toastWrap.style.cssText =
    "position:fixed;right:16px;bottom:86px;z-index:2147483001;display:flex;flex-direction:column;gap:8px;align-items:flex-end;font-family:inherit;pointer-events:none";
  document.body.appendChild(toastWrap);
  return toastWrap;
}

function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.36);
    setTimeout(() => ctx.close(), 600);
  } catch {}
}

function flashTitle() {
  if (titleTimer) return;
  let on = true;
  titleTimer = setInterval(() => {
    document.title = on ? "💬 New message — " + baseTitle : baseTitle;
    on = !on;
  }, 1200);
}
function stopFlash() {
  if (titleTimer) { clearInterval(titleTimer); titleTimer = null; }
  document.title = baseTitle;
}

function toast(row, me) {
  const host = toastHost();
  const who = me.kind === "trustee" ? `${row.member_name || "Member"}${row.member_number ? ` (${row.member_number})` : ""}` : row.sender_name;
  const el = document.createElement("div");
  el.style.cssText =
    "pointer-events:auto;max-width:300px;background:#fff;border:1px solid #e5e7eb;border-left:4px solid " +
    TEAL +
    ";border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.18);padding:10px 12px;cursor:pointer;opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s";
  el.innerHTML = `<div style="font-size:11px;color:${TEAL};font-weight:700;margin-bottom:2px">New chat message</div>
    <div style="font-size:12px;font-weight:600;color:#0f172a">${esc(who)}</div>
    <div style="font-size:12px;color:#475569;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(row.body)}</div>`;
  el.onclick = () => {
    open = true;
    unread = 0;
    if (me.kind === "trustee") activeConv = row.conversation_id;
    stopFlash();
    el.remove();
    render();
  };
  host.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "none"; });
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  }, 7000);
}

/* Returns true if the row should notify the current identity */
function isForMe(row, me) {
  return me.kind === "member"
    ? row.conversation_id === me.conversation && row.sender_role === "trustee"
    : row.sender_role === "member";
}

function notifyNew(rows) {
  const me = identity();
  if (!me) return;
  const fresh = rows.filter((r) => r && !seen.has(r.id));
  rows.forEach((r) => r && seen.add(r.id));
  const relevant = fresh.filter((r) => isForMe(r, me));
  if (!relevant.length) return;
  const hidden = !open || (me.kind === "trustee" && relevant.every((r) => r.conversation_id !== activeConv));
  if (!hidden) return;
  unread += relevant.length;
  toast(relevant[relevant.length - 1], me);
  chime();
  flashTitle();
}

/* ---------- data + realtime ---------- */
async function load(notify = true) {
  const { data } = await db.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(1000);
  msgs = data || [];
  if (notify) notifyNew(msgs); else msgs.forEach((m) => seen.add(m.id));
}

function teardown() { if (channel) { db.removeChannel(channel); channel = null; } }

function subscribe() {
  if (channel) return;
  channel = db
    .channel("nut-chat")
    .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, (p) => {
      const row = p.new;
      upsert(row);
      if (p.eventType === "INSERT") notifyNew([row]);
      else if (row) seen.add(row.id);
      render();
    })
    .subscribe();
}

mount();
await load(false);
subscribe();
render();
setInterval(async () => { if (identity()) { await load(); render(); } }, 30000);

