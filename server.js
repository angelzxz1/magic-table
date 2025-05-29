import { parse } from "node:url";
import {
    createServer,
    Server,
    IncomingMessage,
    ServerResponse,
} from "node:http";
import next from "next";
import { WebSocket, WebSocketServer } from "ws";
import { Socket } from "node:net";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();
const clients = new Set();

nextApp.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res, parse(req.url || "", true));
    });

    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws) => {
        clients.add(ws);
        console.log("New client connected");
        ws.on("message", (message, isBinary) => {
            console.log(`Message received: ${message}`);
            clients.forEach((client) => {
                if (
                    client.readyState === WebSocket.OPEN &&
                    message.toString() !== `{"event":"ping"}`
                ) {
                    client.send(message, { binary: isBinary });
                }
            });
        });

        ws.on("close", () => {
            clients.delete(ws);
            console.log("Client disconnected");
        });
    });

    server.on("upgrade", (req, socket, head) => {
        const { pathname } = parse(req.url || "/", true);

        if (pathname === "/_next/webpack-hmr") {
            nextApp.getUpgradeHandler()(req, socket, head);
        }

        if (pathname === "/api/ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });

    server.listen(3000);
    console.log("Server listening on port 3000");
});
