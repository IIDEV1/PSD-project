const net = require("net");
const { spawn } = require("child_process");

const HOST = "127.0.0.1";
const START_PORT = 4173;
const END_PORT = 4190;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, HOST);
  });
}

async function findFreePort() {
  for (let port = START_PORT; port <= END_PORT; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error(`No free port found in range ${START_PORT}-${END_PORT}`);
}

async function main() {
  const port = await findFreePort();
  const httpServerBin = require.resolve("http-server/bin/http-server");

  console.log(`Starting server on http://${HOST}:${port}`);

  const child = spawn(process.execPath, [httpServerBin, ".", "-p", String(port), "-c-1"], {
    stdio: "inherit",
    shell: false,
  });

  const stopChild = () => {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  };

  process.on("SIGINT", stopChild);
  process.on("SIGTERM", stopChild);

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
