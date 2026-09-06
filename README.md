# RCAF Daily — 5BX & XBX Tracker

An installable, offline-ready exercise timer and progress tracker based on the Royal Canadian Air Force 5BX and XBX exercise plans.

- **Live app:** https://jaa2261.github.io/rcaf-daily/
- **Repository:** https://github.com/jaa2261/rcaf-daily

## What the app includes

- Both RCAF programs: six 5BX charts and four XBX charts.
- Chart and level targets, exercise descriptions, and pamphlet-based illustrations.
- Individual exercise timers with audible countdowns during the final ten seconds.
- A pause after each timer so the repetitions achieved can be entered before continuing.
- Immediate saving after each exercise.
- Walk and run timing as an alternative to 5BX Exercise 5, including total mileage, total elapsed time, and calculated average time per mile; saving either marks Exercise 5 complete.
- Workout, repetition, walk, and run history by chart and level.
- Progress graphs and the number of days spent at each level.
- Age-based goals and minimum progression periods from the pamphlets.
- Installation as a Progressive Web App (PWA) on Android and offline operation after the files have been cached.

## Install on Android

1. Open https://jaa2261.github.io/rcaf-daily/ in Chrome.
2. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
3. Launch **RCAF Daily** from the home screen.
4. Use the **Program** selector at the top to choose **5BX** or **XBX**.

Each phone has separate progress data.

## Continue development on another Windows PC

Install [Git](https://git-scm.com/download/win), then open PowerShell and run:

```powershell
git clone https://github.com/jaa2261/rcaf-daily.git
Set-Location rcaf-daily
```

The app has no package manager, framework, build server, or third-party runtime dependency. To test it locally, serve the `build` directory over HTTP. If Python is installed:

```powershell
py -m http.server 8000 --directory build
```

Then open http://localhost:8000. Serving over HTTP is required to test the service worker; opening `index.html` directly does not provide full PWA behaviour.

To make a change:

1. Edit `index.html`, `manifest.webmanifest`, `sw.js`, or files under `assets`.
2. Change `CACHE_NAME` near the top of `sw.js` when changing app files, so installed copies replace the old offline cache.
3. Rebuild the deployable copy:

   ```powershell
   .\scripts\build.ps1
   ```

4. Test the `build` directory locally.
5. Commit and push:

   ```powershell
   git add .
   git commit -m "Describe the change"
   git push origin main
   ```

A push to `main` starts the **Publish RCAF Daily** GitHub Actions workflow. It publishes the contents of `build` to GitHub Pages. The result can be checked under the repository's **Actions** tab.

You will need to authenticate as `jaa2261` before pushing. GitHub CLI users can run `gh auth login`.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Complete application interface, official plan data, timers, saving, and graphs |
| `manifest.webmanifest` | Android/PWA name, icon, colours, start URL, and display mode |
| `sw.js` | Offline cache and update behaviour |
| `assets/exercises` | 30 illustrations for the six 5BX charts |
| `assets/xbx` | 40 illustrations for the four XBX charts |
| `assets/app-icon.svg` | Installed app icon |
| `build` | Static files actually published by GitHub Pages |
| `scripts/build.ps1` | Copies the editable app files into `build` |
| `.github/workflows/pages.yml` | Automatic GitHub Pages deployment |
| `.openai/hosting.json` | Metadata from the original private Sites deployment; not used by GitHub Pages |

## Data and backups

Workout information is stored in the browser's `localStorage`. The main keys are:

- `five-daily-plan`
- `five-daily-active-workout`
- `five-daily-history`
- `five-daily-exercise-history`
- `five-daily-cardio-history`
- `five-daily-age`

No account, server database, or cloud synchronisation is used. Exercise history is therefore **not stored in GitHub**, does not move automatically between phones, and may be lost if the app/browser storage is cleared. The source code in GitHub can always be restored by cloning the repository.

## Historical sources

- [5BX Plan for Physical Fitness pamphlet](https://csclub.uwaterloo.ca/~rfburger/5bx-plan.pdf)
- [XBX Plan for Physical Fitness — Government of Canada catalogue](https://publications.gc.ca/site/eng/9.956606/publication.html)

The exercise illustrations and plan data were prepared from these historical pamphlets. This project is an unofficial tracker and is not affiliated with or endorsed by the Royal Canadian Air Force or the Government of Canada. The historical routines are not current medical guidance; users should exercise within their abilities and seek appropriate medical advice where necessary.
