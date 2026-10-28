# FlowLab desktop (Windows .exe)

## Make the .exe (about 5 minutes, needs internet once)
1. Install **Node.js LTS** from https://nodejs.org (accept the defaults).
2. Unzip this folder anywhere.
3. Double-click **build-windows.bat**.
4. When it finishes, open the **dist** folder:
   - `FlowLab-Portable-1.1.0.exe` is a portable app: copy it anywhere and run it. It does not update itself.
   - `FlowLab-Setup-1.1.0.exe` is a normal installer. It checks for updates (see RELEASING.md).

After it is built, FlowLab works fully offline. Only the first build needs internet.

To try it without building, double-click **run-without-building.bat**.

## What's new in 1.1
- **Test panel.** Running a workflow now plays it out like the real thing: the form your visitor fills in (or the webhook request, or the schedule), the texts arriving on the contact's phone, the emails in each inbox, and a CRM-style contact record with tags, fields and an activity timeline. Wait steps fast-forward a simulated clock.
- **Real conditions.** IF accepts several conditions joined by AND or OR, with typed operators (text, number, date, true/false, lists/tags, empty/exists) that behave like n8n's IF node, including its type conversions and error messages. Tested against n8n 2.45.
- **Switch node.** Several named branches plus a None branch, first match like GoHighLevel's If/Else and n8n's Switch, or every match like Zapier Paths and Make's Router.
- **Realistic failures.** Invalid phone numbers, empty recipients, Do Not Disturb contacts, empty template fields, HTTP errors and broken Code nodes behave the way real tools do.
- **Execution view.** Click any node after a run to see the data that went in and came out.
- **Compiled script.** `node workflow.js --fast` skips waiting, `--data file.json` runs with your own data, and `--serve 3000` serves a real form page and a webhook endpoint on your computer.
- Also: Remove tag node, Wait in minutes/hours/days, cron rule on Schedule, zoom, a File menu, new docs tabs (Conditions, Other tools), and an n8n export fix (Send Email now exports as plain text, so the body is no longer empty).
- Workflows saved by 1.0 open and are upgraded automatically.

## Updates
The installer version can update itself from GitHub Releases once you set it up. Read **RELEASING.md**.

## Good to know
- Windows may show a blue "SmartScreen" warning because the app is not code-signed. Choose **More info, then Run anyway**. Signing needs a paid certificate.
- Some antivirus tools flag unsigned Electron apps. This is a common false alarm.
- Your workflows are saved inside the app's own storage. Use **File, Export JSON** to keep backups.
- Change `author`, `appId` and the name in `LICENSE` to your own before sharing.

## Files
- `app/index.html`: the whole FlowLab app
- `main.js`: the desktop window
- `build/`: logo (`logo.svg`, `icon.png`, `icon.ico`)
- `DISCLAIMER.md`, `LICENSE`: legal text

## Troubleshooting
**"Cannot create symbolic link : A required privilege is not held by the client"** (shows while downloading winCodeSign)
Windows blocks the build tool from unpacking a file. Fix it once:
1. Turn on **Developer Mode**: Windows 11: Settings, System, For developers. Windows 10: Settings, Update and Security, For developers.
2. Delete the folder `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign` (paste that into File Explorer's address bar).
3. Close the black window, open a new one, and run `build-windows.bat` again.
Alternative: right-click `build-windows.bat` and choose **Run as administrator**.

**"npm audit" reports vulnerabilities.** These are in build tools on your computer, not inside the finished app. Do not run `npm audit fix --force`; it can break the build.

**If `run-without-building.bat` says Electron failed to install**, run `npm approve-scripts electron` and try again.
