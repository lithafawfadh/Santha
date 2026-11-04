# Santha Mobile App (Android APK) — Admin & Member Guide

This guide explains how your Santha Android app is built, how to download the APK, how to distribute it to members, and how to trigger updates.

---

## 1. How the App Works

* **Exact UI Parity:** The app uses Capacitor to package your exact React + Tailwind UI, glassmorphism cards, and Framer Motion animations into a native Android app shell.
* **Offline-First Viewing:**
  - Members only need internet the very first time they log in.
  - After logging in, the app automatically caches payments, loans, and group statistics to device storage.
  - If a member opens the app in an area with no internet, they see a subtle `⚡ Offline Mode` badge with their last synced balance and payment history.
  - When back online, the app seamlessly refreshes data in the background.
* **Double-Tap Back to Exit:** Tapping the Android hardware back button respects page history and prompts before closing the app.

---

## 2. Getting Your First APK from GitHub Actions

Whenever code is pushed to the `feature/mobile-app` or `main` branch, GitHub compiles the APK automatically in the cloud.

### Step 1: Open GitHub Actions
1. Go to your GitHub repository: [`https://github.com/lithafawfadh/Santha`](https://github.com/lithafawfadh/Santha).
2. Click the **Actions** tab at the top.
3. You will see the workflow **"Build & Release Android APK"** running (or completed with a green checkmark).

### Step 2: Download the APK
1. Click the completed workflow run.
2. Scroll to the bottom to the **Artifacts** section.
3. Click **`Santha-Android-APK`** to download the zip file.
4. Extract the zip file to get **`Santha.apk`** (approx. 5 MB).

---

## 3. How to Share with Members (WhatsApp / Google Drive)

### Method A: Direct WhatsApp Share (Simplest)
1. Attach the `Santha.apk` file directly in your WhatsApp group or send it to members individually.
2. Members tap the file to download and install.

### Method B: Google Drive / Cloud Link
1. Upload `Santha.apk` to Google Drive or Dropbox.
2. Set link permissions to *"Anyone with the link can view"*.
3. Share the download link with your group.

### Member Installation Instructions (Send this to members):
> **How to install Santha on Android:**
> 1. Download `Santha.apk` from the WhatsApp group / link.
> 2. Tap the downloaded file.
> 3. If your phone asks *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
> 4. Tap **Install** and then **Open**.
> 5. Log in with your username!

---

## 4. Releasing Updates (Effortless 1-Command Workflow)

Whenever you make any changes or improvements in the future, getting a new APK takes just one command:

```bash
git add .
git commit -m "Describe your update here"
git push
```

GitHub Actions will automatically wake up, re-compile the app, and generate a new `Santha.apk` under the Actions tab in ~2 minutes!

### Creating an Official Versioned Release (e.g., v1.0.0):
To create a permanent download page on GitHub Releases:
```bash
git tag v1.0.0
git push --tags
```
GitHub Actions will automatically create a public Release page at `https://github.com/lithafawfadh/Santha/releases` with a permanent direct download link for `Santha.apk`.
