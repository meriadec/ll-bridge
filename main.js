const { fork } = require("child_process");
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;
let child;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  // setup proxy, send stdout to window
  const onData = msg => mainWindow.webContents.send("proxy-stdout", msg);
  const forkPath = path.resolve(
    __dirname,
    "node_modules/@ledgerhq/hw-http-proxy-devserver/bin.js"
  );
  child = fork(forkPath, [], { silent: true });
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  child.kill("SIGINT");
  app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
