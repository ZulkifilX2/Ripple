# Google Antigravity prompt — evolve this existing film site

You are working in an EXISTING static HTML/CSS/JavaScript website for a Universiti Malaya UMLEADER film named "The Ripple Effect — Three Choices, One Future". Inspect all files first. Do not replace or rewrite the site from scratch unless there is a clear reason.

GOAL: Improve this existing website into an exceptionally polished, cinematic, accessible, responsive portfolio-grade film premiere microsite, while retaining all functionality and its identity.

DESIGN DIRECTION:
- Editorial film-festival aesthetic: ink black, warm peach/copper, muted lavender, subtle grain, elegant large italic serif + precise monospace labels.
- Dramatic typography, controlled motion, layered ripple artwork, refined cards, beautiful mobile design.
- Make interactions purposeful; no gimmicky heavy parallax or intrusive autoplay.
- Keep performance strong, accessibility excellent, keyboard navigation functional, animations respectful of prefers-reduced-motion.

HARD REQUIREMENTS:
1. Keep `config.js` as the central place to edit the YouTube Unlisted / Google Drive video URL, chapter timestamps, and 10 member names.
2. Preserve provider parsing, privacy-aware YouTube embed, Google Drive preview fallback, and full-screen native player.
3. YouTube chapter buttons must seek to the selected time; Drive chapter UI must explain why direct seek isn't supported.
4. Preserve the separate three act sections: Personal — The Price of Friendship; Academic — The Perfect Data; Societal — Impact or Publicity?
5. Keep BOTH Laureate and Ethical values explicit, tied to the lectures. Laureate: curiosity, critical thinking, creativity, ethics, impact. Ethical: fair, honest, respectful, accountable decision-making.
6. The website is a viewing companion only, not a replacement for the university LMS submission.
7. Don't add hardcoded student names, IDs, photos, logos, university branding assets, or invented awards. Use configured names and assets only if supplied.
8. Avoid fake analytics, fake audience comments, or fake reaction counts.
9. Test on desktop 1440px, mobile 390px, and tablet widths. Check missing-video state, YouTube URL and Google Drive URL parsing, theme toggle, all buttons, accessibility and console errors.
10. Deployable to Vercel static hosting without keys or paid services.

DO FIRST: Audit current structure, then propose and implement small, coherent improvements. Show the working site preview and list what changed.
