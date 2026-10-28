// FlowLab desktop shell: loads the offline app in a locked-down window
// and (installer version only) checks GitHub Releases for updates.
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win = null;
let manualCheck = false;
const isPortable = !!process.env.PORTABLE_EXECUTABLE_DIR;   // set by the portable .exe
const canUpdate = app.isPackaged && !isPortable;            // not in dev, not portable

function createWindow() {
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 900, minHeight: 600,
    backgroundColor: '#10141c',
    title: 'FlowLab',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Links to websites open in the normal browser, never inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) {
      e.preventDefault();
      if (/^https?:/.test(url)) shell.openExternal(url);
    }
  });
}

function setupUpdates() {
  if (!canUpdate) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;   // installs on next quit if the user clicks Later

  autoUpdater.on('update-available', info => {
    if (manualCheck) dialog.showMessageBox(win, { type: 'info', title: 'Update found',
      message: 'FlowLab ' + info.version + ' is downloading.', detail: 'You will be asked to restart when it is ready.' });
  });
  autoUpdater.on('update-not-available', () => {
    if (manualCheck) dialog.showMessageBox(win, { type: 'info', title: 'Up to date',
      message: 'You have the latest version (' + app.getVersion() + ').' });
    manualCheck = false;
  });
  autoUpdater.on('update-downloaded', info => {
    manualCheck = false;
    dialog.showMessageBox(win, {
      type: 'info', buttons: ['Restart now', 'Later'], defaultId: 0, cancelId: 1,
      title: 'Update ready', message: 'FlowLab ' + info.version + ' is ready to install.',
      detail: 'Your saved workflows are kept. Choose Later to install it the next time you close FlowLab.'
    }).then(r => { if (r.response === 0) autoUpdater.quitAndInstall(); });
  });
  autoUpdater.on('error', err => {
    console.error('Update error:', err && err.message);
    if (manualCheck) dialog.showMessageBox(win, { type: 'warning', title: 'Update check failed',
      message: 'Could not check for updates.', detail: 'Check your internet connection and try again later.' });
    manualCheck = false;
  });

  autoUpdater.checkForUpdates().catch(() => {});   // quiet check at startup
}

function checkNow() {
  if (!canUpdate) {
    dialog.showMessageBox(win, { type: 'info', title: 'Updates',
      message: isPortable ? 'The portable version cannot update itself.' : 'Updates only work in the installed app.',
      detail: 'Download the newest version from the project\'s Releases page.' });
    return;
  }
  manualCheck = true;
  autoUpdater.checkForUpdates().catch(() => { manualCheck = false; });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'File', submenu: [{ role: 'quit' }] },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { label: 'Help', submenu: [
      { label: 'Check for updates', click: checkNow },
      { label: 'About and disclaimer', click: () => dialog.showMessageBox(win, {
        type: 'info', title: 'About FlowLab', message: 'FlowLab ' + app.getVersion(),
        detail: 'Independent offline learning tool. Not affiliated with, endorsed by, or sponsored by n8n GmbH, HighLevel Inc. (GoHighLevel) or Anthropic. Product names are trademarks of their owners and are used only for description. Provided "as is" without warranty. See DISCLAIMER.md.'
      }) }
    ]}
  ]));
  createWindow();
  setupUpdates();
});
app.on('window-all-closed', () => app.quit());
