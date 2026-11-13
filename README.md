# THE RIPPLE EFFECT — UMLEADER Film Website

A cinematic, mobile-friendly, **static website** for your Universiti Malaya GUL1001 UMLEADER role-play film. No paid plan, server, database, Node.js installation, or API key needed.

## Quick setup (5 edits)

1. Upload your final MP4 to **YouTube Studio**, set **Visibility → Unlisted**, and copy the video URL. Or upload it to Google Drive and set **General access → Anyone with the link → Viewer**.
2. Open `config.js` in Notepad or VS Code. Set `videoUrl` to your full YouTube or Google Drive link. **Save**.
3. In `config.js`, change the four `chapters[].time` values to your **actual final video timestamps in seconds** (0:15 → 15; 3:10 → 190; 6:05 → 365). The defaults are storyboard estimates, not measured timings.
4. Change all ten `team[].name` values to real names, and update `role` / `act` if casting changed. Avoid publishing students' IDs or other personal details.
5. Deploy your folder or ZIP to Vercel. Test on your phone and in an incognito browser window.

**IMPORTANT:** Visitors can stream the video only after `videoUrl` is saved in the deployed `config.js`. The optional on-page URL box is a *temporary browser preview*, not a saved configuration.

## Host it on Vercel for free

### Option A — Fastest: Vercel Drop

Visit https://vercel.com/drop, log in, and drop the **project folder** or **ZIP file**. Name the project (e.g., `the-ripple-effect-umleader`) and deploy. Vercel provides a `*.vercel.app` link. No framework/build command needed.

### Option B — GitHub + Vercel (best for editing in Google Antigravity)

1. Create a GitHub repository, e.g., `the-ripple-effect`.
2. Add all the project files at the repository root (`index.html`, `styles.css`, `script.js`, `config.js`, `favicon.svg`, `vercel.json`).
3. Import the repository at https://vercel.com/new.
4. Select **Framework Preset: Other**; there is no build command or output folder to specify (the root is the website).
5. Deploy. After editing and pushing to GitHub, Vercel automatically redeploys.

## Using Google Antigravity

Open the project folder in Antigravity and use `ANTIGRAVITY_PROMPT.md` as your starting instruction. Insist that any modifications preserve the working YouTube/Drive link configuration and chapter buttons.

## Supported video URLs

- YouTube normal: `https://www.youtube.com/watch?v=VIDEO_ID`
- YouTube short: `https://youtu.be/VIDEO_ID`
- YouTube Shorts or Live links also work
- Google Drive: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

YouTube chapter buttons navigate via `start=` parameters. **Google Drive preview doesn't offer reliable external timestamp controls**; the site asks the user to seek to the time using Drive's built-in timeline.

## Website features

- Cinematic editorial landing design, animated ripple artwork, responsive mobile layout
- Embedded YouTube or Drive video, fullscreen support (as provided by player)
- Film chapter shortcuts (YouTube) with editable timecodes
- Three-act storytelling cards
- Interactive Laureate / Ethical value explorer
- Ten cast credits configured in one file
- Dark/light mode, copy/share page, keyboard-accessible controls, reduced-motion support
- `noindex,nofollow` meta tag to reduce accidental search indexing (not access control)

## Important privacy and submission notes

- YouTube **Unlisted** means anyone with the link can watch and reshare. A public Vercel page containing the embed effectively exposes the video link to its visitors. **It is not password protected.**
- A Google Drive video must be shared with the intended viewers to work. School-managed accounts may restrict external sharing.
- Keep the original MP4. Follow your lecturer's actual submission requirements and submit the MP4 or accepted video link through the **LMS**. The custom website is a polished supplementary viewing experience.
- YouTube and Drive handle streaming. The video is **not stored in this repository** and is not uploaded to Vercel.
- Font files are loaded from Google Fonts; system fallbacks are provided.

## Local preview

Double-click `index.html` to preview the static website. If your browser blocks some features locally, run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.
