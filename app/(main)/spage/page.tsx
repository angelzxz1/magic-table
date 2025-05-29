"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState<
        "connected" | "disconnected" | "connecting"
    >("connecting");
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnectionStatus("connected");
        };

        ws.onclose = () => {
            setConnectionStatus("disconnected");
        };

        ws.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`{"event":"ping"}`);
            }
        }, 29000);

        return () => {
            clearInterval(pingInterval);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(newMessage);
            setNewMessage("");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center ">
            <div className="w-full max-w-2xl mx-4 rounded-xl shadow-lg flex flex-col h-[80vh] border border-gray-200">
                <div
                    className={`px-6 py-3 text-sm font-medium rounded-t-xl ${
                        connectionStatus === "connected"
                            ? "text-green-700 border-b border-green-100"
                            : connectionStatus === "disconnected"
                            ? "text-red-700 border-b border-red-100"
                            : "text-yellow-700 border-b border-yellow-100"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                connectionStatus === "connected"
                                    ? "bg-green-500"
                                    : connectionStatus === "disconnected"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                            }`}
                        ></div>
                        Status: {connectionStatus}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 ">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className=" p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                        >
                            <p className="font-medium">{message}</p>
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={sendMessage}
                    className="border-t border-gray-100 p-6  rounded-b-xl"
                >
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <Button
                            type="submit"
                            disabled={connectionStatus !== "connected"}
                        >
                            Send
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
