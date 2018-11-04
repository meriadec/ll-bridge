const { fork } = require("child_process");
const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  // setup proxy, send stdout to window
  const forkPath = "node_modules/@ledgerhq/hw-http-proxy-devserver/bin.js";
  const child = fork(forkPath, [], { silent: true });
  const onData = msg => mainWindow.webContents.send("proxy-stdout", msg);
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
