/* NUT Eti-Osa COOP — Member-only portal shell.
   Activated at /member (redirects to ./index.html?portal=member).
   Hides the admin sign-in entirely and adds a full-page Messages view
   for the signed-in member. All other member features are untouched. */
(function () {
  var params = new URLSearchParams(location.search);
  if (params.get("portal") === "member") sessionStorage.setItem("nut_portal", "member");
  if (sessionStorage.getItem("nut_portal") !== "member") return;

  document.documentElement.setAttribute("data-nut-portal", "member");

  var style = document.createElement("style");
  style.textContent = '[data-nut-portal="member"] .nut-hide{display:none !important}';
  document.head.appendChild(style);

  var TEAL = "#0f766e";

  function loginPills() {
    return Array.prototype.filter.call(document.querySelectorAll("div.inline-flex"), function (d) {
      var b = d.querySelectorAll("button");
      return b.length === 2 && b[0].textContent.trim() === "Member" && b[1].textContent.trim() === "Admin";
    })[0];
  }

  var switched = false;
  function enforceMemberLogin() {
    var pills = loginPills();
    if (!pills) return;
    var btns = pills.querySelectorAll("button");
    btns[1].classList.add("nut-hide");
    if (!switched && btns[0].className.indexOf("bg-[#0f766e]") === -1) {
      switched = true;
      btns[0].click();
    }
  }

  /* ---------- Messages view ---------- */
  function memberNav() {
    return Array.prototype.filter.call(document.querySelectorAll("div.flex.gap-2"), function (d) {
      var b = d.querySelectorAll(":scope > button");
      if (b.length < 4) return false;
      var labels = Array.prototype.map.call(b, function (x) { return x.textContent.trim(); });
      return labels.indexOf("Overview") === 0 && labels.indexOf("Savings History") === 1;
    })[0];
  }

  var overlay = null;
  function closeMessages() { if (overlay) { overlay.remove(); overlay = null; } }

  function openMessages() {
    closeMessages();
    overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:2147482000;background:#f8fafc;overflow:auto;font-family:inherit";
    overlay.innerHTML =
      '<div style="max-width:820px;margin:0 auto;padding:22px 16px 40px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
      '<div><div style="font-size:22px;font-weight:800;color:#0f172a">Messages</div>' +
      '<div style="font-size:12px;color:#64748b;margin-top:2px">Your conversation with the society trustees</div></div>' +
      '<button id="nut-msg-close" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:9px 14px;font-size:13px;font-weight:600;cursor:pointer">Back to portal</button></div>' +
      '<div id="nut-msg-body" style="margin-top:18px;background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:16px;min-height:280px;color:#64748b;font-size:13px">Loading your messages…</div>' +
      '<div style="margin-top:14px;display:flex;gap:10px">' +
      '<textarea id="nut-msg-input" rows="2" placeholder="Write a message to the trustees…" style="flex:1;resize:none;border:1px solid #e5e7eb;border-radius:14px;padding:11px 13px;font-size:14px;font-family:inherit;outline:none"></textarea>' +
      '<button id="nut-msg-send" style="background:' + TEAL + ';color:#fff;border:none;border-radius:14px;padding:0 22px;font-size:14px;font-weight:700;cursor:pointer">Send</button></div>' +
      "</div>";
    document.body.appendChild(overlay);
    overlay.querySelector("#nut-msg-close").onclick = closeMessages;
    overlay.querySelector("#nut-msg-send").onclick = sendMessage;
    overlay.querySelector("#nut-msg-input").onkeydown = function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };
    refreshMessages();
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(t) {
    try { return new Date(t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return ""; }
  }

  async function refreshMessages() {
    if (!overlay || !window.__nutChatMessages) return;
    var body = overlay.querySelector("#nut-msg-body");
    var rows = await window.__nutChatMessages();
    if (!overlay) return;
    if (!rows) { body.textContent = "Sign in to see your messages."; return; }
    if (!rows.length) {
      body.innerHTML = '<div style="text-align:center;padding:40px 10px">No messages yet — send the trustees a note below.</div>';
      return;
    }
    body.innerHTML = rows
      .map(function (m) {
        var mine = m.sender_role === "member";
        return (
          '<div style="display:flex;justify-content:' + (mine ? "flex-end" : "flex-start") + ';margin-bottom:10px">' +
          '<div style="max-width:76%;background:' + (mine ? TEAL : "#f1f5f9") + ";color:" + (mine ? "#fff" : "#0f172a") +
          ';padding:10px 13px;border-radius:16px">' +
          '<div style="font-size:11px;opacity:.8;margin-bottom:2px">' + esc(m.sender_name) + "</div>" +
          '<div style="font-size:14px;white-space:pre-wrap;word-break:break-word">' + esc(m.body) + "</div>" +
          '<div style="font-size:10px;opacity:.7;margin-top:4px;text-align:right">' + fmt(m.created_at) + "</div>" +
          "</div></div>"
        );
      })
      .join("");
    body.scrollTop = body.scrollHeight;
  }

  async function sendMessage() {
    if (!overlay || !window.__nutChatSend) return;
    var input = overlay.querySelector("#nut-msg-input");
    var text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    var res = await window.__nutChatSend(text);
    if (res && res.error) alert("Message not sent: " + res.error);
    refreshMessages();
  }

  window.__nutPortalRefreshMessages = function () { if (overlay) refreshMessages(); };

  function addMessagesTab() {
    var nav = memberNav();
    if (!nav || nav.querySelector("#nut-msg-tab")) return;
    var btn = document.createElement("button");
    btn.id = "nut-msg-tab";
    btn.type = "button";
    btn.textContent = "Messages";
    btn.className = "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border bg-white text-gray-700 border-gray-200";
    btn.onclick = openMessages;
    nav.appendChild(btn);
  }

  function tick() {
    enforceMemberLogin();
    addMessagesTab();
  }

  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(tick, 800);
  tick();
})();
