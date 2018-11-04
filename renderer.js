const { ipcRenderer } = require("electron");
const QRCode = require("qrcode");

const stdoutEl = document.getElementById("proxy-stdout");
const canvasEl = document.getElementById("canvas");

const reg = /DEBUG_COMM_HTTP_PROXY=[^|]+\|ws:\/\/([^:]*):8435/g;

ipcRenderer.on("proxy-stdout", (event, msg) => {
  const str = Buffer.from(msg).toString();
  stdoutEl.innerHTML += str;

  // extract ip from logs
  const res = reg.exec(str);
  if (res && res[1]) {
    const [, ip] = res;
    QRCode.toCanvas(canvasEl, ip, { width: 300, height: 300 });
  }
});
