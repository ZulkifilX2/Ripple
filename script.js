(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const chapters = Array.isArray(config.chapters) ? config.chapters : [];
  const team = Array.isArray(config.team) ? config.team : [];
  let video = null;
  let previewOnly = false;
  let toastTimer = null;

  function parseVideo(input) {
    if (typeof input !== "string" || !input.trim()) return null;
    const raw = input.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return { provider: "youtube", id: raw };
    let url;
    try { url = new URL(raw); } catch { return null; }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.split("/").filter(Boolean);
    if (host === "youtu.be" || host === "www.youtu.be") {
      const id = path[0];
      return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? { provider: "youtube", id } : null;
    }
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
      let id = url.searchParams.get("v");
      if (!id && ["embed", "shorts", "live", "v"].includes(path[0])) id = path[1];
      return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? { provider: "youtube", id } : null;
    }
    if (host === "drive.google.com" || host === "www.drive.google.com") {
      let id = null;
      if (path[0] === "file" && path[1] === "d") id = path[2];
      if (!id) id = url.searchParams.get("id");
      return /^[A-Za-z0-9_-]{20,}$/.test(id || "") ? { provider: "drive", id } : null;
    }
    return null;
  }

  function videoUrlAt(seconds = 0, autoplay = false) {
    if (!video) return "";
    if (video.provider === "youtube") {
      const params = new URLSearchParams({ playsinline: "1", rel: "0", start: String(Math.max(0, Math.floor(seconds))), autoplay: autoplay ? "1" : "0" });
      return `https://www.youtube-nocookie.com/embed/${video.id}?${params.toString()}`;
    }
    return `https://drive.google.com/file/d/${video.id}/preview`;
  }

  function externalVideoUrl() {
    if (!video) return "";
    return video.provider === "youtube" ? `https://www.youtube.com/watch?v=${video.id}` : `https://drive.google.com/file/d/${video.id}/view`;
  }

  function flash(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
  }

  function initializeVideo(parsed, isPreview = false) {
    video = parsed;
    previewOnly = isPreview;
    $("#videoState").textContent = parsed ? (parsed.provider === "youtube" ? "YOUTUBE • EMBED READY" : "GOOGLE DRIVE • EMBED READY") : "AWAITING FILM LINK";
    const link = $("#externalVideoLink");
    if (parsed) { link.href = externalVideoUrl(); link.hidden = false; }
    else { link.hidden = true; }
    $("#setupBox").hidden = !!parsed && !isPreview;
    $("#chapterHint").textContent = parsed?.provider === "drive" ? "Drive: use the video timeline to find a scene." : "Chapter seeking uses the YouTube player.";
  }

  function startPlayer(startSeconds = 0, autoplay = true) {
    if (!video) {
      flash("Add your video URL first. Paste it into the preview field under the player.");
      $("#setupBox").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#previewInput").focus({ preventScroll: true });
      return;
    }
    const wrap = $("#playerWrap");
    const frame = document.createElement("iframe");
    frame.setAttribute("title", "The Ripple Effect film player");
    frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.src = videoUrlAt(startSeconds, autoplay);
    wrap.replaceChildren(frame);
    $("#playerPoster").hidden = true;
    wrap.hidden = false;
    $("#videoState").textContent = `NOW PLAYING • ${video.provider === "youtube" ? "YOUTUBE" : "GOOGLE DRIVE"}`;
  }

  function secondsToTime(seconds) {
    const n = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
  }

  function jumpToChapter(id) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) return;
    $("#film").scrollIntoView({ behavior: "smooth" });
    if (!video) {
      flash("Connect your unlisted video to enable chapter playback.");
      $("#setupBox").hidden = false;
      return;
    }
    if (video.provider === "drive") {
      if ($("#playerWrap").hidden) startPlayer(0, false);
      flash(`Open the player timeline and seek to ${secondsToTime(chapter.time)} for ${chapter.title}.`);
      return;
    }
    startPlayer(chapter.time, true);
    flash(`Now playing: ${chapter.title} (${secondsToTime(chapter.time)})`);
  }

  function makeChapterTrack() {
    const track = $("#chapterTrack");
    const label = document.createElement("span");
    label.className = "chapter-track-label";
    label.textContent = "QUICK JUMP";
    track.append(label);
    chapters.forEach((chapter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chapter-pill";
      const timestamp = document.createElement("strong");
      timestamp.textContent = secondsToTime(chapter.time);
      button.append(timestamp, document.createTextNode(chapter.title));
      button.addEventListener("click", () => jumpToChapter(chapter.id));
      track.append(button);
    });
    $$(".chapter-button").forEach(button => {
      button.addEventListener("click", () => jumpToChapter(button.dataset.chapter));
    });
  }

  function makeCredits() {
    const grid = $("#creditsGrid");
    const members = team.length ? team : Array.from({length: 10}, (_, i) => ({name: `Member ${i + 1}`, role: "Cast", act: "Student film"}));
    members.forEach((person, index) => {
      const card = document.createElement("article");
      card.className = "credit-card";
      const top = document.createElement("div");
      top.className = "credit-top";
      const number = document.createElement("span");
      number.className = "credit-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const initials = document.createElement("span");
      initials.className = "credit-initials";
      initials.textContent = String(person.name || "M").split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join("") || "M";
      initials.setAttribute("aria-hidden", "true");
      top.append(number, initials);
      const bottom = document.createElement("div");
      const name = document.createElement("div");
      name.className = "credit-name";
      name.textContent = person.name || `Member ${index + 1}`;
      name.title = name.textContent;
      const role = document.createElement("div");
      role.className = "credit-role";
      role.textContent = `${person.role || "Cast"} · ${person.act || "Film"}`;
      bottom.append(name, role);
      card.append(top, bottom);
      grid.append(card);
    });
  }

  const valueData = {
    laureate: {tag: "THE MINDSET", heading: ["Think beyond", "the award."], description: "A Laureate mindset is measured not only by achievement, but by curiosity, critical thinking, creativity, ethics and real-world impact.", steps: ["CURIOSITY", "THINKING", "CREATIVITY", "ETHICS", "IMPACT"], symbol: "✳"},
    ethical: {tag: "THE COMPASS", heading: ["Do right, even", "when it's hard."], description: "Ethical leadership means protecting honesty, fairness, trust, dignity and accountability—especially when pressure makes the shortcut tempting.", steps: ["IDENTIFY", "CONSIDER", "EVALUATE", "ACT", "REFLECT"], symbol: "◇"}
  };

  function updateLens(lens) {
    const item = valueData[lens];
    if (!item) return;
    const panel = $("#valuePanel");
    panel.dataset.mode = lens;
    $("#valueTag").textContent = item.tag;
    $("#valueHeading").replaceChildren(document.createTextNode(item.heading[0]), document.createElement("br"));
    const em = document.createElement("em");
    em.textContent = item.heading[1];
    $("#valueHeading").append(em);
    $("#valueDescription").textContent = item.description;
    $("#valueSymbol").textContent = item.symbol;
    const steps = $("#valueSteps");
    steps.replaceChildren();
    item.steps.forEach((step, index) => {
      if (index > 0) { const arrow = document.createElement("i"); arrow.textContent = "→"; steps.append(arrow); }
      const span = document.createElement("span"); span.textContent = step; steps.append(span);
    });
    $$(".value-tab").forEach(button => {
      const active = button.dataset.lens === lens;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  async function sharePage() {
    const url = location.href.split("#")[0];
    if (navigator.share) {
      try { await navigator.share({ title: "The Ripple Effect", text: "Three choices. One future.", url }); return; }
      catch (err) { if (err && err.name === "AbortError") return; }
    }
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(url); flash("Website link copied!"); return; } catch { /* fallback below */ }
    }
    flash(`Copy this page URL from your address bar: ${url}`);
  }

  function setTheme(light) {
    document.body.classList.toggle("light-theme", light);
    $("#themeToggle").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    try { localStorage.setItem("ripple-theme", light ? "light" : "dark"); } catch { /* no storage */ }
  }

  function init() {
    try { setTheme(localStorage.getItem("ripple-theme") === "light"); } catch { setTheme(false); }
    $("#themeToggle").addEventListener("click", () => setTheme(!document.body.classList.contains("light-theme")));
    $("#playButton").addEventListener("click", () => startPlayer(0, true));
    $("#copyLink").addEventListener("click", sharePage);
    $("#shareBottom").addEventListener("click", sharePage);
    $("#runtimeLabel").textContent = String(config.durationLabel || "Approximately 9 minutes").toUpperCase();
    initializeVideo(parseVideo(config.videoUrl));
    $("#previewForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const url = $("#previewInput").value.trim();
      const parsed = parseVideo(url);
      if (!parsed) { $("#previewError").hidden = false; $("#previewError").textContent = "Please enter a valid YouTube or Google Drive video URL."; return; }
      $("#previewError").hidden = true;
      initializeVideo(parsed, true);
      startPlayer(0, false);
      flash("Preview ready! Edit config.js to make this video link permanent for all viewers.");
      $("#film").scrollIntoView({ behavior: "smooth" });
    });
    makeChapterTrack();
    makeCredits();
    $$(".value-tab").forEach(button => button.addEventListener("click", () => updateLens(button.dataset.lens)));
    updateLens("laureate");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
