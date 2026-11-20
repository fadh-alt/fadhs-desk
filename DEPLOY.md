# Fadh's Desk – installable app (PWA)

This folder is a stand-alone copy of the dashboard that can be installed as an app.
The claude.ai dashboard stays as it is; this is a second copy.

## What's different from the claude.ai version

| | claude.ai version | This app |
|---|---|---|
| Where data is saved | claude.ai, synced on all devices | On each device only |
| Works offline | No | Yes, after the first visit |
| PDF summaries, logbook reading, timetable from image | Yes | No (use the claude.ai version, then export) |
| Uploading PDFs with covers | Yes | Yes (PDF kept on the device) |

## 1. Put it online (free, once)

The files need a web address that starts with https. GitHub Pages is free:

1. Sign in at github.com and create a new **public** repository, for example `fadhs-desk`.
2. Click **Add file → Upload files** and drag in everything in this folder:
   `index.html`, `manifest.webmanifest`, `sw.js`, and the `icons` folder.
3. Click **Commit changes**.
4. Go to **Settings → Pages**. Under *Branch*, pick `main` and `/ (root)`, then **Save**.
5. After a minute the page shows your address, like `https://yourname.github.io/fadhs-desk/`.

The site contains no personal data. Your tasks and files only live on your own devices.

## 2. Install it

- **iPhone:** open the address in **Safari** → Share → **Add to Home Screen**.
- **Android:** open it in **Chrome** → menu → **Install app**.
- **Laptop:** open it in **Chrome or Edge** → click the install icon in the address bar.

## 3. Move your data in

1. Open the claude.ai dashboard → sidebar → **Backup → Export data**. Save the file.
2. Open the installed app → sidebar → **Backup → Import data** → pick that file → **Replace my data**.

Do this again whenever you want to copy fresh data across, for example after
uploading your logbook or new PDFs on claude.ai. Importing replaces what is on that device.
PDF files themselves are not in the backup: re-upload a PDF in the app if you want to open it there.

## Updating the app later

After a dashboard change, run `node build-pwa.js` and upload the new files to the same repository.
The app picks up the new version the next time it opens online.
