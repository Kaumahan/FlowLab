# Releasing updates

The **installer** version (`FlowLab-Setup-x.y.z.exe`) checks GitHub Releases when it starts and
downloads newer versions. When the download finishes the user chooses **Restart now** or **Later**
(Later installs it the next time FlowLab is closed). Users can also use **Help, Check for updates**.

The **portable** version cannot update itself. Portable users download the new file from Releases.

## One-time setup
1. Create a **public** GitHub repository (for example `flowlab`). Updates from private repositories need extra setup and are not recommended.
2. In `package.json`, under `build.publish`, replace `YOUR-GITHUB-USERNAME` and `flowlab` with your account and repository names.
3. Create a token: GitHub, Settings, Developer settings, Personal access tokens. Give it permission to write to that repository's contents (classic token: the `repo` scope). Keep it secret and never put it in the project files.

## Every release
1. Raise `version` in `package.json`. The updater only offers a version higher than the installed one.
2. Double-click `release-windows.bat` and paste your token when asked. It builds and uploads a **draft** release.
3. On GitHub, open Releases, check the draft files (the `.exe` files and `latest.yml`), then click **Publish release**.
4. Users on the installer version receive it the next time they open FlowLab.

## Test an update before trusting it
1. Release 1.0.0, install `FlowLab-Setup-1.0.0.exe` on a test PC and save a workflow.
2. Release 1.0.1, then open the installed 1.0.0 app. It should offer the update.
3. After restarting, confirm the workflow is still there.

## Rules that protect your users
- Never change `appId` or `productName`. Saved workflows live in a folder named after the app, so changing them makes workflows seem to disappear.
- Keep the `latest.yml` file in each release. Without it the updater finds nothing.
- Do not rename uploaded files; the names in `latest.yml` must match.
- Windows may show SmartScreen warnings for unsigned apps. Updates still work; only a code-signing certificate removes the warning.
- Each update check contacts GitHub (which sees the user's IP address and the app version). FlowLab sends nothing else.
- To remove auto-update completely, delete the `electron-updater` lines from `main.js` and `package.json`.
