"use client";

import { useEffect, useRef } from "react";

export default function useWebSocket(onMessage: (data: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
        wsRef.current = ws;

        wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            onMessage(msg);
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            wsRef.current?.close();
        };
    }, [onMessage]);

    const send = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { send, ws: wsRef.current };
}
